import express, { NextFunction,Request,Response} from "express";
import { knexQuery } from "../../database/pg";
import { UsersTable } from "../../database/table";
import faker from 'faker';

const RouterTestAPI = express.Router()

// only for development
RouterTestAPI.get('/random_user_list',async (req: Request, res: Response, next: () => void) => {

    let id = res.locals.id

    const query_channels = knexQuery('channellist').select('MessageChannelID').where('UserID',id)
    const maxCount = ((await knexQuery<UsersTable>('users').count('*')) as { count : number }[])[0].count - 1
    const min = 1

    const randomIndex = 0;

    res.send( {
        users : await knexQuery<UsersTable>('users')
        .join('images','users.imageID','=','images.id')
        .select('users.username','users.id','images.Url','users.onlinestatus')
        .whereNot('users.id',id)
        .orderBy('onlinestatus','desc').offset(randomIndex).limit(100)
    })

})


export default RouterTestAPI