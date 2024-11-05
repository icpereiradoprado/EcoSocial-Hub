import { StyleSheet, View, Dimensions, Text, TouchableOpacity, Image, Alert } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import Constants from 'expo-constants';
import { getTokenAndUserId } from "../helpers/Auth";

const { width } = Dimensions.get('window');

const Comment = ({
    id, 
    content, 
    postId, 
    userId, 
    createDate, 
    commentParent, 
    username, 
    setCommentToEdit
}) => {
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;
    const [isAdmin, setIsAdmin] = useState(false);
    const [loggedUserId, setLoggedUser] = useState(null);
    const [selectComment, setSelectComment] = useState(null);

    const showEditTooltip = (id) => {
        if(selectComment === id){
            setSelectComment(null);
        }else{
            setSelectComment(id);
        }
        
    }
    const handleDeleteComment = async (id) => {
        const { token } = await getTokenAndUserId();
        try {
            await fetch(`${url}/comments/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (err) {
            console.error(`Erro ao deletar comentário: ${err.message}`);
        }
    }
    const handleDeleteCommentMessage = (id) => {
        Alert.alert('Deletar post', `Você realmente deseja o comentário?`,[
            { text: 'Não', style: 'cancel'},
            { text: 'Sim', style: 'default', onPress: () => handleDeleteComment(id) }
        ])
    }

    const handleToSetCommentEdit = () => {
        const post = {
            id,
            content
        }
        setCommentToEdit(post);
    }
    return (
        <View style={styles.containter}>
            <View style={{flexDirection: 'row', gap: 8}}>
                <Image source={{uri: 'https://github.com/icpereiradoprado.png'}} style={styles.userImage}/>
                <View>
                    <View>
                        <Text style={styles.username}>{username}</Text>
                    </View>
                    <View>
                        <Text style={styles.content}>{content}</Text>
                    </View>
                    <View>
                        <TouchableOpacity>
                            <Text style={styles.replyButton}>Responder</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity>
                            <Text style={styles.viewRepliesButton}>Ver respostas</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            
            {((isAdmin == 1) || (userId == loggedUserId)) && (
                <TouchableOpacity onPress={() => showEditTooltip(id) }>
                    <MaterialIcons name='more-vert' size={25}/>
                </TouchableOpacity>
            )}
            {selectComment === id && (
                <View style={styles.editTooltip}>
                    {(userId == loggedUserId) && (
                        <TouchableOpacity onPress={() => {setModalVisible(true); setMode(Mode.update); handleToSetCommentEdit();setSelectComment(null)}}>
                            <Text style={styles.buttonTooltip}>Editar</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => {handleDeleteCommentMessage(id); setSelectComment(null)}}>
                        <Text style={[styles.buttonTooltip, {color: 'red'}]}>Deletar</Text>
                    </TouchableOpacity>
                </View>
            )}
            
        </View>
    )
}

const styles = StyleSheet.create({
    containter: {
        flex: 1,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    username:{
        fontWeight: '600',
        fontSize: 16
    },
    content:{
        paddingVertical: 2
    },
    replyButton:{
        color: '#6b7280',
        fontSize: 12
    },
    userImage:{
        width: 30, 
        height: 30, 
        borderRadius: 100, 
        marginTop: 6
    },
    viewRepliesButton:{
        color: '#4b5563',
        fontSize: 12,
        marginTop: 6,
        marginStart: 40
    },
    editTooltip:{
        width: 150,
        position: 'absolute',
        borderRadius: 12,
        backgroundColor: 'white',
        right: 5,
        top: 32,
        padding: 12,
        zIndex: 1,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonTooltip:{
        padding: 4,
        fontWeight: '700'
    },
})

export default Comment;