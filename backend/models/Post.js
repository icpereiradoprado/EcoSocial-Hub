import pool from "../db/conn.js";

const TABLE_NAME = 'post';

class Post{
    constructor(id, content, userId, tags, inactive, comments, upvotes, downvotes, score, lastActivityAt, createDate, updateDate){
        this.id = id;
        this.content = content;
        this.userId = userId;
        this.tags = tags;
        this.inactive = inactive;
        this.comments = comments;
        this.upvotes = upvotes || 0;
        this.downvotes = downvotes || 0;
        this.score = score;
        this.lastActivityAt = lastActivityAt;
        this.createDate = createDate;
        this.updateDate = updateDate;
    }


    static async findById(id){
        try{
            const query = `SELECT * FROM ${TABLE_NAME} WHERE id = $1`;
            const value = [id];

            const res = await pool.query(query, value);
            if(res.rows.length > 0){
                const post = res.rows[0];
                return new Post(
                    post.id, 
                    post.content, 
                    post.userId, 
                    post.tags, 
                    post.inactive, 
                    post.comments, 
                    post.upvotes, 
                    post.downvotes, 
                    post.score, 
                    post.lastActivityAt, 
                    post.createDate, 
                    post.updateDate
                );
            }

            return null; //Post não encontrado
        }catch(err){
            throw new Error(`Erro ao procurar post: ${err.message}`);
        }
    }

    static async getPost(req, res) {
        const { id } = req.params;
    
        try{
            const post = await Post.findById(id);
            if(post){
                res.json(post);
            }else{
                res.status(404).json({error: 'Post não encontrado!'});
            }
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * Altera o título de um post
     */
    static async changeTitle(req, res){
        const { id, title: newTitle } = req.body;
        
        try{
            const post = Post.findById(id); //Busca o post desejado para alteração 

            if(post){
                const query = `UPDATE ${TABLE_NAME} SET title = $1 WHERE id = $2 RETURNING title`;
                //TODO: Validar se newTitle tem valor
                const values = [newTitle, id];
                const result = await pool.query(query, values);

                if(result.rows.length > 0){
                    const updatedTitle  = result.rows[0].title;
                    res.status(201).json({ message: 'Título do post alterado com sucesso!', title : updatedTitle });
                }
            }else{
                res.status(404).json({ message : 'Post não encontrado!'})
            }

        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }
}

export default Post;