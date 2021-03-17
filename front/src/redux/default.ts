import { AppRedux, StorageRedux } from "./types";
import { io } from "socket.io-client";


export const APP_DEFAULT = {
    AppLoading : true,
    user : {},
    Socket : io('http://localhost:8080/',{
        withCredentials : true,
    })
} as AppRedux

export const STORAGE_DEFAULT = {
    users : [],
    channels : {},
} as StorageRedux