import jwt from 'jsonwebtoken'
import bcrypt, { getRounds } from 'bcrypt'
import pool from './../db/conn.js';
import User from '../models/Users.js';


async function register(req, res){
    try {    
        const { name, email, phone_number: phoneNumber, password, confirm_password } = req.body;

        //Validations
        if(!name){
            res.status(422).json({ message: 'O nome é obrigatório!'});
            return
        }

        if(!email){
            res.status(422).json({ message: 'O email é obrigatório!'});
            return
        }

        if(!phoneNumber){
            res.status(422).json({ message: 'O número de telefone é obrigatório!'});
            return
        }

        if(!password){
            res.status(422).json({ message: 'A senha é obrigatória!'});
            return
        }

        if(!confirm_password){
            res.status(422).json({ message: 'A confirmação da senha é obrigatória!'});
            return
        }

        if(password !== confirm_password){
            res.status(422).json({ message: 'As senhas não coincidem!'});
            return
        }

        //check if user exists
        const userExist = await pool.query('SELECT * FROM user_accounts WHERE email = $1 OR name = $2', [email, name]);
        if(userExist.rows.length > 0){
            res.status(422).json({ message: 'Usuário ou E-mail já cadastrado!!'});
            return
        }

        //create a password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await User.create(name, email, phoneNumber, passwordHash);

        res.status(201).json({ message: 'Usuário registrado com sucesso', user: newUser });

    }catch(err){
        console.error(err);
        res.status(500).json({message : 'Erro interno! Falha ao criar o usuário.'})
    }
}

async function getUser(req, res) {
    const { id } = req.params;

    try{
        const user = await User.findById(id);
        if(user){
            res.json(user);
        }else{
            res.status(404).json({error: 'Usuário não encontrado!'});
        }
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

export const AuthService = {
    register,
    getUser
}