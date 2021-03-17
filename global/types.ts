export interface ResponseDataExample {
    data : Array<any>,
    error : number,
    errorMessage : string,
    status : boolean,
}
 
export interface  UserDataResponse {
    id : number,
    Channels : Array<number>,
    Users : Array<UserLocalData>,
    channelsStorage : ChannelStorage,
}
export interface ResponseUserData extends ResponseDataExample{
    data : Array<UserDataResponse>
}


export interface UserLocalData{
    username : string,
    id : number,
    Url : string,
}

export interface MessageInterface{
    created_at : Date,
    id : number,
    content : string,
    AuthorID : number,
}

export interface ChannelStorage{
    [storageID : string] : {
        users : number[],
        messages : MessageInterface[],
    }
}

export interface ResponseMessageData extends ResponseDataExample{
    data : Array<MessageInterface[]>,
}

export interface MessageSendInterface {
    text : string,
    ChannelID : number,
}