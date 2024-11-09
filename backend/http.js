// Importa o framework Express para criar a aplicação backend
import express from 'express';
// Importa CORS para configurar as permissões de origem
import cors from 'cors';
// Importa funções para criar um servidor HTTP padrão
import { createServer } from 'node:http';
// Importa a biblioteca Socket.IO para permitir comunicação em tempo real com os clientes
import { Server } from 'socket.io';

// Inicializa a aplicação Express
const app = express();

// Cria um servidor HTTP utilizando o Express
const serverHttp = createServer(app);

// Inicializa o servidor Socket.IO para habilitar conexões WebSocket no servidor HTTP
const io = new Server(serverHttp);

// Configura o evento de conexão do Socket.IO
io.on('connection', (socket) => {
    console.log('cliente conectou', socket.id); // Loga o ID do cliente ao conectar
    socket.on('disconnect', () => {
        console.log('cliente desconectado'); // Loga ao cliente desconectar
    });
});

// Configura o middleware para permitir JSON no corpo das requisições com limite de 10MB
app.use(express.json({ limit: '10mb' }));
// Configura o middleware para permitir URL-encoded no corpo das requisições com limite de 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Configura as variáveis de ambiente para IP e porta do servidor
const ipv4 = process.env.IPV4;
const port = process.env.PORT || 5000;

// Configura o CORS para permitir conexões com credenciais a partir do IP e porta especificados
app.use(cors({ credentials: true, origin: `${ipv4}${port}` }));

// Configura a pasta 'public' como estática para servir arquivos diretamente
app.use(express.static('public'));

// Exporta o servidor HTTP, o servidor Socket.IO e a aplicação Express
export { serverHttp, io, app };
