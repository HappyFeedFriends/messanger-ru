import express, { NextFunction } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import loggerMiddleware from "./middleWare/loggerMiddleWare";
import routerAPI from "./routes/api";
import AuthRouter from "./routes/auth";
import cors from 'cors';
import { Server, Socket } from "socket.io";
import { socket_connect } from "./socket";
import { Response } from "express-serve-static-core";
import path from "path";
import fs from "fs";
import { knexQuery } from "./database/pg";


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

const port = process.env.PORT || 3000;
console.log(process.env)

app.use(cors(corsOptions)); 
app.use(cookieParser('dev'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware)
app.use('/api',routerAPI);
app.use('/auth',AuthRouter)

app.get('/uploads/:filename/:scheme?',(req,res,next) => {
    const name = req.params.filename
    if (!name){
        return next()
    }

    if (req.params.scheme == 'download'){
        return res.download('uploads/' + name,err => {
            next()
        })
    }

    fs.stat('uploads/' + name,err => {
        if (err){
            next();
        }
    })

    return res.sendFile('uploads/' + name,{ root: path.join(__dirname, '../')})
    
})
app.get('/*',async (req,res,next) => {
    const file = req.path == '/' ? 'index.html' : req.path
    return res.sendFile(path.join(__dirname, '../../front/build/', file));
})

app.use(function(req : Express.Request, res, next : NextFunction){
    res.sendStatus(404);
});

const server = app.listen( port, () => {
    console.log( `server started at port:${ port }` );
});

server.addListener('close',() => {
    console.log('server closed')
})

const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});
 
io.on("connect", (socket: Socket) => socket_connect(socket,io));




