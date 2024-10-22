
export default class PostModel{
    
    constructor(title, content, userId, inactive, upvotes, downvotes, commentCount, createDate, lastActivity, updateDate, postPicture){
        this.title = title;
        this.content = content;
        this.userId = userId;
        this.inactive = inactive;
        this.upvotes = upvotes;
        this.downvotes = downvotes;
        this.commentCount = commentCount;
        this.createDate = createDate;
        this.lastActivity = lastActivity;
        this.updateDate = updateDate;
        this.postPicture = postPicture;
    }

    static validateTitle(title){
        if(!title){
            throw new Error("O campo 'Título' é obragatório!");
        }

        if(title && title.length < 3){
            throw new Error("O campo 'Título' deve ter no mínimo 3 caracteres!");
        }
    }

    static validateContent(content){
        if(!content){
            throw new Error("O campo 'Conteúdo' é obragatório!");
        }

        if(content && content.length < 10){
            throw new Error("O campo 'Conteúdo' deve ter no mínimo 10 caracteres!");
        }
    }

    validateInactive(inactive){
        if(typeof inactive != 'number'){
            throw new Error("O campo 'Inativo' deve conter um valor numérico!");
        }
    }
}