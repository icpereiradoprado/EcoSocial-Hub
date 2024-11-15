/**IMPORTS NECESSÁRIOS PARA O COMPONENTE */
import { Modal, View, StyleSheet, TouchableOpacity, TextInput, Dimensions } from "react-native";
import { useState, useEffect } from 'react';
import CommentList from "./CommentList";
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { getTokenAndUserId } from "../helpers/Auth";
import { colors } from "../css/base";
import { getSocket } from "../helpers/socket";

const { width } = Dimensions.get('window');

/**
 * Componente Modal de Comentários
 * @param {boolean} modalVisible Controla a visibilidade do modal.
 * @param {function} setModalVisible Função para controlar a visibilidade do modal.
 * @param {number} postId ID do post para o qual os comentários serão exibidos.
 * @returns JSX com o modal de comentários.
 */
const CommentsModal = ({ modalVisible, setModalVisible, postId }) => {
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;
    const [commentsData, setCommentsData] = useState(null);
    const [offset, setOffset] = useState(0);
    const [commentContent, setCommentContent] = useState(null);
    const [commentParentTest, setCommentParentTest] = useState(null);
    const [hasMoreData, setHasMoreData] = useState(true);

    /**
     * Função para buscar os comentários do post inicial
     * @param {number} offset O valor de offset para controlar a páginação.
     */
    const fetchCommentsData = async (offset) => {
        const { userId, token } = await getTokenAndUserId();
        const initialOffSet = offset > 0 ? 0 : offset;
        try {
            const response = await fetch(`${url}/comments/${postId}/${initialOffSet}/${0}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if(response.ok){
                const data = await response.json();
                if(!hasMoreData){
                    setHasMoreData(true);
                }
                setCommentsData(data);
                setOffset(0);
            }
        } catch (err) {
            console.error(`Não foi possível carregar os comentários: ${err.message}`);
        }
    }

    /**
     * Função para buscar mais comentários à medida que o usuário rola a lista
     */
    const fetchMoreComments = async () => {
		const { token } = await getTokenAndUserId();
		const updatedOffset = offset + 10;
		const response = await fetch(`${url}/comments/${postId}/${updatedOffset}/${0}`,{
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
		if(response.ok){
			const moreComments = await response.json();
			if(moreComments.length === 0){
				setHasMoreData(false);
				return;
			}
			setCommentsData((prevComments) => [...prevComments, ...moreComments]);
			setOffset(updatedOffset);
		}
	}

    /**
     * Função para salvar um novo comentário
     * @param {number} commentParent ID do comentário pai (se houver) para criar uma resposta.
     */
    const handleSaveNewComment = async (commentParent = null) => {
        const { userId, token } = await getTokenAndUserId();
        try {
            if(commentContent && commentContent.length > 0){
                const body = JSON.stringify({
                    post_id: postId,
                    user_id: userId,
                    content: commentContent.trim(),
                    comment_parent: commentParent
                });
                const response = await fetch(`${url}/comments/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body : body
                });
                if(response.ok){
                    setCommentContent(null);
                }else{
                    const data = await response.json();
                    console.log(data);
                }
            }
        } catch (err) {
            console.error(`Não foi possível enviar o comentário: ${err.message}`);
        }
    }
    
    useEffect(()=> {
        if(modalVisible){
            fetchCommentsData(offset); // Carregar comentários ao abrir o modal
        }
    }, [modalVisible])

    useEffect(()=>{
        // Estabelece a conexão com o servidor via socket
        const socketIo = getSocket();
 
        // Atualiza a lista de comentários quando um novo comentário for criado
        socketIo.on('commentcreate', (newComment)=>{
            setCommentsData((prevComment) => [newComment, ...prevComment]);
        });

        // Remove o comentário quando ele for deletado
        socketIo.on('commentdeleted', (commentId)=>{
            setCommentsData((prevComments) => {
                if (!prevComments) {
                    return prevComments;
                }
                const comments = prevComments.filter((comment) => comment.id != commentId);
                //setVisible(true);
                return comments;
            });
        });

        // Atualiza um comentário na lista quando ele for editado
        socketIo.on('commentedit', (updatedComment)=>{
            setCommentsData((prevComments) => {
                if(!prevComments) return prevComments;
                
                // Mapeia a lista, substituindo o item pelo novo conteúdo se o ID for correspondente
                const comments = prevComments.map((comment) =>
                    comment.id === updatedComment.id ? updatedComment : comment
                );
                return comments;
            });
        });
    }, []);
    /**
     * Retorna a modal de comentários
     */
    return (
        <Modal
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => {setModalVisible(false)}}
            > 
                
            <View style={styles.modalView}>
                <View style={{width: '100%'}}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => {setModalVisible(false)}}>
                        <MaterialIcons name='arrow-back' size={25}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.modalBodyForm}>
                    <CommentList 
                        commentsData={commentsData}
                        hasMoreData={hasMoreData}
                        loadMoreData={fetchMoreComments}
                    />
                </View>
            </View>
            <View style={styles.addCommentContainer}>
                <View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <MaterialCommunityIcons name="comment-processing" size={25}/>
                        <TextInput
                            value={commentContent}
                            onChangeText={setCommentContent}
                            placeholder='Adicione um comentário...'
                            style={styles.addCommentInput}
                            maxLength={255}
                        />
                    </View>
                </View>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="send" size={25} onPress={() => handleSaveNewComment(commentParentTest)}/>
                </TouchableOpacity>
            </View>
                
        </Modal> 
    )
}

export default CommentsModal;

/**
 * Estilização do cabeçalho da lista de comentários
 */
const styles = StyleSheet.create({
    modalView: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    sendButton:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    modalBodyForm: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    closeButton: {
        width: 30,
        height: 30
    },
    addCommentContainer:{
        position:'absolute',
        bottom: 0,
        borderWidth: 1,
        borderColor: colors.black_default,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        width: width,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    addCommentInput:{
        paddingVertical: 8,
        paddingHorizontal: 6,
        width: '85%'
    }
});