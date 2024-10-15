import AuthService from "../services/AuthService.js";
import RecyclingCenterService from "../services/RecyclingCenterService.js";
import jwt from 'jsonwebtoken';
import { io } from '../../http.js';

export default class RecyclingCenterController{
    static async registerRecyclingCenter(req, res){
        try {
            const { authorization } = req.headers;
            const token = AuthService.getToken(authorization);

            if(!token){
                throw new Error('Acesso Negado!');
            }

            const decoded = jwt.verify(token, process.env.SECRET);

            if(Number(decoded.isAdmin) && Number(decoded.isAdmin) === 1){
                const recyclingCenter = await RecyclingCenterService.register(req.body);
                io.emit('recyclingcentercreate', recyclingCenter);
                res.status(201).json({
                    message : 'Cadastro realizado com sucesso!',
                    id: recyclingCenter.id,
                    title: recyclingCenter.title
                });
            }else{
                throw Error('Acesso Negado! Você precisa ser um administrador para executar esta ação!');
            }
        }catch(err){
            res.status(400).json({ message : err.message})
        }
    }

    static async deleteRecyclingCenter(req, res){
        try {
            const { authorization } = req.headers;
            const token = AuthService.getToken(authorization);
            if(!token){
                throw new Error('Acesso Negado!');
            }

            const decoded = jwt.verify(token, process.env.SECRET);

            if(Number(decoded.isAdmin) && Number(decoded.isAdmin) === 1){
                await RecyclingCenterService.delete(req.params);
                io.emit('recyclingcenterdeleted', req.params.id);
                res.status(201).json({
                    message : 'Ponto de coleta e descarte deletado com sucesso!',
                    id: req.params.id
                });
            }else{
                throw Error('Acesso Negado! Você precisa ser um administrador para executar esta ação!');
            }
        } catch (err) {
            res.status(400).json({ message : err.message});
        }
    }

    static async getAllRecyclingCenter(req, res){
        try {
            const recyclingCenters = await RecyclingCenterService.getAll(req.params);
            res.status(200).json(recyclingCenters);
        } catch (err) {
            res.status(422).json({ message: err.message});
        }
    }

    static async editRecyclingCenter(req, res){
        const { authorization } = req.headers;
        try{
            const token = AuthService.getToken(authorization);
            if(!token){
                throw new Error('Acesso Negado!');
            }

            const decoded = jwt.verify(token, process.env.SECRET);

            if(Number(decoded.isAdmin) && Number(decoded.isAdmin) === 1){
                const updatedRecyclingCenter  = await RecyclingCenterService.edit(req.body, req.params.id);
                io.emit('recyclingcenteredit', updatedRecyclingCenter);
                res.status(200).json(updatedRecyclingCenter);
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