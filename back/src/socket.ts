import { Socket,Server } from "socket.io";
import * as jwt from "jsonwebtoken";
import { MessageSendInterface, MessageSocketAddedInterface, UpdateOnlineStatisSocket } from "../../global/types";
import { knexQuery } from "./database/pg";
import { ChannelListTable, ImagesTable, MessagesTable, UsersTable } from "./database/table";
import fs from "fs";
import { sha256 } from "sha.js";

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

    if (!isAuth){
        socket.disconnect();
        console.log('socket not authentication')
        return;
    }

    const verify = jwt.verify(token,process.env.SECRET) as { id : string } | string

    try{
        if (typeof verify == 'object'){
            id = verify.id
        }else{
            id = verify
        } 
    }catch{

    }

    if (!id){
        socket.disconnect();
        console.log('socket not authentication')
        return;
    }

    const userChannels = await knexQuery<ChannelListTable>('channellist').select('MessageChannelID').where('UserID',id)

    await knexQuery<UsersTable>('users').update({
        onlinestatus : true
    }).where('id',id)

    userChannels.forEach(data => {
        socket.join('channel_room_' + data.MessageChannelID)

        io.to('channel_room_' + data.MessageChannelID).emit('update_online_status',{
            id : id,
            onlinestatus : true,
        } as UpdateOnlineStatisSocket)
    })


    
    console.log(`connect socket ${socket.id}`);
    socket.on('message_send',async (data : MessageSendInterface,callback) => {
        // TODO: Added validations
        if (!data.ChannelID) return;
        let idImage,imageUrl;
        if (data.file && data.file.file){
            const filetype = data.file.filename.split('.').pop() || '';
            const fileName = new sha256().update(data.file.filename + id + (new Date().getTime())).digest('hex') + '.' + filetype
            fs.writeFileSync('uploads/' + fileName,data.file.file) 
            imageUrl = socket.handshake.headers.host + '/uploads/' +  fileName
             
            idImage = (await knexQuery<ImagesTable>('images').insert({
                Url : 'http://' + imageUrl, // Temporary, TODO
            }).returning(['id']))[0].id

        }
        const messageData = (await knexQuery<MessagesTable>('messages').insert({
            content : data.text,
            AuthorID : Number(id),
            MessageChannelID : data.ChannelID,
            imageID : idImage,
        }).returning(['AuthorID','MessageChannelID','created_at','content','id']))[0] as MessageSocketAddedInterface
        messageData.Url = 'http://' + imageUrl 
        io.to('channel_room_' + data.ChannelID).emit('add_message',messageData);
    })
 
    socket.on("disconnect", async () => {
        console.log(`disconnect ${socket.id}`);

        await knexQuery<UsersTable>('users').update({
            onlinestatus : false
        }).where('id',id)

        socket.rooms.forEach(room_id => {
            if (room_id.indexOf('channel_room_') === -1) return; // only for channel rooms
            io.to(room_id).emit('update_online_status',{
                id : id,
                onlinestatus : false,
            } as UpdateOnlineStatisSocket)
        })
    });

}