
import express, { NextFunction,Request,Response} from "express";
import * as jwt from "jsonwebtoken";
import { ResponseDataExample, ResponseSignIn, ResponseUserData, SignInFormData } from "../../../global/types";
import { knexQuery } from "../database/pg";
import validator from 'validator';
import { UsersTable } from "../database/table";
import { sha256 } from 'sha.js'
const ExampleJsonResponse = require('../../const/responseExample.json') as ResponseDataExample;

const AuthRouter = express.Router(); 
  
AuthRouter.get('/user_data',async (req : Request,res : Response) => {

    const data = await knexQuery('users').select('*').where('id',2).first()
    res.cookie('auth',jwt.sign({id:data.id}, process.env.SECRET),{
        maxAge : 604800000, // 7 days
    })
    res.redirect('http://localhost:3000/channel')
})  

AuthRouter.post('/signin',async (req : Request, res : Response) => {
    const signinData = req.body as SignInFormData
    const data = (JSON.parse(JSON.stringify(ExampleJsonResponse))) as ResponseSignIn;


    if (!signinData.date || !signinData.email || !signinData.password || !signinData.username){
        return res.sendStatus(500)
    }

    if (!validator.isEmail(signinData.email)){
        data.data.push({
            errorCode : 0,
            errorDescription : 'Неккоректно указан адрес электронной почты'
        })
    }

    if(!validator.isStrongPassword(signinData.password,{
        minLength : 6,
        minNumbers : 0,
        minSymbols : 0,
        minLowercase : 0,
        minUppercase : 0,
    })){
        data.data.push({
            errorCode : 1,
            errorDescription : 'Минимальная длина пароля - 6 символов'
        }) 
    }

    if (!validator.isDate(signinData.date.toString())){
        data.data.push({
            errorCode : 2,
            errorDescription : 'Неккоректно указанная дата'
        }) 
    }
    
    if (signinData.username.length < 6){
        data.data.push({
            errorCode : 3,
            errorDescription :  'Минимальная длина - 6 символов'
        })   
    }

    if (data.data.length > 0){
        data.errorCode = 0
        return res.send(data)
    }

    if ((await knexQuery<UsersTable>('users').select('*').where('username',signinData.username)).length > 0){
        data.errorCode = 0

        data.data.push({
            errorCode : 4,
            errorDescription : 'Данное имя пользователя уже используется'
        }) 

        return res.send(data)
    }

    const userData = (await knexQuery<UsersTable>('users').insert({
        email : signinData.email,
        username : signinData.username,
        password : new sha256().update(signinData.password).digest('hex'),

    }).returning('id'))
    res.cookie('auth',jwt.sign({id:userData[0]}, process.env.SECRET),{
        maxAge : 604800000, // 7 days
    })

    return res.send(data)


})
   
export default AuthRouter;  