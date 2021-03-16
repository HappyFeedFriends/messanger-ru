import {combineReducers } from 'redux';
import { APP_DEFAULT, STORAGE_DEFAULT } from './default';
import { AppRedux, APP_LOADING_STATE, APP_USER_INIT_STATE, StorageRedux, STORAGE_INIT, UpdateAppState, UpdateStorageState } from './types';

function APPReducer(state = APP_DEFAULT,actions : UpdateAppState) : AppRedux{
    switch (actions.type) {
        case APP_LOADING_STATE:
            return {...state,AppLoading : actions.payload}
        case APP_USER_INIT_STATE:
            return {...state,user : actions.payload}
        default:
            return state;
    }
}

function StorageReducer(state = STORAGE_DEFAULT,actions : UpdateStorageState) : StorageRedux {
    switch (actions.type) {
        case STORAGE_INIT:
            return {...state,users : actions.payload.users, channels : actions.payload.channels}
        default:
            return state;
    }    
}

export const rootReducer = combineReducers({
    APPReducer :  APPReducer,
    StorageReducer : StorageReducer
})
export type RootState = ReturnType<typeof rootReducer>
