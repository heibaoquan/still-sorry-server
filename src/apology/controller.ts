import type { NextFunction, Request, Response, Router } from "express";
import type express from "express";
import Controller from "../_helpers/controller.base-class";
import { IApology } from "./model";
import { IQueryIds, IQueryId } from "../_helpers/models";
import ApologyService from "./service";
declare type Express = typeof express;

class ApologyController extends Controller {

    public router: Router;
    
    constructor(
        protected readonly express: Express,
        protected readonly ApologyService: ApologyService
    ) {
        super("Apology Controller", express);
        this.router = this.express.Router();

        this.router.get('/getByIds', this.getByIds);
        this.router.get('/getByUsers', this.getByUsers);
        this.router.put('/create', this.create);
        this.router.delete('/deleteByIds', this.deleteByIds);
    }

    getByIds = async (req: Request<{}, {}, {}, IQueryIds>, res: Response, next: NextFunction) : Promise<void> => {
        const { query: { ids } } = req; 
        req.queryStatus = await this.ApologyService.getByIds(ids);
        return next()
    }

    getByUsers = async (req: Request<{}, {}, {}, IQueryIds>, res: Response, next: NextFunction) : Promise<void> => {
        const { query: { ids: userKeys } } = req;
        req.queryStatus = await this.ApologyService.getByUsers(userKeys);
        return next()
    }

    create = async (req: Request<{}, {}, IApology, {}>, res: Response, next: NextFunction) : Promise<void> => {
        const { body: { subject, object, authorKey, hidden } } = req;
        const apology = { subject, object, authorKey, hidden };
        req.queryStatus = await this.ApologyService.create(apology);
        return next();
    }

    deleteByIds = async (req: Request<{}, {}, {}, IQueryIds>, res: Response, next: NextFunction) : Promise<void> => {
        const { query: { ids: apologyKeys }, user } = req;
        const { sub: userKey } = user ?? {};

        if (!userKey) return next("User auth error");

        req.queryStatus = await this.ApologyService.deleteByIds(userKey, apologyKeys);
        return next();
    }

}

export default ApologyController;