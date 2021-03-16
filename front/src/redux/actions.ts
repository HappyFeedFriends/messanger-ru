import { APP_LOADING_STATE, APP_USER_INIT_STATE, MessageInterface, MESSAGE_CHANNEL_ID_STATE, MESSAGE_CHANNEL_MESSAGES, UpdateLoadingTypes, UpdateMessageChannelTypes, UpdateMessagesForChatTypes, UpdateUserTypes, UserData } from "./types";

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