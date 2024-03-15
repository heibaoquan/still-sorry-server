
import type { NextFunction, Request, Response } from "express";
import { jwtConfig } from "../_config/jwt";

export const queryStatus = (error: boolean, internalMsg: string,
    errMsg: string, payload: any, httpCode: number) => {
        return {
            error,
            internalMsg,
            errMsg,
            payload,
            httpCode,
          };
    }

export const printErr = (e: any) => {
    return `${e.name} | ${e.message}`;
}

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (typeof (err) === 'string')
        return res.status(400).json({ message: err });

    if (err.name === 'UnauthorizedError')
        return res.status(401).json({ message: 'Invalid Token' });

    return res.status(500).json({ message: err.message });
}