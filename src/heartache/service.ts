import type { aql, Database } from "arangojs";
import type { GeneratedAqlQuery } from "arangojs/aql";
import { DocumentCollection, EdgeCollection } from "arangojs/collection";
import { IHeartache } from "./model";
import { printErr, queryStatus } from "../_helpers/util";
import { IQueryStatus } from "../_helpers/models";
import { queries } from "./queries";
declare type Aql = typeof aql;

class HeartacheService {

    Heartaches: EdgeCollection<IHeartache>;

    constructor(
        private readonly DB: Database,
        private readonly aql: Aql
    ) {
        this.Heartaches = DB.collection("heartaches");
    }

    private _handleQuery = async (query: GeneratedAqlQuery) => {
        const resultCursor = await this.DB.query(query);
        let heartaches: Partial<IHeartache>[] = [];

        try {
            await resultCursor.forEach((heartache: Partial<IHeartache>) => {
                heartaches.push(heartache);
            });
            return queryStatus(false, "OK", "", heartaches, 200);
        } catch (e: any) {
            return queryStatus(
                true,
                printErr(e),
                "Error: Some kind of database problem occurred.",
                null,
                500
                )
        }
    }

    create = async (heartache: Partial<IHeartache>) : Promise<IQueryStatus> => {
        const query = queries.create(this.aql, this.Heartaches, heartache);
        return this._handleQuery(query);
    }

    getByUser = async (userKey: string) : Promise<IQueryStatus> => {
        const query = queries.getByUser(this.aql, this.Heartaches, userKey);
        return this._handleQuery(query);
    }

    getByApology = async (apologyKey: string) : Promise<IQueryStatus> => {
        const query = queries.getByApology(this.aql, this.Heartaches, apologyKey);
        return this._handleQuery(query);
    }

}

export default HeartacheService;