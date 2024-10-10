import RecyclingCenterService from "../services/RecyclingCenterService";

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

    static async deleteRecyclingCenter(req, res){}

    static async getAllRecyclingCenter(req, res){}

    static async editRecyclingCenter(req, res){}
}