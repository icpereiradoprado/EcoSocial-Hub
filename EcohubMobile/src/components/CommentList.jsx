/**IMPORTS NECESSÁRIOS PARA O COMPONENTE */
import { FlatList, StyleSheet, Text, View, Dimensions, ActivityIndicator } from "react-native";
import { useState } from 'react';
import Comment from "./Comment";

const { width } = Dimensions.get('window');

/**
 * Componente Lista de Comentários
 * @param {Array} commentsData Dados dos comentários a serem exibidos
 * @param {boolean} hasMoreData Indica se há mais dados para carregar
 * @param {function} loadMoreData Função responsável por carregar mais dados
 * @param {function} setCommentToEdit Função para selecionar um comentário para edição
 * @returns Componente Listagem de Comentários
 */
const CommentList = ({ commentsData, hasMoreData, loadMoreData, setCommentToEdit }) => {
    //Estados do componente
    const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);

    //Componente handler para carregar dados
    const handleLoadMoreData = async () => {
        if(hasMoreData){
            setIsLoadingMoreData(true);
            await loadMoreData();
            setIsLoadingMoreData(false);
        }
    }
    //Componente Header para a lista de comentários
    const CommentsHeader = () => (
        <View style={stylesHeader.headerComponent}>
            <Text style={stylesHeader.headerText}>Comentários</Text>
        </View>
    );
    /**
     * Componente Footer da lista de comentários
     * Exibe o indicador de carregamento se mais dados estão sendo carregados
     */
    const CommentsFooter = () => (
        <View>
            {isLoadingMoreData && (
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: 16}}>Carregando mais cometários...</Text>
                    <ActivityIndicator size="small" color="#000000"/>
                </View>
            )}
        </View>
    )
    /**
     * Retorna a Lista do comentários, caso `comments` seja vazio exibe mensagem de conteúdo vazio.
     * Caso haja items retorna lista o componente `Comment.jsx` 
     */
    return (
        <FlatList
            data={commentsData}
            ListEmptyComponent={() => <View><Text>Não há nenhum comentário ainda...</Text></View>}
            renderItem ={({item}) => <Comment
                id={item.id}
                content={item.content}
                postId={item.post_id}
                userId={item.userId}
                createDate={item.create_date}
                commentParent={item.comment_parent}
                username={item.username}
                setCommentToEdit={setCommentToEdit}
            />}
            keyExtractor={item => item.id}
            onEndReached={handleLoadMoreData}
            onEndReachedThreshold={0.02}
            ListHeaderComponent={()=> <CommentsHeader />}
            ListHeaderComponentStyle={stylesHeader}
            ListFooterComponent={()=> <CommentsFooter />}
            ListFooterComponentStyle={{paddingBottom: hasMoreData ? 140 : 130}}
            style={{width: width, paddingHorizontal: 15}}
        />
    )
}

/**
 * Estilização do cabeçalho da lista de comentários
 */
const stylesHeader = StyleSheet.create({
    headerComponent:{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingBottom: 20
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold'
    }
})

export default CommentList;