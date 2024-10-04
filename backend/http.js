import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';


const app = express();

const serverHttp = createServer(app);

const io = new Server(serverHttp);

io.on('connection', (socket) => {
    console.log('cliente conectou', socket.id);
    socket.on('disconnect', ()=>{
        console.log('cliente desconectado');
    })
})

//Configura o JSON response
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const ipv4 = process.env.IPV4;
const port = process.env.PORT || 5000;
//Configura o CORS
app.use(cors({credentials: true, origin: `${ipv4}${port}`}));

app.use(express.static('public'));


export { serverHttp, io, app }