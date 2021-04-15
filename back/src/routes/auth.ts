
import express, { Request,Response} from "express";
import * as jwt from "jsonwebtoken";
import { knexQuery } from "../database/pg";
import validator from 'validator';
import { UsersTable } from "../database/table";
import { sha256 } from 'sha.js'
const ExampleJsonResponse = require('../../const/responseExample.json') as ResponseDataExample;

const AuthRouter = express.Router(); 
  
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

AuthRouter.post('/signup',async (req : Request, res : Response) => {
    const signupData = req.body as SignUpFormData
    const data = (JSON.parse(JSON.stringify(ExampleJsonResponse))) as ResponseSignUp;

    if (!signupData.password || !signupData.username){
        return res.sendStatus(500)
    }

    const userData = await knexQuery<UsersTable>('users').select('id')
    .where('password',(new sha256().update(signupData.password).digest('hex')))
    .andWhere('username',signupData.username)

    if (userData.length < 1){
        data.errorCode = 0
        data.data.push({
            errorCode : 10,
            errorDescription : 'Неверные данные для входа или пароль'
        })
        return res.send(data)
    }

    res.cookie('auth',jwt.sign({id:userData[0].id}, process.env.SECRET),{
        maxAge : 604800000, // 7 days
    })
    return res.send(data)

})

export default AuthRouter;  