import type { aql, Database } from "arangojs";
import type { GeneratedAqlQuery } from "arangojs/aql";
import { DocumentCollection } from "arangojs/collection";
import { IUser } from "./model";
import { printErr, queryStatus } from "../_helpers/util";
import { IQueryStatus } from "../_helpers/models";
import { queries } from "./queries";
declare type Aql = typeof aql;

class UserService {

    Users: DocumentCollection<IUser>;

    constructor(
        private readonly DB: Database,
        private readonly aql: Aql
    ) {
        this.Users = DB.collection("users");
    }

    private _handleQuery = async (query: GeneratedAqlQuery) => {
        const resultCursor = await this.DB.query(query);
        let users: Partial<IUser>[] = [];

        try {
            await resultCursor.forEach((user: Partial<IUser>) => {
                users.push(user);
            });
            return queryStatus(false, "OK", "", users, 200);
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

    getById = async (id: string) : Promise<IQueryStatus> => {
        const query = queries.getById(this.aql, this.Users, id);
        return this._handleQuery(query);
    }

    deleteById = async (id: string) : Promise<IQueryStatus> => {
        const query = queries.deleteById(this.aql, this.Users, id);
        return this._handleQuery(query);
    }

    login = async (user: Partial<IUser>) : Promise<IQueryStatus> => {
        const query = queries.login(this.aql, this.Users, user);
        return this._handleQuery(query);
    }

}

export default UserService;