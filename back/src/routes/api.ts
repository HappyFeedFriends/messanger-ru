import express, { NextFunction,Request,Response} from "express";
import * as jwt from "jsonwebtoken";
import { knexQuery } from "../database/pg";
import { ChannelListTable, MessagechannelsTable, UsersTable } from "../database/table";
import { jwtCookie } from "../types/cookies";
import { ResponseDataExample,ResponseUserData,UserDataResponse } from '../../../global/types';
const ExampleJsonResponse = require('../../const/responseExample.json') as ResponseDataExample;

const routerAPI = express.Router()

routerAPI.use('/',async (req: Request, res: Response, next: () => void) => {
    
  let isAuth = !!req.cookies.auth;
  if (req.cookies.auth){
    jwt.verify(req.cookies.auth,process.env.SECRET,(err: any) => {
        isAuth = err === null;
    })
  }
   
  if (isAuth){
    res.locals.id = ((await jwt.verify(req.cookies.auth,process.env.SECRET)) as jwtCookie).id
    next();
  }else {
    res.sendStatus(401)
  }
}); 
 
routerAPI.get('/user_data',async (req : Request, res : Response) => {
  let id = res.locals.id
  const data = (JSON.parse(JSON.stringify(ExampleJsonResponse))) as ResponseUserData;

  const query_channels = knexQuery('channellist').select('MessageChannelID').where('UserID',id)
  const query_user_channels = knexQuery('channellist').select('UserID').whereIn('MessageChannelID',query_channels).distinctOn('UserID')
  const users = await knexQuery({
    users : 'users',
    images : 'images',
  }).select('users.username','users.id','images.Url').whereIn('users.id',query_user_channels).where('images.id',knexQuery.ref('users.imageID'))

  const obj = {
    UserName : (await knexQuery<UsersTable>('users').select('*').where('id',id).first()).username,
    Channels : Object.values(await knexQuery<ChannelListTable>('channellist').select('MessageChannelID').where('UserID',id)).reduce((prev,current) => {
      prev.push(current.MessageChannelID)
      return prev
    },[]),
    users : users,
  } as UserDataResponse 
  
  

  data.data.push( obj )
  res.send(data)
})
   
  
export default routerAPI; 