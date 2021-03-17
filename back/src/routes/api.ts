import express, { NextFunction,Request,Response} from "express";
import * as jwt from "jsonwebtoken";
import { knexQuery } from "../database/pg";
import { ChannelListTable, MessagechannelsTable, UsersTable } from "../database/table";
import { jwtCookie } from "../types/cookies";
import { ChannelStorage, MessageInterface, ResponseDataExample,ResponseMessageData,ResponseUserData,UserDataResponse } from '../../../global/types';
const ExampleJsonResponse = require('../../const/responseExample.json') as ResponseDataExample;

const routerAPI = express.Router()

interface MessageInterfaceQuery extends MessageInterface{
  MessageChannelID : number,
}

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
  const query_user_channels = knexQuery('messages').select('AuthorID').whereIn('MessageChannelID',query_channels).distinctOn('AuthorID')
  const query_messages = knexQuery('messages').select('AuthorID','MessageChannelID','created_at','content','id').whereIn('MessageChannelID',query_channels)
  const users = await knexQuery('users')
  .join('images','users.imageID','=','images.id')
  .select('users.username','users.id','images.Url')
  .whereIn('users.id',query_user_channels)
  .orWhereIn('users.id',knexQuery('channellist').select('UserID').whereIn('MessageChannelID',query_channels).distinctOn('UserID'))
  const channels : ChannelStorage = Object.values(await knexQuery('channellist').select('UserID','MessageChannelID')
  .whereIn('MessageChannelID',query_channels)
  ).reduce((prev,current) => {
    prev[current.MessageChannelID] = prev[current.MessageChannelID] || {
      users : [],
      messages : undefined,

    }
    prev[current.MessageChannelID].users.push(current.UserID)
    return prev;
  },{})

  const obj = {
    id : id,
    Channels : Object.values(await knexQuery<ChannelListTable>('channellist').select('MessageChannelID').where('UserID',id)).reduce((prev,current) => {
      prev.push(current.MessageChannelID)
      return prev
    },[]),
    Users : users,
    channelsStorage : channels,
  } as UserDataResponse   

  data.data.push( obj )
  res.send(data)
})
   
routerAPI.get('/messages/:id/:offset?',async (req : Request, res : Response,next) => {
  const channel_id = req.params.id
  const offset = Number(req.params.offset) || 0

  const data = (JSON.parse(JSON.stringify(ExampleJsonResponse))) as ResponseMessageData;
  data.data.push(await knexQuery('messages').select('AuthorID','MessageChannelID','created_at','content','id').where('MessageChannelID',channel_id).limit(50).offset(offset))
  res.send( data )
})

export default routerAPI; 