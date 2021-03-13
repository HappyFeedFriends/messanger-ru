import express, { NextFunction,Request,Response} from "express";
import * as jwt from "jsonwebtoken";

const routerAPI = express.Router()

routerAPI.use((request : Request,response : Response ,next : NextFunction) : void => {
    console.log(request.cookies)
    next();
})
routerAPI.get('/',(req : Request,res : Response) => {
    return res.send({ message : req.cookies})
})

export default routerAPI;