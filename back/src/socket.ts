import { Socket,Server } from "socket.io";
import * as jwt from "jsonwebtoken";
import { MessageSendInterface } from "../../global/types";
import { knexQuery } from "./database/pg";
import { ChannelListTable } from "./database/table";

function parseCookies(cookie_str : string) {
    var list = {} as { [cookieName : string] : string }

    if (!cookie_str){
        return list;
    }
    cookie_str.split(';').forEach(function(cookie) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = unescape(parts.join('='));
    });

    return list;
}

export const socket_connect = async (socket : Socket, io : Server) => {
    const token = parseCookies(socket.request.headers.cookie).auth
    let isAuth = !!token
    let id : undefined | string = null;
    if (token){
        jwt.verify(token,process.env.SECRET,(err: jwt.VerifyErrors,decoded : jwt.VerifyCallback) => {
          isAuth = err === null;
          
      })
    }

    const verify = jwt.verify(token,process.env.SECRET) as { id : string } | string

    if (typeof verify == 'object'){
        id = verify.id
    }else{
        id = verify
    }

    if (!isAuth || !id){
        socket.disconnect();
        console.log('socket not authentication')
        return;
    }


    const userChannels = await knexQuery<ChannelListTable>('channellist').select('MessageChannelID').where('UserID',id)

    Object.values(userChannels).forEach(data => {
        socket.join('channel_room_' + data.MessageChannelID)
    })

    console.log(`connect socket ${socket.id}`);

    socket.on('message_send',(data : MessageSendInterface,callback) => {
    })

    socket.on("disconnect", () => {
        console.log(`disconnect ${socket.id}`);
    });

}