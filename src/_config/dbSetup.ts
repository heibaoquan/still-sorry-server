"use strict";

import { dbConfig } from "./db";

const { db } = require("@arangodb");

db._useDatabase("system");
db._dropDatabase("stillsorry");
db._createDatabase("stillsorry", {}, [
    {
        username: dbConfig.auth.username,
        passwd: dbConfig.auth.password,
        active: true
    }
]);
db._useDatabase("stillsorry");
const docProps = {
    keyOptions: {
        type: "padded",
        allowUserKeys: true,
    },
};
const edgeProps = {
    keyOptions: {
        type: "padded",
        allowUserKeys: false,
    },
};
db._create("users", docProps, "document");
db._create("apologies", docProps, "document");
db._create("heartaches", edgeProps, "edge");
db._create("reports", edgeProps, "edge");

db.users.ensureIndex({
    type: "persistent",
    name: "UQ_user_phone",
    fields: ["firebaseToken"],
    sparse: false,
    unique: true
});

