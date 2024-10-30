import AuthService from '../services/AuthService.js'
import EducationalContentService from '../services/EducationalContentService.js'
import jwt from 'jsonwebtoken'
import { io } from '../../http.js';

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
                io.emit('educationalcontentcreate', content);
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

    static async deleteEducationalContent(req, res){
        try {
            const { authorization } = req.headers;
            const token = AuthService.getToken(authorization);
            if(!token){
                throw new Error('Acesso Negado!');
            }

            const decoded = jwt.verify(token, process.env.SECRET);

            if(Number(decoded.isAdmin) && Number(decoded.isAdmin) === 1){
                await EducationalContentService.delete(req.params);
                io.emit('educationalcontentdeleted', req.params.id);
                res.status(201).json({
                    message : 'Conteúdo deletado com sucesso!',
                    id: req.params.id
                });
            }else{
                throw Error('Acesso Negado! Você precisa ser um administrador para executar esta ação!');
            }
        } catch (err) {
            res.status(400).json({ message : err.message});
        }
    }

    static async getAllEducationalContent(req, res){
        try {
            const contents = await EducationalContentService.getAll(req.params);
            res.status(200).json(contents);
        } catch (err) {
            res.status(422).json({ message: err.message});
        }
    }

    static async editEducationalContent(req, res){
        const { authorization } = req.headers;
        try{
            const token = AuthService.getToken(authorization);
            if(!token){
                throw new Error('Acesso Negado!');
            }

            const decoded = jwt.verify(token, process.env.SECRET);

            if(Number(decoded.isAdmin) && Number(decoded.isAdmin) === 1){
                const user = await AuthService.getUserByToken(authorization);
                const updatedContent  = await EducationalContentService.edit(req.body, req.params.id, user.id);
                io.emit('educationalcontentedit', updatedContent);
                res.status(200).json(updatedContent);
            }else{
                throw Error('Acesso Negado! Você precisa ser um administrador para executar esta ação!');
            }
            
        }catch(err){
            res.status(500).json({
                message: err.message
            });
        }
    }
}