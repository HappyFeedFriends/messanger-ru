import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import loggerMiddleware from "./middleWare/loggerMiddleWare";
import routerAPI from "./routes/api";
import AuthRouter from "./routes/auth";



const app = express();

dotenv.config();

const port = process.env.SERVER_PORT;

app.use(cookieParser('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(loggerMiddleware)
app.use('/api',routerAPI);
app.use('/auth',AuthRouter)
app.use(function(req, res, next){
    res.sendStatus(404);
});

app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );