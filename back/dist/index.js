"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const loggerMiddleWare_1 = __importDefault(require("./middleWare/loggerMiddleWare"));
const api_1 = __importDefault(require("./routes/api"));
const open_1 = __importDefault(require("open"));
const app = express_1.default();
dotenv_1.default.config();
const port = process.env.SERVER_PORT;
app.get("/", (req, res) => {
    return {
        qwerty: '32',
    };
});
app.use(cookie_parser_1.default('dev'));
app.use(body_parser_1.default.json());
app.use(loggerMiddleWare_1.default);
app.use(api_1.default);
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
    open_1.default(`http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map