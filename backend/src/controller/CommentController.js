import CommentService from "../services/CommentService.js";
import AuthService from "../services/AuthService.js";
import { io } from "../../http.js";
import jwt from 'jsonwebtoken';

export default class CommentCotroller{

    static async registerComment(req, res){
        try {
            const post = await CommentService.register(req.body);
            io.emit('commentcreate', post);
            res.status(201).json({
                message : 'Comentário criado com sucesso!',
                id: post.id,
                title: post.title
            });
            
        } catch (err) {
            res.status(400).json({ message : err.message})
        }
    }

    static async deleteComment(req, res){
        try {
            const { authorization } = req.headers;
            const token = AuthService.getToken(authorization);
            if(!token){
                throw new Error('Acesso Negado!');
            }

            const decoded = jwt.verify(token, process.env.SECRET);

            const isAdmin = Number(decoded.isAdmin);
            await CommentService.delete(req.params, decoded.id, isAdmin);
            io.emit('commentdeleted', req.params.id);
            res.status(201).json({
                message : 'Post deletado com sucesso!',
                id: req.params.id
            });
        } catch (err) {
            res.status(400).json({ message : err.message});
        }
    }

    static async editComment(req, res){
        const { authorization } = req.headers;
        try{
            const token = AuthService.getToken(authorization);
            if(!token){
                throw new Error('Acesso Negado!');
            }

            const decoded = jwt.verify(token, process.env.SECRET);

            const updatedComment  = await CommentService.edit(req.body, req.params.id, decoded.id);
            io.emit('commentedit', updatedComment);
            res.status(200).json(updatedComment);
            
        }catch(err){
            res.status(500).json({
                message: err.message
            });
        }
    }

    static async getAllComment(req, res){
        try {
            const posts = await CommentService.getAll(req.params);
            res.status(200).json(posts);
        } catch (err) {
            res.status(422).json({ message: err.message});
        }
    }
    
}