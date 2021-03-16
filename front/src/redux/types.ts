export const APP_LOADING_STATE = 'APP_LOADING_STATE'
export const APP_USER_INIT_STATE = 'APP_USER_INIT_STATE'

export const MESSAGE_CHANNEL_ID_STATE = 'MESSAGE_CHANNEL_ID_STATE'
export const MESSAGE_CHANNEL_MESSAGES = 'MESSAGE_CHANNEL_MESSAGES'

interface ActionRedux{
    type : string,
    payload : any,
}

interface UpdateLoadingState extends ActionRedux {
    type: typeof APP_LOADING_STATE
    payload: boolean
}

interface UpdateUserState extends ActionRedux {
    type: typeof APP_USER_INIT_STATE
    payload: UserData
}

interface UpdateMessageChannel extends ActionRedux {
    type: typeof MESSAGE_CHANNEL_ID_STATE
    payload: number
}

interface UpdateMessagesForChat extends ActionRedux {
    type: typeof MESSAGE_CHANNEL_MESSAGES
    payload: {
        id : number,
        content : MessageInterface[],
    }
}

export interface UserData{
    userName : string,   
    Channels : Array<number>, 
}

export interface UserLocalData{
    username : string,
    id : number,
    Url : string, // avatar_url
}

export interface MessageInterface{
    createdAt : Date,
    id : number,
    content : string,
    authorID : number,
}

export interface AppRedux{
    AppLoading : boolean,
    user : UserData,
}

export interface MessageRedux{
    SelectMessageID : number,
    MessagesByID : {
        [channelID : number] : MessageInterface[],
    },
}
export type UpdateMessageChannelTypes = UpdateMessageChannel
export type UpdateMessagesForChatTypes = UpdateMessagesForChat
export type UpdateMessageState = UpdateMessageChannelTypes | UpdateMessagesForChatTypes


export type UpdateLoadingTypes = UpdateLoadingState
export type UpdateUserTypes = UpdateUserState
export type UpdateAppState = UpdateLoadingTypes | UpdateUserTypes