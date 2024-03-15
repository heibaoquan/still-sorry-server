import type { DocumentCollection } from "arangojs/collection";
import type { aql } from "arangojs";
import type { GeneratedAqlQuery } from "arangojs/aql";
import { IApology } from "./model";
import { PAGE_SIZE } from "../_config";
declare type aqlType = typeof aql;

const getByIds = (aql: aqlType, table: DocumentCollection<IApology>, ids: string[]) : GeneratedAqlQuery => {
    return aql`
        FOR a IN ${table}
        FILTER a._key IN ${ids}
        FILTER a.hidden == FALSE
        LIMIT ${PAGE_SIZE}
        OPTIONS { waitForSync: false }
        RETURN a
    `;
}

const getByUsers = (aql: aqlType, table: DocumentCollection<IApology>, userKeys: string[]) : GeneratedAqlQuery  => {
    return aql`
        FOR a IN ${table}
        FILTER a.authorKey IN ${userKeys}
        FILTER a.hidden == FALSE
        LIMIT ${PAGE_SIZE}
        OPTIONS { waitForSync: false }
        RETURN a
    `;
}

const create = (aql: aqlType, table: DocumentCollection<IApology>, apology: Partial<IApology>) : GeneratedAqlQuery  => {
    return aql`
        INSERT {
            subject: ${apology.subject},
            object: ${apology.object},
            authorKey: ${apology.authorKey},
            createdAt: ${apology.createdAt},
            expiresAt: ${apology.expiresAt},
            hidden: ${apology.hidden}
        }
        INTO ${table}
        OPTIONS { waitForSync: false }
        RETURN NEW
    `;
}

const deleteByIds = (aql: aqlType, table: DocumentCollection<IApology>, userKey: string, apologyKeys: string[]) : GeneratedAqlQuery  => {
    return aql`
        FOR a IN ${table}
        FILTER a.userKey == ${userKey}
        FILTER a._key IN ${apologyKeys}
        REMOVE a IN ${table}
        OPTIONS { waitForSync: false }
        RETURN OLD
    `;
}

const deleteByUser = (aql: aqlType, table: DocumentCollection<IApology>, userKey: string) : GeneratedAqlQuery => {
    return aql`
        FOR a IN ${table}
        FILTER a.userKey == ${userKey}
        REMOVE a IN ${table}
        OPTIONS { waitForSync: false }
        RETURN OLD
    `;
}

export const queries = {
    getByIds,
    getByUsers,
    create,
    deleteByIds,
    deleteByUser
}