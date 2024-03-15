import type { EdgeCollection } from "arangojs/collection";
import type { aql } from "arangojs";
import type { GeneratedAqlQuery } from "arangojs/aql";
import { IHeartache } from "./model";
import { PAGE_SIZE } from "../_config";
declare type aqlType = typeof aql;

const create = (aql: aqlType, table: EdgeCollection, heartache: Partial<IHeartache>) => {
    return aql`
        INSERT {
            _from: ${heartache._from},
            _to: ${heartache._to},
            emotion: ${heartache.emotion},
            duration: ${heartache.duration}
        }
        INTO ${table}
        OPTIONS { waitForSync: false }
        RETURN NEW
    `;
}

const getByUser = (aql: aqlType, table: EdgeCollection, userKey: string) => {
    return aql`
        FOR h IN ${table}
        FILTER h._from == CONCAT('users/', ${userKey})
        LIMIT ${PAGE_SIZE}
        RETURN h
    `;
}

const getByApology = (aql: aqlType, table: EdgeCollection, apologyKey: string) => {
    return aql`
        FOR h IN ${table}
        FILTER h._to == CONCAT('apologies/', ${apologyKey})
        LIMIT ${PAGE_SIZE}
        RETURN h
    `;
}

export const queries = {
    create,
    getByUser,
    getByApology
}