import { AppRedux, StorageRedux } from "./types";

export const APP_DEFAULT = {
    AppLoading : true,
    user : {},
} as AppRedux

export const STORAGE_DEFAULT = {
    users : [],
    channels : {},
} as StorageRedux