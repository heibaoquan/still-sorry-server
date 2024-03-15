import type { NextFunction, Request, Response, Router } from "express";
import type express from "express";
import Controller from "../_helpers/controller.base-class";
import AuthService from "./service";
import { IUser } from "../user/model";

declare type Express = typeof express;

class AuthController extends Controller {

    public router: Router;

    constructor(
        protected readonly express: Express,
        protected readonly AuthService: AuthService
    ) {
        super("Auth Controller", express);
        this.router = this.express.Router();

        this.router.post('/login', this.login);
    }

    login = async (req: Request<{}, {}, IUser, {}>, res: Response, next: NextFunction) => {
        const { body: { firebaseToken } } = req;
        req.queryStatus = await this.AuthService.login({ firebaseToken });
        return next();
    }

}

export default AuthController;