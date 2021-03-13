"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routerAPI = express_1.default.Router();
routerAPI.get('/test', (req) => {
    return [
        '1', 2, 3, 4, 5, 65, 6
    ];
});
exports.default = routerAPI;
//# sourceMappingURL=api.js.map