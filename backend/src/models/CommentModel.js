
export default class CommentModel{
    
    constructor(userId, content, createDate, updateDate){
        this.content = content;
        this.userId = userId;
        this.createDate = createDate;
        this.updateDate = updateDate;
    }

    static validateContent(content){
        if(!content){
            throw new Error("O campo 'Conteúdo' é obragatório!");
        }

        if(content && content.length < 1){
            throw new Error("O campo 'Conteúdo' deve ter no mínimo 1 caracteres!");
        }
    }
}