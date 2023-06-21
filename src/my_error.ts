import { StatusCode } from "hono/utils/http-status";

export class MyError extends Error {
    status: StatusCode;
    constructor(message: string, status: StatusCode) {
        super(message);
        this.status = status;
    }
}