import express, { NextFunction,Request,Response} from "express";
import * as jwt from "jsonwebtoken";
import { knexQuery } from "../database/pg";
import { UsersTable } from "../database/table";
import { jwtCookie } from "../types/cookies";

const routerAPI = express.Router()

routerAPI.use('/',(req: Request, res: Response, next: () => void) => {
    
    let isAuth = !!req.cookies.auth;
    if (req.cookies.auth){
      jwt.verify(req.cookies.auth,process.env.SECRET,(err: any) => {
          isAuth = err === null;
      })
    }
  
    if (isAuth)
      next();
    else {
      res.redirect('/auth/user_data')
    }
});
 
routerAPI.get('/user_data',async (req : Request, res : Response) => {
    let id = ((await jwt.verify(req.cookies.auth,process.env.SECRET)) as jwtCookie).id
    res.send(await knexQuery<UsersTable>('users').select('*').where('id',id).first())
})

 

export default routerAPI;