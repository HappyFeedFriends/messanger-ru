import express, { NextFunction } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import loggerMiddleware from "./middleWare/loggerMiddleWare";
import routerAPI from "./routes/api";
import AuthRouter from "./routes/auth";
import cors from 'cors';
 
const corsOptions : cors.CorsOptions = {
    credentials: true, // This is important.
    origin: (origin, callback ) => {
      if (!origin) return callback(null,true)
      if(['http://localhost:3000', 'http://localhost:8080'].includes(origin))
        return callback(null, true)
  
        callback(new Error('Not allowed by CORS'));
    }
} 

const app = express();

dotenv.config();

const port = process.env.SERVER_PORT;

app.use(cors(corsOptions)); 
app.use(cookieParser('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(loggerMiddleware)
app.use('/api',routerAPI);
app.use('/auth',AuthRouter)
app.use(function(req : Express.Request, res, next : NextFunction){
    res.sendStatus(404);
});

app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );