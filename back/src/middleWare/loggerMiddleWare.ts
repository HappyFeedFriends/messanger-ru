import express from "express";

function loggerMiddleware(request: express.Request, response: express.Response, next: () => void) : void {
    console.log(`logged: ${request.method} ${request.path}`);
    next();
}

export default loggerMiddleware;