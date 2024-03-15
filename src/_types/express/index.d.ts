import express from "express";
import { JwtPayload } from "jsonwebtoken";
import { IQueryStatus } from "../../_helpers/models";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
            queryStatus?: IQueryStatus
            newToken?: string
        }
    }
}