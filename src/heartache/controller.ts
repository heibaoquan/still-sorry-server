import type { NextFunction, Request, Response, Router } from "express";
import type express from "express";
import Controller from "../_helpers/controller.base-class";
import { IHeartache } from "./model";
import { IQueryId } from "../_helpers/models";
import HeartacheService from "./service";

declare type Express = typeof express;

class HeartacheController extends Controller {

    public router: Router;

    constructor (
        protected readonly express: Express,
        protected readonly HeartacheService: HeartacheService
    ) {
        super("Heartache Service", express);
        this.router = this.express.Router();

        this.router.get('/getByApology', this.getByApology);
        this.router.get('/getByUser', this.getByUser);
        this.router.post('/create', this.create); 
    }

    getByApology = async (req: Request<{}, {}, {}, IQueryId>, res: Response, next: NextFunction) => {
        const { query: { id: apologyKey } } = req;
        req.queryStatus = await this.HeartacheService.getByApology(apologyKey);
        return next();
    }

    getByUser = async (req: Request<{}, {}, {}, IQueryId>, res: Response, next: NextFunction) => {
        const { query: { id: userKey } } = req;
        req.queryStatus = await this.HeartacheService.getByUser(userKey);
        return next();
    }

    create = async (req: Request<{}, {}, IHeartache, {}>, res: Response, next: NextFunction) => {
        const { body: { _from, _to, emotion, duration } } = req;
        req.queryStatus = await this.HeartacheService.create({ _from, _to, emotion, duration });
        return next();
    }

}

export default HeartacheController;