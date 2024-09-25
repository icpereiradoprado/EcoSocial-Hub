import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';


const app = express();

const serverHttp = createServer(app);

const io = new Server(serverHttp);

//Config JSON response
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const ipv4 = process.env.IPV4;
const port = process.env.PORT || 5000;
//Solve CORS
app.use(cors({credentials: true, origin: `${ipv4}${port}`}));

app.use(express.static('public'));


export { serverHttp, io, app }