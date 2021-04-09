import { MessageInterface } from "../../../global/types";
import { APP_LOADING_STATE, APP_USER_INIT_STATE, APP_USER_UPDATE_LANG, APP_USER_UPDATE_MESSAGE_VISIBLE, InitStorageMessagesTypes, InitStorageTypes, MESSAGE_CHANNEL_ID_STATE, MESSAGE_CHANNEL_MESSAGES, StorageMessageAddedTypes, StorageRedux, STORAGE_INIT, STORAGE_MESSAGES_ADDED, STORAGE_MESSAGES_INIT, UpdateLanguageTypes, UpdateLoadingTypes, UpdateMessageChannelTypes, UpdateMessageFormatTypes, UpdateMessagesForChatTypes, UpdateUserTypes, UserData } from "./types";
 
export function AppUpdateLoadingAction(state : boolean) : UpdateLoadingTypes{
    return {
        type: APP_LOADING_STATE,
        payload:state,
    }
}

export function AppUserDataAction(state : UserData) : UpdateUserTypes{
    return {
        type: APP_USER_INIT_STATE,
        payload:state,
    }
}

export function AppUserLanguageAction(lang : string) : UpdateLanguageTypes{
    return {
        type: APP_USER_UPDATE_LANG,
        payload:lang,
    }
}

export function AppUserMessageVisibleAction(format : messageFormat) : UpdateMessageFormatTypes{
    return { 
        type: APP_USER_UPDATE_MESSAGE_VISIBLE,
        payload:format,
    }
}

export function MessageSelectAction(state : number) : UpdateMessageChannelTypes{
    return {
        type: MESSAGE_CHANNEL_ID_STATE,
        payload:state,
    }
}

export function MessageUpdateForChatAction(state : {id : number,content : MessageInterface[] }) : UpdateMessagesForChatTypes{
    return {
        type: MESSAGE_CHANNEL_MESSAGES,
        payload:state,
    }
}

export function InitStorageAction(data : StorageRedux) : InitStorageTypes{
    return {
        type: STORAGE_INIT,
        payload:data,
    }
}

export function InitStorageMessagesAction(data : { channelID : number,messages : MessageInterface[] }) : InitStorageMessagesTypes{
    return {
        type: STORAGE_MESSAGES_INIT,
        payload:data, 
    }
}

export function StorageMessageAdded(data : { channelID : number,message : MessageInterface }) : StorageMessageAddedTypes{
    return {
        type: STORAGE_MESSAGES_ADDED,
        payload:data, 
    } 
}