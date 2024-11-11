/**IMPORTS NECESSÁRIOS PARA O COMPONENTE */
import { io } from 'socket.io-client'
import Constants from 'expo-constants'

// URL do servidor, obtida das configurações do Expo
const url = Constants.manifest2.extra.expoClient.extra.apiUrl;

let socket; // Variável para armazenar a instância do socket

/**
 * Conecta ao socket do servidor usando o token fornecido.
 * Se houver uma instância de socket existente, ela é desconectada e redefinida antes de criar uma nova conexão.
 * A conexão usa o token do usuário como parte da query para autenticação no servidor.
 * 
 * @param {string} token - O token JWT usado para autenticar o usuário na conexão socket.
 * @returns {object} - A instância do socket conectada.
 */
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

/**
 * Retorna a instância atual do socket, permitindo acesso em outras partes do código.
 */
export const getSocket = () => {
    return socket;
};