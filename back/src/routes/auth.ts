
import express, { NextFunction,Request,Response} from "express";
import * as jwt from "jsonwebtoken";
import { knexQuery } from "../database/pg";


const AuthRouter = express.Router(); 
  
AuthRouter.get('/user_data',async (req : Request,res : Response) => {

    const data = await knexQuery('users').select('*').where('id',2).first()
    res.cookie('auth',jwt.sign({id:data.id}, process.env.SECRET))
    res.redirect('http://localhost:3000/messages')
})  
   
export default AuthRouter;  