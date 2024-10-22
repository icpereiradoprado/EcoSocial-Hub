import jwt from 'jsonwebtoken';
import { io } from '../../http.js';
import PostService from '../services/PostService.js';
import AuthService from '../services/AuthService.js';

export default class PostController{

    static async registerPost(req, res){
        try {
            const post = await PostService.register(req.body);
            io.emit('postcreate', post);
            res.status(201).json({
                message : 'Post criado com sucesso!',
                id: post.id,
                title: post.title
            });
            
        } catch (err) {
            res.status(400).json({ message : err.message})
        }
    }

    static async deletePost(req, res){
        try {
            const { authorization } = req.headers;
            const token = AuthService.getToken(authorization);
            if(!token){
                throw new Error('Acesso Negado!');
            }

            const decoded = jwt.verify(token, process.env.SECRET);

            const isAdmin = Number(decoded.isAdmin);
            await PostService.delete(req.params, decoded.id, isAdmin);
            io.emit('postdeleted', req.params.id);
            res.status(201).json({
                message : 'Post deletado com sucesso!',
                id: req.params.id
            });
        } catch (err) {
            res.status(400).json({ message : err.message});
        }
    }

    static async editPost(req, res){
        const { authorization } = req.headers;
        try{
            const token = AuthService.getToken(authorization);
            if(!token){
                throw new Error('Acesso Negado!');
            }

            const decoded = jwt.verify(token, process.env.SECRET);

            const updatedPost  = await PostService.edit(req.body, req.params.id, decoded.id);
            io.emit('postedit', updatedPost);
            res.status(200).json(updatedPost);
            
        }catch(err){
            res.status(500).json({
                message: err.message
            });
        }
    }

    static async getAllPost(req, res){
        try {
            const posts = await PostService.getAll();
            res.status(200).json(posts);
        } catch (err) {
            res.status(422).json({ message: err.message});
        }
    }

    static async upVote(req, res){
        try {
            await PostService.up(req.body);
            res.status(200).json({message: 'Ação realizada com sucesso!'});
        } catch (err) {
            res.status(422).json({ message: err.message})
        }
    }

    static async downVote(req, res){
        try {
            await PostService.down(req.body);
            res.status(200).json({message: 'Ação realizada com sucesso!'});
        } catch (err) {
            res.status(422).json({ message: err.message})
        }
    }
}