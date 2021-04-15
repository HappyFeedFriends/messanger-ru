declare interface ResponseDataExample {
    data : Array<any>,
    errorCode : number,
    errorMessage : string,
    status : boolean,
}
 
declare interface  UserDataResponse {
    id : number,
    Users : Array<UserLocalData>,
    User : UserData,
    channelsStorage : ChannelStorage,
}

declare interface FriendData {
    Url : string,
    username : string,
    id : number,
    onlinestatus : boolean,
}

declare interface UserData extends UserLocalData{
    id : number,
    Channels : Array<number>, 
    email : string,
    friendsList : Array<FriendData>,
}

declare interface SignResponse{
    errorDescription : string,
    errorCode : number,
}
declare interface ResponseUserFriendListData extends ResponseDataExample{
    data : Array<FriendData> | Array<number>
}
declare interface ResponseUserData extends ResponseDataExample{
    data : Array<UserDataResponse>
}

declare interface ResponseSignIn extends ResponseDataExample{
    data : Array<SignResponse>
}

declare interface ResponseSignUp extends ResponseDataExample{
    data : Array<SignResponse>
}

declare interface CreatedChannelData{
    storage : ChannelStorage,
    user : UserLocalData
}

declare interface ResponseCreatedChannel extends ResponseDataExample{
    data : Array<CreatedChannelData>
}


interface UserLocalData{
    username : string,
    id : number,
    Url : string,
    onlinestatus : boolean,
}

declare interface MessageInterface{
    created_at : Date,
    id : number,
    content : string,
    AuthorID : number,
    Url? : string,
}

declare interface ChannelStorage{
    [storageID : string] : {
        users : number[],
        messages : MessageInterface[],
    }
}

declare interface ResponseMessageData extends ResponseDataExample{
    data : Array<MessageInterface[]>,
}

declare interface MessageSendInterface {
    text : string,
    file? :{
        filename : string,
        file : Buffer
    },
    ChannelID : number,
}

declare interface MessageSocketAddedInterface extends MessageInterface{
    MessageChannelID : number,

}

declare interface  UpdateOnlineStatisSocket{
    id : string,
    onlinestatus : boolean,
}

declare interface SignInFormData{
    username : string,
    date : Date,
    email : string,
    password : string,
}

declare interface SignUpFormData{
    username : string,
    password : string,
}

declare interface FeedbackData{
    theme : string,
    text : string,
}


declare interface UserUpdateInfo{
    password : string,
    new_password? : string,
    username? : string,
    email? : string,
}