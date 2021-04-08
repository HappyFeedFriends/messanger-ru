import { AppRedux, StorageRedux } from "./types";
import { io } from "socket.io-client";
import Cookies from 'universal-cookie';

export const APP_DEFAULT = {
    AppLoading : true,
    lang : new Cookies().get('lang') || window.navigator.language,
    user : {},
    Socket : io('http://localhost:8080/',{
        withCredentials : true,
    })
} as AppRedux

export const STORAGE_DEFAULT = {
    users : [],
    channels : {},
} as StorageRedux