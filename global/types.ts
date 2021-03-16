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

export interface ChannelStorage{
    [storageID : string] : number[],
}