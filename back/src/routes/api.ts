import express, { NextFunction,Request,Response} from "express";
import * as jwt from "jsonwebtoken";
import { knexQuery } from "../database/pg";
import { ChannelListTable, feedbackTable, MessagechannelsTable, UsersTable } from "../database/table";
import { jwtCookie } from "../types/cookies";
import { ChannelStorage, FeedbackData, MessageInterface, ResponseCreatedChannel, ResponseDataExample,ResponseMessageData,ResponseUserData,UserDataResponse } from '../../../global/types';
import RouterTestAPI from "./api/test";
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
    res.locals.id = (jwt.verify(req.cookies.auth, process.env.SECRET) as jwtCookie).id
    next();
  }else {
    res.sendStatus(401)
  }
}); 

if (process.env.NODE_ENV == 'development'){
  routerAPI.use('/test',RouterTestAPI)
}
 
routerAPI.get('/user_data',async (req : Request, res : Response) => {
  let id = res.locals.id
  const data = (JSON.parse(JSON.stringify(ExampleJsonResponse))) as ResponseUserData;

  const query_channels = knexQuery('channellist').select('MessageChannelID').where('UserID',id)
  const query_user_channels = knexQuery('messages').select('AuthorID').whereIn('MessageChannelID',query_channels).distinctOn('AuthorID')
  const query_messages = knexQuery('messages').select('AuthorID','MessageChannelID','created_at','content','id').whereIn('MessageChannelID',query_channels)
  // CODE REVIEW
  let users = await knexQuery<UsersTable>('users')
  .join('images','users.imageID','=','images.id')
  .select('users.username','users.id','images.Url','users.onlinestatus')
  .whereIn('users.id',query_user_channels)
  .orWhereIn('users.id',knexQuery('channellist').select('UserID').whereIn('MessageChannelID',query_channels).distinctOn('UserID'))

  if (users.length < 1){
    users = await knexQuery<UsersTable>('users')
    .join('images','users.imageID','=','images.id')
    .select('users.username','users.id','images.Url','users.onlinestatus')
    .where('users.id',id)

    if (users.length < 1){
      res.clearCookie('auth')
      return res.sendStatus(404);
    }
  }
  // CODE REVIEW
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
  data.data.push(await knexQuery('messages')
  .select('messages.AuthorID','messages.MessageChannelID','messages.created_at','messages.content','messages.id','images.Url')
  .leftJoin('images','messages.imageID','=','images.id')
  .where('MessageChannelID',channel_id)
  .orderBy([
    {column : 'created_at',order : 'desc'},
    {column : 'id',order : 'desc'},
  ]).limit(50).offset(offset))
  res.send( data )
})

routerAPI.post('/created_channel',async (req : Request, res : Response,next) => {
  const userID = req.body.userID
  const id = res.locals.id
  const data = (JSON.parse(JSON.stringify(ExampleJsonResponse))) as ResponseCreatedChannel;
  // TODO: added more validations

  const query_channels = knexQuery('channellist').select('MessageChannelID').where('UserID',id)

  const isRealUser = (await knexQuery<UsersTable>('users').select('*').where('id',userID)).length > 0
  if (!isRealUser){
    return res.sendStatus(500)
  }

  const channel_id = (await knexQuery<MessagechannelsTable>('messagechannels').insert({}).returning('id'))[0]
  await knexQuery<ChannelListTable>('channellist').insert([
    {
      UserID : id,
      MessageChannelID : channel_id
    },
    {
      UserID : userID,
      MessageChannelID : channel_id
    },
  ])

  return res.send(data)

})

routerAPI.post('/feedback/:type',async (req : Request, res : Response,next) =>{

  const type = req.params.type

  if (type != 'error' && type != 'review') return res.sendStatus(500);
  if (!res.locals.id) return res.sendStatus(500);


  const feedback = req.body as FeedbackData
  const data = (JSON.parse(JSON.stringify(ExampleJsonResponse))) as ResponseDataExample;
  if (!feedback.text || feedback.text == ''){
    data.errorCode = 0
    data.errorMessage = 'Поле обязательно для заполнения!'
    return res.send(data)
  }

  if (!feedback.theme || feedback.theme == ''){
    data.errorCode = 1
    data.errorMessage = 'Поле обязательно для заполнения!'
    return res.send(data)
  }
  knexQuery<feedbackTable>('feedback').insert({
    text : feedback.text,
    theme : feedback.theme,
    AuthorID : res.locals.id,
    type : type,
  })

  return res.send(data)

})

export default routerAPI; 