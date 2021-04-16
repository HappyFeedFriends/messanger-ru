import express, { NextFunction,Request,Response} from "express";
import { knexQuery } from "../../database/pg";
import { ChannelListTable, FriendsTable, UsersTable } from "../../database/table";

const ExampleJsonResponse = require('../../../const/responseExample.json') as ResponseDataExample;
const RouterFriendsAPI = express.Router()

RouterFriendsAPI.post('/add_friend',async (req,res,next) => {
    const user_id : number =  req.body.user_id
    const id = res.locals.id
    if (!res.locals.id) return res.sendStatus(401);
    if (!user_id || user_id == id) return res.sendStatus(500);
  
    const isDuplicate = (await knexQuery<FriendsTable>('friendlist').select('*')
    .where('friend_1',user_id).andWhere('friend_2',id)
    .orWhere('friend_1',id).andWhere('friend_2',user_id)).length > 0
  
    if (isDuplicate) return res.sendStatus(500)
  
    const data = (JSON.parse(JSON.stringify(ExampleJsonResponse))) as ResponseDataExample;
  
    await knexQuery<FriendsTable>('friendlist').insert([
      {
        friend_1 : id,
        friend_2 : user_id,
      },
      {
        friend_1 : user_id,
        friend_2 : id,
      }
    ])
    data.data.push(await knexQuery<UsersTable>('users')
    .select('users.onlinestatus','users.username','users.id','users.onlinestatus','images.Url')
    .join('images','images.id','=','users.imageID')
    .where('users.id',user_id).first())
    return res.send(data)
  
})
   
RouterFriendsAPI.get('/friendlist',async (req,res,next) => {
    const id = res.locals.id
    const isFullData = req.query.isfull == '1'
    const data = (JSON.parse(JSON.stringify(ExampleJsonResponse))) as ResponseUserFriendListData;

    if (isFullData){
        const users = await knexQuery<FriendsTable>('friendlist').select(knexQuery.ref('friendlist.friend_2').as('id'),'users.username','images.Url','users.onlinestatus')
        .join('users','users.id','=','friendlist.friend_2')
        .join('images','images.id','=','users.imageID')
        .where('friendlist.friend_1',id)
        data.data = users
        return res.send(data) 
    } 

    const users = (await knexQuery<FriendsTable>('friendlist').select('friend_2').where('friend_1',id)).map(value => value.friend_2)
    data.data = users
    return res.send(data)
})

RouterFriendsAPI.post('/addFriendInChat',async (req,res) => {
  const body : BodyAddFriendData = req.body

  if (!body.user_id) return res.sendStatus(500)
  if (await knexQuery<ChannelListTable>('channellist').select('*').where('MessageChannelID',body.channel_id).andWhere('UserID',body.user_id).first()) return res.sendStatus(500)
  const user = await knexQuery<UsersTable>('users')
  .join('images','images.id','=','users.imageID')
  .select('users.username','users.onlinestatus','users.id','images.Url').where('users.id',body.user_id).first()
  if (!user) return res.sendStatus(500)

  const data = (JSON.parse(JSON.stringify(ExampleJsonResponse))) as ResponseGeneric<UserLocalData>;

  await knexQuery<ChannelListTable>('channellist').insert({
    MessageChannelID : body.channel_id,
    UserID : body.user_id,
  })
  data.data.push(user)

  return res.send(data)
  

})


export default RouterFriendsAPI