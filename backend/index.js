import pool from "./db/conn.js";
import { app, serverHttp } from "./http.js";
import { router as userRouters } from "./routes/UserRouters.js";
import { router as postRouters } from "./routes/PostRouters.js";

//Routas para usuários
app.use('/users', userRouters);

//Routas para posts
app.use('/posts', postRouters);


serverHttp.listen(5000, ()=>{
    console.log('O servidor está rodando na porta 5000');
});