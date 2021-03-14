import { APP_LOADING_STATE, UpdateLoadingTypes } from "./types";

export function AppUpdateLoadingAction(state : boolean) : UpdateLoadingTypes{
    return {
        type: APP_LOADING_STATE,
        payload:state,
    }
}