import { AppRedux, StorageRedux } from "./types";
import { io } from "socket.io-client";
import Cookies from 'universal-cookie';
const cookie = new Cookies()
export const APP_DEFAULT = {
    AppLoading : true,
    lang : cookie.get('lang') || window.navigator.language,
    messageFormat : cookie.get('messageFormat') || 'cozy',
    user : {},
    Socket : io('http://localhost:8080/',{
        withCredentials : true,
    })
} as AppRedux

export const STORAGE_DEFAULT = {
    users : [],
    channels : {},
} as StorageRedux