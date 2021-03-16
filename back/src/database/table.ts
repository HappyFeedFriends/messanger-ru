export interface UsersTable{
    id : number;
    username : string,
    password : string,
    imageID : number,
    email : string,
    created_at : Date,
}

export interface ImagesTable{
    id : number;
    Url : string,
    created_at : Date,
}

export interface MessagechannelsTable{
    id : number;
    created_at : Date,
}

export interface MessagesTable{
    id : number;
    AuthorID : number;
    MessageChannelID : number;
    content : string;
    update_at : Date; 
    created_at : Date;
}

export interface ChannelListTable{
    id  : number;
    UserID  : number; 
    MessageChannelID  : number;
}