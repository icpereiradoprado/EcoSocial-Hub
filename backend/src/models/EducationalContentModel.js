/**Classe model para os Conteúdos Educacionais */
export default class EducationalContentModel{
    //Método construtor da classe
    constructor(title, content, picture, tag, createDate, updateDate, userId){
        this.title = title;
        this.content = content;
        this.picture = picture;
        this.tag = tag;
        this.createDate = createDate;
        this.updateDate = updateDate;
        this.userId = userId;
    }

    /**
     * Método que valida o título do Conteúdo Educacional
     * @param {string} title título do conteúdo educacional
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
     * Método que valida o conteúdo do Conteúdo Educacional
     * @param {string} content conteúdo do conteúdo educacional
     */
    static validateContent(content){
        //Caso o content seja nulo ou undefined dispara um Erro
        if(!content){
            throw new Error("O campo 'Conteúdo' é obragatório!");
        }
        //Caso o conteúdo não seja nulo ou undefined e tenha o comprimeto menor que 10 caracteres dispara um Erro
        if(content && content.length < 10){
            throw new Error("O campo 'Conteúdo' deve ter no mínimo 10 caracteres!");
        }
    }
    /**
     * Método que valida o conteúdo do Conteúdo Educacional
     * @param {string} tag tag do conteúdo educacional
     */
    static validateTag(tag){
        //Caso a tag seja nula ou undefined dispara um Erro
        if(!tag){
            throw new Error("O campo 'Tag' é obragatório!");
        }
        //Caso a tag não seja nula ou undefined e tenha o comprimeto menor que 3 caracteres dispara um Erro
        if(tag && tag.length < 3){
            throw new Error(`O campo 'Tag' deve ter no mínimo 3 caracteres! | Tag: '${tag}'`);
        }
    }

}