import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';


const app = express();

const serverHttp = createServer(app);

const io = new Server(serverHttp);

//Config JSON response
app.use(express.json())

//Solve CORS
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

app.use(express.static('public'));


export {serverHttp, io, app}