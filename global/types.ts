export interface ResponseDataExample {
    data : Array<any>,
    error : number,
    errorMessage : string,
    status : boolean,
}
export interface  UserDataResponse {
    UserName : string,
    Channels : Array<number>,
    // Users : Array<>
}
export interface ResponseUserData extends ResponseDataExample{
    data : Array<UserDataResponse>
}