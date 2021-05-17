import express from "express";
import { knexQuery } from "../../database/pg";
import { feedbackTable } from "../../database/table";

const RouterFeedBackAPI = express.Router()
const ExampleJsonResponse : ResponseDataExample = require('../../../const/responseExample.json');
RouterFeedBackAPI.get('/reports',async (req, res) => {

    let id = res.locals.id
    const data : ResponseGeneric<FeedBackAPIData[]> = (JSON.parse(JSON.stringify(ExampleJsonResponse)));

    data.data.push((await knexQuery<feedbackTable>('feedback').select('feedback.text','feedback.theme','feedback.created_at','users.username','feedback.id')
    .join('users','users.id','=','feedback.AuthorID')
    .orderBy('feedback.created_at','asc')
    .limit(10)))

    return res.send(data)

  

})

export default RouterFeedBackAPI