import { Socket } from "socket.io-client"

export const APP_LOADING_STATE = 'APP_LOADING_STATE'
export const APP_USER_INIT_STATE = 'APP_USER_INIT_STATE'
export const APP_USER_UPDATE = 'APP_USER_UPDATE'
export const APP_USER_UPDATE_LANG = 'APP_USER_UPDATE_LANG'
export const APP_USER_UPDATE_MESSAGE_VISIBLE = 'APP_USER_UPDATE_MESSAGE_VISIBLE'
export const APP_USER_UPDATE_FRIENDLIST = 'APP_USER_UPDATE_FRIENDLIST'
export const APP_USER_UPDATE_CHANNELS = 'APP_USER_UPDATE_CHANNELS'
export const APP_USER_PUSH_FRIENDLIST = 'APP_USER_PUSH_FRIENDLIST'

export const MESSAGE_CHANNEL_ID_STATE = 'MESSAGE_CHANNEL_ID_STATE'
export const MESSAGE_CHANNEL_MESSAGES = 'MESSAGE_CHANNEL_MESSAGES'

export const STORAGE_INIT = 'STORAGE_USERS_INIT'
export const STORAGE_MESSAGES_INIT = 'STORAGE_MESSAGES_INIT'
export const STORAGE_MESSAGES_ADDED = 'STORAGE_MESSAGES_ADDED'
export const STORAGE_USER_UPDATE = 'STORAGE_USER_UPDATE'
export const STORAGE_CHANNEL_ADD_USER = 'STORAGE_CHANNEL_ADD_USER'

interface ActionRedux{
    type : string,
    payload : any,
}

interface UpdateChannelsPushUserState extends ActionRedux {
    type: typeof STORAGE_CHANNEL_ADD_USER
    payload: StorageChannelUserPush
}

interface UpdateChannelsState extends ActionRedux {
    type: typeof APP_USER_UPDATE_CHANNELS
    payload: CreatedChannelData
}

interface UpdateLoadingState extends ActionRedux {
    type: typeof APP_LOADING_STATE
    payload: boolean
}

interface UpdateUserFriendsPushState extends ActionRedux{
    type : typeof APP_USER_PUSH_FRIENDLIST
    payload : FriendData
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
    type: typeof APP_USER_INIT_STATE | typeof APP_USER_UPDATE
    payload: UserData
}

interface UpdateUserFriendListState extends ActionRedux {
    type: typeof APP_USER_UPDATE_FRIENDLIST
    payload: Array<FriendData>
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

interface StorageUserUpdate extends ActionRedux {
    type : typeof STORAGE_USER_UPDATE
    payload : UserLocalData,
}

export interface AppRedux{
    AppLoading : boolean,
    user : UserData,
    lang : string,
    Socket : Socket,
    messageFormat : messageFormat
}

export interface StorageChannelUserPush{
    user_id : number,
    channel_id : number,
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
export type StorageUserUpdateTypes = StorageUserUpdate;
export type UpdateChannelsPushUserTypes = UpdateChannelsPushUserState;
export type UpdateStorageState = InitStorageTypes | InitStorageMessages | StorageMessageAdded | StorageUserUpdateTypes | UpdateChannelsTypes | UpdateChannelsPushUserTypes



export type UpdateLoadingTypes = UpdateLoadingState
export type UpdateUserFriendListTypes = UpdateUserFriendListState
export type UpdateUserTypes = UpdateUserState
export type UpdateUserFriendsPushTypes = UpdateUserFriendsPushState
export type UpdateLanguageTypes = UpdateLanguageState;
export type UpdateMessageFormatTypes = UpdateMessageVisibleState;
export type UpdateChannelsTypes = UpdateChannelsState;
export type UpdateAppState = UpdateLoadingTypes | UpdateUserTypes | UpdateLanguageTypes | UpdateMessageFormatTypes | UpdateUserFriendListTypes | UpdateChannelsTypes | UpdateUserFriendsPushTypes