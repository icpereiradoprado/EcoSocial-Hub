import { io } from 'socket.io-client'
import Constants from 'expo-constants'

const url = Constants.manifest2.extra.expoClient.extra.apiUrl;

let socket;

export const connectSocket = (token) => {
    if (socket) {
        socket.disconnect();
        socket = null; // Redefina a instância
    }

    if (!socket) {
        socket = io(`${url}`, {
            query: { token }
        });
    }
    socket.on('connect', () => {
        console.log('MOBILE Socket conectado:', socket.id);
    });
    socket.on('disconnect', () => {
        console.log('MOBILE Socket desconectado', socket.id);
    });
    return socket;
};

export const getSocket = () => {
    return socket;
};