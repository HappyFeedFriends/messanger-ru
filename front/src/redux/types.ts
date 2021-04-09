import { Socket } from "socket.io-client"
import { UserLocalData,ChannelStorage, MessageInterface } from "../../../global/types"

export const APP_LOADING_STATE = 'APP_LOADING_STATE'
export const APP_USER_INIT_STATE = 'APP_USER_INIT_STATE'
export const APP_USER_UPDATE_LANG = 'APP_USER_UPDATE_LANG'
export const APP_USER_UPDATE_MESSAGE_VISIBLE = 'APP_USER_UPDATE_MESSAGE_VISIBLE'

export const MESSAGE_CHANNEL_ID_STATE = 'MESSAGE_CHANNEL_ID_STATE'
export const MESSAGE_CHANNEL_MESSAGES = 'MESSAGE_CHANNEL_MESSAGES'

export const STORAGE_INIT = 'STORAGE_USERS_INIT'
export const STORAGE_MESSAGES_INIT = 'STORAGE_MESSAGES_INIT'
export const STORAGE_MESSAGES_ADDED = 'STORAGE_MESSAGES_ADDED'

interface ActionRedux{
    type : string,
    payload : any,
}

interface UpdateLoadingState extends ActionRedux {
    type: typeof APP_LOADING_STATE
    payload: boolean
}

interface UpdateLanguageState extends ActionRedux {
    type: typeof APP_USER_UPDATE_LANG
    payload: string
}

interface UpdateMessageVisibleState extends ActionRedux {
    type: typeof APP_USER_UPDATE_MESSAGE_VISIBLE
    payload: messageFormat
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
 
interface InitStorage extends ActionRedux {
    type: typeof STORAGE_INIT
    payload: StorageRedux
}

interface InitStorageMessages extends ActionRedux {
    type: typeof STORAGE_MESSAGES_INIT
    payload: {
        channelID : number,
        messages : MessageInterface[]
    }
}

interface StorageMessageAdded extends ActionRedux {
    type: typeof STORAGE_MESSAGES_ADDED
    payload: {
        channelID : number,
        message : MessageInterface
    }
}


export interface UserData{
    id : number,
    Channels : Array<number>, 
}

export interface AppRedux{
    AppLoading : boolean,
    user : UserData,
    lang : string,
    Socket : Socket,
    messageFormat : messageFormat
}

export interface StorageRedux {
    users : UserLocalData[],
    channels : ChannelStorage,
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

export type InitStorageTypes = InitStorage;
export type InitStorageMessagesTypes = InitStorageMessages;
export type StorageMessageAddedTypes = StorageMessageAdded;
export type UpdateStorageState = InitStorageTypes | InitStorageMessages | StorageMessageAdded



export type UpdateLoadingTypes = UpdateLoadingState
export type UpdateUserTypes = UpdateUserState
export type UpdateLanguageTypes = UpdateLanguageState;
export type UpdateMessageFormatTypes = UpdateMessageVisibleState;
export type UpdateAppState = UpdateLoadingTypes | UpdateUserTypes | UpdateLanguageTypes | UpdateMessageFormatTypes