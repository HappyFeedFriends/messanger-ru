export const APP_LOADING_STATE = 'APP_LOADING_STATE'



interface ActionRedux{
    type : string,
    payload : any,
}

interface UpdateLoadingState extends ActionRedux {
    type: typeof APP_LOADING_STATE
    payload: boolean
}

export interface AppRedux{
    AppLoading : boolean
}

export type UpdateLoadingTypes = UpdateLoadingState
export type UpdateAppState = UpdateLoadingTypes