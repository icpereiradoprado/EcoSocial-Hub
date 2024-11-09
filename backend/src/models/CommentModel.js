/**Classe model para os Cometários */
export default class CommentModel{
    
    /**Método construtor da classe */
    constructor(userId, content, createDate, updateDate){
        this.content = content;
        this.userId = userId;
        this.createDate = createDate;
        this.updateDate = updateDate;
    }

    /**
     * Método que valida o conteúdo
     * @param {string} content conteúdo do comentário
     */
    static validateContent(content){
        //Caso o conteúdo passado por parâmetro seja nulo ou undefined dispara um Erro
        if(!content){
            throw new Error("O campo 'Conteúdo' é obragatório!");
        }
        //Caso o conteúdo passado por parâmetro não seja nulo ou udefined e seu comprimento for menor que 1 dispara um Erro
        if(content && content.length < 1){
            throw new Error("O campo 'Conteúdo' deve ter no mínimo 1 caracteres!");
        }
    }
}