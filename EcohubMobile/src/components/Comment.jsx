import { StyleSheet, View, Dimensions, Text, TouchableOpacity, Image, Alert, Modal, TextInput } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import Constants from 'expo-constants';
import { getTokenAndUserId } from "../helpers/Auth";
import { format } from 'date-fns'
import { colors } from "../css/base";

const { width } = Dimensions.get('window');

const Comment = ({
    id, 
    content,  
    userId, 
    createDate, 
    username
}) => {
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;
    const [isAdmin] = useState(false);
    const [loggedUserId] = useState(null);
    const [selectComment, setSelectComment] = useState(null);
    const [contentEdit, setContentEdit] = useState(null);
    const [showInput, setShowInput] = useState(false);

    /**
     * Método para exebir o modal de edição do comentário
     * Caso o cometário já selecionado seja selecionado novamente, fecha o modal, caso contrário,
     * Exibe o modal
     * @param {number} id id do cometário
     */
    const showEditTooltip = (id) => {
        if(selectComment === id){
            setSelectComment(null);
        }else{
            setSelectComment(id);
        }
    }
    const handleDeleteComment = async () => {
        const { token } = await getTokenAndUserId();
        try {
            const response = await fetch(`${url}/comments/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if(response.ok){
                setSelectComment(null);
            }
        } catch (err) {
            console.error(`Erro ao deletar comentário: ${err.message}`);
        }
    }
    const handleDeleteCommentMessage = () => {
        Alert.alert('Deletar post', `Você realmente deseja excluir o comentário?`,[
            { text: 'Não', style: 'cancel'},
            { text: 'Sim', style: 'default', onPress: () => handleDeleteComment(id) }
        ])
    }

    const handleToEditComment = async () => {
        try {
            const { token } = await getTokenAndUserId();
            const body = JSON.stringify({
                content: contentEdit,
                update_date: null
            });
            const response = await fetch(`${url}/comments/edit/${id}`,{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body
            });

            if(response.ok){
                setShowInput(false);
                setSelectComment(null);
            }
        } catch (err) {
            console.error(`Erro ao editar comentário ${err.message}`)
        }
    }
    const handleToShowInputComment = () => {
        setShowInput(true);
        setContentEdit(content);
    }
    return (
        <View style={styles.containter}>
            <View style={{flexDirection: 'row', gap: 8, flex: 1}}>
                <Image source={{uri: 'https://github.com/icpereiradoprado.png'}} style={styles.userImage}/>
                <View style={{flex: 1}}>
                    <View>
                        <Text style={styles.username}>{username}</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={styles.content}>{content}</Text>
                    </View>
                    <View>
                        <TouchableOpacity>
                            <Text style={styles.replyButton}>{format(new Date(createDate), 'dd/MM/yyyy HH:mm:ss')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            
            {((isAdmin == 1) || (userId == loggedUserId)) && (
                <TouchableOpacity onPress={() => showEditTooltip(id) }>
                    <MaterialIcons name='more-vert' size={25}/>
                </TouchableOpacity>
            )}
            {selectComment == id && (
            <Modal
                animationType="slide"
                visible={true}
                onRequestClose={() => {setSelectComment(null)}}
            > 
                
                <View style={styles.modalView}>
                    <View style={{width: '100%'}}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => {setSelectComment(null)}}>
                            <MaterialIcons name='arrow-back' size={25}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, gap: 10, width: '100%'}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Comentário selecionado</Text>
                        <View style={{flexDirection: 'row', gap: 8, flex: 1}}>
                            <Image source={{uri: 'https://github.com/icpereiradoprado.png'}} style={styles.userImage}/>
                            <View style={{flex: 1}}>
                                <View>
                                    <Text style={styles.username}>{username}</Text>
                                </View>
                                <View style={{flex: 1, gap: 4}}>
                                    <Text style={styles.content}>{contentEdit ? contentEdit : content}</Text>
                                    <Text style={styles.replyButton}>{format(new Date(createDate), 'dd/MM/yyyy HH:mm:ss')}</Text>
                                </View>
                            </View>
                        </View>
                        {showInput && (
                            <View style={styles.addCommentContainer}>
                                <View>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <TouchableOpacity onPress={()=> setShowInput(false)} style={{position: 'absolute', top: -10, left: -16, backgroundColor: 'black', borderRadius: 100}}>
                                            <MaterialCommunityIcons style={{}} name="close" size={18} color='white'/>
                                        </TouchableOpacity>
                                        <TextInput
                                            value={contentEdit}
                                            onChangeText={setContentEdit}
                                            placeholder='Adicione um comentário...'
                                            style={styles.addCommentInput}
                                            maxLength={255}
                                        />
                                    </View>
                                </View>
                                <TouchableOpacity onPress={handleToEditComment}>
                                    <MaterialCommunityIcons name="send" size={25}/>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    
                    <View style={styles.modalBodyForm}>
                        <TouchableOpacity disabled={showInput} style={!showInput ? styles.buttonTooltipEdit : [styles.buttonTooltipEdit, {backgroundColor: '#9ca3af', borderColor: '#9ca3af'}]} onPress={
                            handleToShowInputComment
                        }>
                            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 16}}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonTooltipDelete} onPress={handleDeleteCommentMessage}>
                            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 16}}>Deletar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
            </Modal>
            )}
        </View>
    )
}

/**
 * Estilização do compenente Comment
 */
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
    buttonTooltipDelete:{
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 12,
        paddingHorizontal: 6,
        paddingVertical: 12,
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#ef4444'
    },
    buttonTooltipEdit:{
        borderWidth: 1,
        borderColor: colors.green_dark,
        borderRadius: 12,
        paddingHorizontal: 6,
        paddingVertical: 12,
        width: '100%',
        alignItems: 'center',
        backgroundColor: colors.green_dark
    },
    modalView: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignItems: 'center',
        flex: 1
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    modalBodyForm: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        flex: 1,
        gap: 12
    },
    closeButton: {
        width: 30,
        height: 30
    },
    addCommentContainer:{
        borderWidth: 1,
        borderColor: colors.black_default,
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
})

//Exporta o componente com o nome default
//Utilizado o React.memo para melhor performance, o `memo`, memoriza os componetes
//E caso as propriedades contida neles não tenha o seu estado alterado, ele não faz a renderização novamente,
//Caso contrário renderiza o componente novamente
export default React.memo(Comment);