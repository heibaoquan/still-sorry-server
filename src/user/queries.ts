import type { DocumentCollection } from "arangojs/collection";
import type { aql } from "arangojs";
import type { GeneratedAqlQuery } from "arangojs/aql";
import { IUser } from "./model";
declare type aqlType = typeof aql;

const authenticate = (aql: aqlType, table: DocumentCollection<IUser>, user: Partial<IUser>) : GeneratedAqlQuery => {
    return aql`
        FOR u IN ${table}
        FILTER u.firebaseToken == ${user.firebaseToken}
        LIMIT 1
        OPTIONS { waitForSync: false }
        RETURN u
    `;
}

const login = (aql: aqlType, table: DocumentCollection<IUser>, user: Partial<IUser>) : GeneratedAqlQuery => {
    return aql`
        UPSERT { firebaseToken: ${user.firebaseToken} }
        INSERT {
            name: ${user.name},
            firebaseToken: ${user.firebaseToken},
            deleted: false,
            banned: false,
            createdAt: DATE_NOW()
        }
        UPDATE {
            lastSeenAt: DATE_NOW()
        }
        INTO ${table}
        OPTIONS { waitForSync: false }
        RETURN NEW
    `;
}

const getById = (aql: aqlType, table: DocumentCollection<IUser>, userKey: string) : GeneratedAqlQuery => {
    return aql`
        FOR u IN ${table}
        FILTER u._key == ${userKey}
        LIMIT 1
        OPTIONS { waitForSync: false }
        RETURN u
    `;
}

const deleteById = (aql: aqlType, table: DocumentCollection<IUser>, userKey: string) : GeneratedAqlQuery => {
    return aql`
        FOR u IN ${table}
        FILTER u._key == ${userKey}
        REMOVE u IN ${table}
        OPTIONS { waitForSync: false }
    `;
}

export const queries = {
    authenticate,
    login,
    getById,
    deleteById
}