
import type express from "express";
declare type Express = typeof express;

abstract class Controller {

    private _location: string;

    constructor(
        location: string,
        protected readonly express: Express
    ) {
        this._location = location;
    }

    protected get location() {
        return this._location;
    }

    protected set location(value: string) {
        this._location = value;
    }
}

export default Controller;