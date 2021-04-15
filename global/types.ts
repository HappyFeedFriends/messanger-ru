export interface ResponseDataExample {
    data : Array<any>,
    errorCode : number,
    errorMessage : string,
    status : boolean,
}
 
export interface  UserDataResponse {
    id : number,
    Users : Array<UserLocalData>,
    User : UserData,
    channelsStorage : ChannelStorage,
}

export interface FriendData {
    Url : string,
    username : string,
    id : number,
    onlinestatus : boolean,
}

export interface UserData extends UserLocalData{
    id : number,
    Channels : Array<number>, 
    email : string,
    friendsList : Array<FriendData>,
}

export interface SignResponse{
    errorDescription : string,
    errorCode : number,
}
export interface ResponseUserFriendListData extends ResponseDataExample{
    data : Array<FriendData> | Array<number>
}
export interface ResponseUserData extends ResponseDataExample{
    data : Array<UserDataResponse>
}

export interface ResponseSignIn extends ResponseDataExample{
    data : Array<SignResponse>
}

export interface ResponseSignUp extends ResponseDataExample{
    data : Array<SignResponse>
}

export interface CreatedChannelData{
    storage : ChannelStorage,
    user : UserLocalData
}

export interface ResponseCreatedChannel extends ResponseDataExample{
    data : Array<CreatedChannelData>
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
    Url? : string,
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
    file? :{
        filename : string,
        file : Buffer
    },
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

export interface SignUpFormData{
    username : string,
    password : string,
}

export interface FeedbackData{
    theme : string,
    text : string,
}


export interface UserUpdateInfo{
    password : string,
    new_password? : string,
    username? : string,
    email? : string,
}