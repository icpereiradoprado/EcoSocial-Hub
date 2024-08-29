import { app, serverHttp } from "./http.js";
import { router as userRouters } from "./routes/UserRouters.js";

//Routes
app.use('/users', userRouters)

serverHttp.listen(5000, ()=>{
    console.log('O servidor está rodando na porta 5000');
});