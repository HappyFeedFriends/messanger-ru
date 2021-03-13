import express, { NextFunction,Request,Response} from "express";
import * as jwt from "jsonwebtoken";

const routerAPI = express.Router()

routerAPI.use('/',(req: Request, res: Response, next: () => void) => {
    
    if (req.method == 'POST' && req.url == '/sign'){
        next();
        return;
    }
    
    let isAuth = !!req.cookies.auth;
    if (req.cookies.auth){
      jwt.verify(req.cookies.auth,process.env.SECRET,(err: any) => {
          isAuth = err === null;
      })
    }
  
    if (isAuth)
      next();
    else {
      res.sendStatus(401)
    }
}); 
 
routerAPI.post('/sign',(req : Request,res : Response) => {
    return res.send({ message : req.cookies})
})



export default routerAPI;