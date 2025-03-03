export interface UsersTable{
    id : number;
    username : string,
    password : string,
    imageID : number,
    email : string,
    created_at : Date,
    onlinestatus : boolean,
    IsAdmin : boolean,
}

export interface ImagesTable{
    id : number;
    Url : string,
    created_at : Date,
}

export interface feedbackTable{
    id : number,
    theme : string,
    text : string,
    type : 'error' | 'review',
    AuthorID : number,
    created_at : Date,
}

export interface FriendsTable{
    id : number,
    friend_1 : number,
    friend_2 : number,
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
    imageID? : number,
    content : string;
    update_at : Date; 
    created_at : Date;
}

export interface ChannelListTable{
    id  : number;
    UserID  : number; 
    MessageChannelID  : number;
}