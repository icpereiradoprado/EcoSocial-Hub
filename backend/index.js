// Importa o app e serverHttp configurados no arquivo http.js
import { app, serverHttp } from "./http.js";
// Importa as rotas de usuário
import { router as userRouters } from "./src/routes/userRouters.js";
// Importa as rotas de conteúdos educacionais
import { router as educationalContentsRouter } from './src/routes/educationalContentsRouters.js';
// Importa as rotas de centros de reciclagem
import { router as recyclingCenterRouters } from './src/routes/recyclingCenterRouters.js';
// Importa as rotas de postagens
import { router as postRouters } from './src/routes/postRouters.js';
// Importa as rotas de comentários
import { router as commentRouters } from "./src/routes/commentRouters.js";

// Define as rotas de usuário para o caminho '/users'
app.use('/users', userRouters);

// Define as rotas de conteúdos educacionais para o caminho '/educationalcontents'
app.use('/educationalcontents', educationalContentsRouter);

// Define as rotas de centros de reciclagem para o caminho '/recyclingcenters'
app.use('/recyclingcenters', recyclingCenterRouters);

// Define as rotas de postagens para o caminho '/posts'
app.use('/posts', postRouters);

// Define as rotas de comentários para o caminho '/comments'
app.use('/comments', commentRouters);

// Define a porta do servidor com valor padrão de 5000 ou a porta definida nas variáveis de ambiente
const port = process.env.PORT || 5000;

// Inicia o servidor HTTP e exibe uma mensagem informando a porta em que está rodando
serverHttp.listen(port, () => {
    console.log(`O servidor está rodando na porta ${port}`);
});
