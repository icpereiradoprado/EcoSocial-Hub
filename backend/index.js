import { app, serverHttp } from "./http.js"
import { router as userRouters } from "./src/routes/userRouters.js"
import { router as educationalContentsRouter } from './src/routes/educationalContentsRouters.js'
//import { router as postRouters } from "./routes/PostRouters.js"

//Routas para usuários
app.use('/users', userRouters);

//Rotas para conteúdos educacionais
app.use('/educationalcontents', educationalContentsRouter);


//Routas para posts
//app.use('/posts', postRouters);


const port = process.env.PORT || 5000;
serverHttp.listen(port, ()=>{
    console.log(`O servidor está rodando na porta ${port}` );
});