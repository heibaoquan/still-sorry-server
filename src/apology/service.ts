import type { aql, Database } from "arangojs";
import type { GeneratedAqlQuery } from "arangojs/aql";
import { DocumentCollection } from "arangojs/collection"
import { IApology } from "./model";
import { queries } from "./queries";
import { IQueryStatus } from "../_helpers/models";
import { printErr, queryStatus } from "../_helpers/util";
declare type Aql = typeof aql;

class ApologyService {

    Apologies: DocumentCollection<IApology>;

    constructor(
        private readonly DB: Database,
        private readonly aql: Aql
    ) {
        this.Apologies = DB.collection("apologies");
    }

    private _handleQuery = async (query: GeneratedAqlQuery) => {
        const resultCursor =  await this.DB.query(query);
        let apologies: Partial<IApology>[] = [];

        try {
            await resultCursor.forEach((apology: Partial<IApology>) => {
                apologies.push(apology);
            });
            return queryStatus(false, "OK", "", apologies, 200);
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

    getByIds = async (ids: string[]) : Promise<IQueryStatus> => {
        const query = queries.getByIds(this.aql, this.Apologies, ids);
        return this._handleQuery(query);
    }

    getByUsers = (userKeys: string[]) : Promise<IQueryStatus>  => {
        const query = queries.getByUsers(this.aql, this.Apologies, userKeys);
        return this._handleQuery(query);
    }

    create = (apology: Partial<IApology>) : Promise<IQueryStatus>  => {
        const query = queries.create(this.aql, this.Apologies, apology);
        return this._handleQuery(query);
    }

    deleteByIds = (userKey: string, apologyKeys: string[]) : Promise<IQueryStatus>  => {
        const query = queries.deleteByIds(this.aql, this.Apologies, userKey, apologyKeys);
        return this._handleQuery(query);
    }

}

export default ApologyService