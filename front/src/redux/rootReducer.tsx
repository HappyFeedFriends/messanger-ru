import {combineReducers } from 'redux';
import { APP_DEFAULT } from './default';
import { AppRedux, APP_LOADING_STATE, UpdateAppState } from './types';

function APPReducer(state = APP_DEFAULT,actions : UpdateAppState) : AppRedux{
    switch (actions.type) {
        case APP_LOADING_STATE:
            return {...state,AppLoading : actions.payload}
        default:
            return state;
    }
}

export const rootReducer = combineReducers({
    APPReducer :  APPReducer,
})
export type RootState = ReturnType<typeof rootReducer>
