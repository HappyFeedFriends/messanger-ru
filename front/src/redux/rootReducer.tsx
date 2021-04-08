import {combineReducers } from 'redux';
import Cookies from 'universal-cookie';
import { APP_DEFAULT, STORAGE_DEFAULT } from './default';
import { AppRedux, APP_LOADING_STATE, APP_USER_INIT_STATE, APP_USER_UPDATE_LANG, StorageRedux, STORAGE_INIT, STORAGE_MESSAGES_ADDED, STORAGE_MESSAGES_INIT, UpdateAppState, UpdateStorageState } from './types';

function APPReducer(state = APP_DEFAULT,actions : UpdateAppState) : AppRedux{
    switch (actions.type) {
        case APP_LOADING_STATE:
            return {...state,AppLoading : actions.payload}
        case APP_USER_INIT_STATE:
            return {...state,user : actions.payload}
        case APP_USER_UPDATE_LANG:
            new Cookies().set('lang',actions.payload)
            return {...state,lang : actions.payload}
        default:
            return state;
    }
}

function StorageReducer(state = STORAGE_DEFAULT,actions : UpdateStorageState) : StorageRedux {
    switch (actions.type) {
        case STORAGE_INIT:
            return {...state,users : actions.payload.users, channels : actions.payload.channels}
        case STORAGE_MESSAGES_INIT:
            const channels = state.channels
            channels[actions.payload.channelID].messages = actions.payload.messages
            return {...state,channels : channels}
        case STORAGE_MESSAGES_ADDED:
            const channel = state.channels
            channel[actions.payload.channelID].messages.push(actions.payload.message)
            return {...state,channels : channel}
        default:
            return state;
    }    
}

export const rootReducer = combineReducers({
    APPReducer :  APPReducer,
    StorageReducer : StorageReducer
})
export type RootState = ReturnType<typeof rootReducer>
