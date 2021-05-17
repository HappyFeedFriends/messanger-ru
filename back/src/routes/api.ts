import express, { NextFunction,Request,response,Response} from "express";
import * as jwt from "jsonwebtoken";
import { knexQuery } from "../database/pg";
import { ChannelListTable, feedbackTable, FriendsTable, ImagesTable, MessagechannelsTable, UsersTable } from "../database/table";
import { jwtCookie } from "../types/cookies";
import RouterTestAPI from "./api/test";
import RouterFriendsAPI from "./api/friends";
import { sha256 } from "sha.js";
import validator from "validator";
import fs from "fs";
import multer from 'multer';
import RouterFeedBackAPI from "./api/feedback";

const upload = multer() 
const ExampleJsonResponse : ResponseDataExample = require('../../const/responseExample.json');
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
    if (!res.locals.id || typeof res.locals.id !== 'number'){
      return res.sendStatus(401)
    }
    return next();
  }
  res.sendStatus(401)
}); 

routerAPI.use('/friends',RouterFriendsAPI);
routerAPI.use('/feedback',RouterFeedBackAPI)

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

  const user : UserData = {...users.find(value => value.id == id),
    Channels : Object.keys(channels).map(value => Number(value)),
    friendsList : [],
    email : (await knexQuery<UsersTable>('users').select('email').where('id',id).first()).email}
  const obj = {
    id : id,
    Users : users,
    User : user,
    channelsStorage : channels,
  } as UserDataResponse   
  data.data.push( obj )
  return res.send(data)
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

  const userChannels = knexQuery<ChannelListTable>('channellist').select('MessageChannelID')
  .where('UserID',userID)
  const isDuplicate = await knexQuery<ChannelListTable>('channellist').select('*')
  .where('UserID',id)
  .whereIn('MessageChannelID',userChannels)

  if (isDuplicate.length > 0) return res.sendStatus(500)

  const userFind = await knexQuery<UsersTable>('users')
  .join('images','images.id','=','users.imageID')
  .select('users.onlinestatus','users.username','images.Url','users.id')
  .where('users.id',userID)
  if (userFind.length < 1){
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

  const storage : ChannelStorage = {
    [channel_id] : {
      users : [id,userID],
      messages : [],
    }
  }
  data.data.push({
    storage : storage,
    user : userFind[0],
  })
  return res.send(data)

})

routerAPI.post('/feedback/:type',async (req : Request, res : Response,next) =>{

  const type = req.params.type

  if (type != 'error' && type != 'review') return res.sendStatus(500);
  if (!res.locals.id) return res.sendStatus(500);


  const feedback = req.body as FeedbackData
  const data : ResponseDataExample = (JSON.parse(JSON.stringify(ExampleJsonResponse)));
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
  await knexQuery<feedbackTable>('feedback').insert({
    text : feedback.text,
    theme : feedback.theme,
    AuthorID : res.locals.id,
    type : type,
  })

  return res.send(data)

})


//CODE REVIEW
routerAPI.post('/user_update/:type',async (req : Request, res : Response, next) => {

  const type = req.params.type   
  const body = req.body as UserUpdateInfo
  const id = res.locals.id
  const data : ResponseDataExample = (JSON.parse(JSON.stringify(ExampleJsonResponse)));
  if (!id) return res.sendStatus(401);
  if (!body.password) return res.sendStatus(500);
  if (type != 'username' && type != 'password' && type != 'email' && type != 'avatar') return res.sendStatus(500);

  const value = (() => {
    switch (type) {
      case 'username':
        return body.username
      case 'password':
        return body.new_password && new sha256().update(body.new_password).digest('hex') || undefined;
      case 'email' : 
        return body.email
      default:
        return undefined;
    }
  })()
  if (!value) return res.send({...data,errorCode : 1,errorMessage: 'Поле обязательно для ввода!'})
  if (type == 'username' && !!(await knexQuery<UsersTable>('users').select('username').where('username',value).first())) return res.send({...data,errorCode : 1,errorMessage: 'Данное имя пользователя уже занято'})
  if (type == 'email' && !validator.isEmail(value)) return res.send({...data,errorCode : 1,errorMessage: 'Неккоректно указан адрес электронной почты'})
  if (type == 'password' && !validator.isStrongPassword(value,{
    minLength : 6,
    minNumbers : 0,
    minSymbols : 0,
    minLowercase : 0,
    minUppercase : 0,
  })) return res.send({...data,errorCode : 1,errorMessage: 'Минимальная длина пароля - 6 символов'})

  const password_user = (await knexQuery<UsersTable>('users').select('password').where('id',id).first()).password
  const sha_password = new sha256().update(body.password).digest('hex')
  if (password_user !== sha_password) return res.send({...data,errorCode : 0,errorMessage: 'Пароль введён неверно!'})  
  const newData = (await knexQuery<UsersTable>('users').update(type,value).where('id',id).returning(['email','username','id']))[0]
  data.data.push(newData)
  return res.send(data)



})

routerAPI.delete('/user_update',async (req : Request, res : Response, next) => {
  if (!res.locals.id) return res.sendStatus(401);

  await knexQuery<UsersTable>('users').where('id',res.locals.id).del()

  return res.sendStatus(200)
})

routerAPI.post('/user_update_avatar',upload.single('avatar'),async (req : Request, res : Response,next) => {

  const file = req.file
  const id = res.locals.id
  
  if (!file || file.mimetype.split('/')[0] !== 'image' ) return res.sendStatus(500);
  if (!id) return res.sendStatus(500)

  const execFile = file.originalname.split('.').pop()
  const fileName = new sha256().update(file.originalname + id + (new Date().getTime())).digest('hex') + '.' + execFile 
  fs.writeFileSync('uploads/' + fileName,file.buffer) 
  const imageUrl = req.protocol + '://' + req.headers.host + '/uploads/' + fileName 
  const data : ResponseDataExample = (JSON.parse(JSON.stringify(ExampleJsonResponse)));
  const idImage = (await knexQuery<ImagesTable>('images').insert({
    Url : imageUrl,
  }).returning('id'))[0]

  await knexQuery<UsersTable>('users').update('imageID',idImage).where('id',id);
  data.data.push({
    Url :  imageUrl,
    id : id,
  })
  return res.send(data)

}) 
   
routerAPI.get('/users_search',async (req : Request, res : Response,next) => {
  const id = res.locals.id
  const searchName = req.query.text || ''
  const data : ResponseDataExample = (JSON.parse(JSON.stringify(ExampleJsonResponse)));

  if (!searchName){
    data.data.push([])
    return res.send(data)
  }

  const users = await knexQuery<UsersTable>('users').select('users.username','users.id','images.Url')
  .join('images','users.imageID','=','images.id')
  .where('users.username','ilike',`%${searchName}%`).limit(10)
  data.data.push(users)
  return res.send(data)

}) 



export default routerAPI; 