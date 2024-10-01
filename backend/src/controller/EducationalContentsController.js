import AuthService from '../services/AuthService.js'
import EducationalContentService from '../services/EducationalContentService.js'
import jwt from 'jsonwebtoken'

export default class EducationalContentsController{

    static async registerEducationalContent(req, res){
        try {
            const { authorization } = req.headers;
            const token = AuthService.getToken(authorization);

            if(!token){
                throw new Error('Acesso Negado!');
            }

            const decoded = jwt.verify(token, process.env.SECRET);

            if(Number(decoded.isAdmin) && Number(decoded.isAdmin) === 1){
                const content = await EducationalContentService.register(req.body);
                res.status(201).json({
                    message : 'Conteúdo criado com sucesso!',
                    id: content.id,
                    title: content.title
                });
            }else{
                throw Error('Acesso Negado! Você precisa ser um administrador para executar esta ação!');
            }
        } catch (err) {
            res.status(400).json({ message : err.message})
        }
    }

    static async deleteEducationalContent(){

    }

    static async getAllEducationalContent(req, res){
        try {
            const contents = await EducationalContentService.getAll();
            res.status(200).json(contents);
        } catch (err) {
            res.status(422).json({ message: err.message});
        }
    }

    static async editEducationalContent(){

    }
}