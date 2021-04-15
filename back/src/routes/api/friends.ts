import express, { NextFunction,Request,Response} from "express";
import { ResponseDataExample, ResponseUserFriendListData } from "../../../../global/types";
import { knexQuery } from "../../database/pg";
import { FriendsTable } from "../../database/table";

const ExampleJsonResponse = require('../../const/responseExample.json') as ResponseDataExample;
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
  
    return res.sendStatus(200)
  
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


export default RouterFriendsAPI