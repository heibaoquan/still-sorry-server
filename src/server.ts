import express, { Request, Response, NextFunction } from "express"; 
import { aql, Database } from "arangojs";
import bodyParser from "body-parser";
import * as jwt from "jsonwebtoken";
import { TokenExpiredError, JwtPayload, decode, sign } from "jsonwebtoken";
import https from "https";

import ApologyService from "./apology/service";
import HeartacheService from "./heartache/service";
import UserService from "./user/service";

import ApologyController from "./apology/controller";
import HeartacheController from "./heartache/controller";
import UserController from "./user/controller";
import { dbConfig } from "./_config/db";
import { errorHandler } from "./_helpers/util";
import { expiresIn, jwtConfig } from "./_config/jwt";
import AuthService from "./auth/service";
import AuthController from "./auth/controller";

const app = express();

const DB = new Database({
    url: dbConfig.url,
    databaseName: dbConfig.databaseName,
    auth: dbConfig.auth
});


app.use();
//SECTION - refactor this to _helpers like a respoinsible adult lol
//#region
const jwtHandler = (req: Request, _res: Response, next: NextFunction) => {
    try {
      const { headers: { authorization } } = req;
      const token = authorization ? authorization.split(" ")[1] : 'error';
      const safeToken = token ? token : 'error';
      const { secret } = jwtConfig;

      jwt.verify(safeToken, secret, (err, decoded) : void => {
        if (err && err instanceof TokenExpiredError && Date.now() - (<TokenExpiredError>err).expiredAt.getTime() < 1 * 24 * 60 * 1 * 60000) {
            const oldPayload = decode(safeToken);
            const { sub } = oldPayload ?? {};           
            const newToken = jwt.sign({ sub }, secret, { expiresIn: expiresIn });
            const user = <JwtPayload|undefined>decode(newToken);
            req.user = user;
            req.newToken = newToken;
            next();
        } else if (err) {
            next(err);
        } else {
            req.user = <JwtPayload|undefined>decoded;
            next();
        }
      });
    } catch (e) {
      next(e);
    }
}
  
const jwtRenewer = (req: Request, _res: Response, next: NextFunction) => {
    const { user } = req;
    const { exp = 0 } = user ?? {};


    if (exp >= Date.now()) {
        const { secret } = jwtConfig;
        const { user } = req;
        const { sub } = user ?? {};


        let token = jwt.sign(
            { data: sub },
            secret,
            { expiresIn: expiresIn }
        );
        req.newToken = token;
    }
    next();
}
//#endregion
//!SECTION



const userService: UserService = new UserService(DB, aql);
const authService: AuthService = new AuthService(userService, jwt, jwtConfig);
const apologyService: ApologyService = new ApologyService(DB, aql);
const heartacheService: HeartacheService = new HeartacheService(DB, aql);

const userController: UserController = new UserController(express, userService);
const authController: AuthController = new AuthController(express, authService);
const apologyController: ApologyController = new ApologyController(express, apologyService);
const heartacheController: HeartacheController = new HeartacheController(express, heartacheService);

app.use('/login', authController.router);

app.use(jwtHandler);
app.use(jwtRenewer);

app.use('/user', userController.router);
app.use('/apology', apologyController.router);
app.use('/heartache', heartacheController.router)

app.use(errorHandler);

const port = process.env['NODE_ENV'] === "production" ? 8080 : 4040 ;

app.listen(port, function() {
    console.log("Server listening on port " + port)
})