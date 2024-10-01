export default class EducationalContentModel{
    constructor(title, content, picture, tag, createDate, updateDate, userId){
        this.title = title;
        this.content = content;
        this.picture = picture;
        this.tag = tag;
        this.createDate = createDate;
        this.updateDate = updateDate;
        this.userId = userId;
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

    static validateTag(tag){
        if(!tag){
            throw new Error("O campo 'Tag' é obragatório!");
        }

        if(tag && tag.length < 3){
            throw new Error(`O campo 'Tag' deve ter no mínimo 3 caracteres! | Tag: '${tag}'`);
        }
    }

}