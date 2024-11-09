/**Classe model para os Posts */
export default class PostModel{
    //Método construtor da classe
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

    /**
     * Método que valida o título do Post
     * @param {string} title título do Post
     */
    static validateTitle(title){
        //Caso o título seja nulo ou undefined dispara um Erro
        if(!title){
            throw new Error("O campo 'Título' é obragatório!");
        }
        //Caso o título não seja nulo ou undefined e tenha o comprimeto menor que 3 caracteres dispara um Erro
        if(title && title.length < 3){
            throw new Error("O campo 'Título' deve ter no mínimo 3 caracteres!");
        }
    }

    /**
     * Método que valida o conteúdo do Post
     * @param {string} content conteúdo do Post
     */
    static validateContent(content){
        //Caso o conteúdo seja nulo ou undefined dispara um Erro
        if(!content){
            throw new Error("O campo 'Conteúdo' é obragatório!");
        }
        //Caso o conteúdo não seja nulo ou undefined e tenha o comprimeto menor que 10 caracteres dispara um Erro
        if(content && content.length < 10){
            throw new Error("O campo 'Conteúdo' deve ter no mínimo 10 caracteres!");
        }
    }

    /**
     * Método que valida o o valor de inatividade do Post
     * @param {number} inactive indica se o Post está inativo ou não
     */
    static validateInactive(inactive){
        //Caso o valor de inactive não seja do tipo numérico, dispara um Erro
        if(typeof inactive != 'number'){
            throw new Error("O campo 'Inativo' deve conter um valor numérico!");
        }
    }
}