"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function loggerMiddleware(request, response, next) {
    console.log(`logged: ${request.method} ${request.path}`);
    next();
}
exports.default = loggerMiddleware;
//# sourceMappingURL=loggerMiddleWare.js.map