import type { NextFunction, Request, Response, Router } from "express";
import type express from "express";
import Controller from "../_helpers/controller.base-class";
import { IUser } from "./model";
import { IQueryId } from "../_helpers/models";
import UserService from "./service";

declare type Express = typeof express;

class UserController extends Controller {

    public router: Router;

    constructor(
        protected readonly express: Express,
        protected readonly UserService: UserService
    ) {
        super("User Controller", express);
        this.router = this.express.Router();

        this.router.get('/profile', this.getById);
        this.router.delete('/delete', )
    }

    getById = async (req: Request<{}, {}, {}, IQueryId>, res: Response, next: NextFunction) => {
        const { query: { id: userKey } } = req;
        req.queryStatus = await this.UserService.getById(userKey);
        return next();
    }

    deleteById = async (req: Request<{}, {}, Partial<IUser>, {}>, res: Response, next: NextFunction) => {
        const { user } = req;
        const { sub: userKey } = user ?? {};

        if (!userKey) return next("User auth error");
        
        req.queryStatus = await this.UserService.deleteById(userKey);
    }

}

export default UserController;