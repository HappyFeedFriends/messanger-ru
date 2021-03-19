export interface ResponseDataExample {
    data : Array<any>,
    errorCode : number,
    errorMessage : string,
    status : boolean,
}
 
export interface  UserDataResponse {
    id : number,
    Channels : Array<number>,
    Users : Array<UserLocalData>,
    channelsStorage : ChannelStorage,
}

export interface SignInResponse{
    errorDescription : string,
    errorCode : number,
}

export interface ResponseUserData extends ResponseDataExample{
    data : Array<UserDataResponse>
}

export interface ResponseSignIn extends ResponseDataExample{
    data : Array<SignInResponse>
}


export interface UserLocalData{
    username : string,
    id : number,
    Url : string,
    onlinestatus : boolean,
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

export interface MessageSocketAddedInterface extends MessageInterface{
    MessageChannelID : number,

}

export interface  UpdateOnlineStatisSocket{
    id : string,
    onlinestatus : boolean,
}

export interface SignInFormData{
    username : string,
    date : Date,
    email : string,
    password : string,
}
