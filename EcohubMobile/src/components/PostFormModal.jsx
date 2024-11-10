/**IMPORTS NECESSÁRIOS PARA O COMPONENTE */
import { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Dimensions, TouchableOpacity, Image, Alert } from 'react-native';
import { Button } from './Button';
import { base } from "../css/base";
import { MaterialIcons } from '@expo/vector-icons';
import { Mode } from '../helpers/Enums';
import { Input } from './Input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextArea } from './TextArea';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { getTokenAndUserId } from '../helpers/Auth';

const { height } = Dimensions.get('window');

/**
 * Componente que exibe um formulário para criar ou editar um post.
 * @param {boolean} modalVisible - Controla a visibilidade da modal.
 * @param {function} setModalVisible - Função para atualizar o estado da visibilidade da modal.
 * @param {string} mode - Modo do formulário (criação ou edição).
 * @param {object} postToEdit - Dados do post a ser editado (se estiver no modo de edição).
 * @returns Componente de modal para criação ou edição de posts.
 */
const PostFormModal = ({ modalVisible, setModalVisible, mode, postToEdit }) => {
    // Estados do componente
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    /**
     * Método handler para tirar foto
     */
    const handlePickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4,5],
            quality: 1,
            base64: true,
        });
  
        if (!result.canceled) {
            setImage(`${result.assets[0].base64}`);
        }
    };

    /**
     * Método handler para deletar imagem do post
     */
    const handleDeleteImage = () => {
        setImage(null);
    }

    /**
     * Método handler para salvar os dados do post
     */
    const handleSaveData = async () => {
        const { token, userId } = await getTokenAndUserId(); //Traz o token e o Id do usuário logado
        if(mode == Mode.create){
            const body = JSON.stringify({
                user_id: userId,
                title,
                content,
                post_picture : image
            });
            const response = await fetch(`${url}/posts/register`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body
            });
            const data = await response.json();
    
            if(!response.ok){    
                Alert.alert('Erro ao criar post', data.message);
            }else{
                handleResetInputs();
                setModalVisible(false);
            }
        }else if(mode == Mode.update){
            const body = JSON.stringify({
                title,
                content,
                post_picture : image
            });
            const response = await fetch(`${url}/posts/edit/${postToEdit.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body
            });
            const data = await response.json();
    
            if(!response.ok){    
                Alert.alert('Erro ao editar o post', data.message);
            }else{
                handleResetInputs();
                setModalVisible(false);
            }
        }
    }

    /**
     * Método handler para resetar inputs
     */
    const handleResetInputs = () => {
        setTitle('');
        setContent('');
        setImage(null);
    }

    // Função para carregar dados do post
    useEffect(()=>{
        if(mode == Mode.update && postToEdit){
            setTitle(postToEdit.title);
            setContent(postToEdit.content);
            setImage(postToEdit.postPicture);
        }
    }, [postToEdit]);

    /**
     * Retorna a modal de posts
     */
    return(
        <Modal
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        > 
            <KeyboardAwareScrollView>
                <View style={styles.modalView}>
                    <View style={{width: '100%'}}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <MaterialIcons name='close' size={25}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalBodyForm}>
                        <Text style={base.title} >{mode === Mode.create ? 'Novo conteúdo' : 'Editar conteúdo'}</Text>
                        <View style={{width: '100%', height: '100%'}}>
                            <Input
                                name="title"
                                placeholder="Título"
                                autoCapitalize="none"
                                value={title}
                                onChangeText={setTitle}
                            />
                            <TextArea
                                name="content"
                                placeholder="Conteúdo"
                                autoCapitalize="none"
                                multiline={true}
                                numberOfLines={5}
                                maxLength={900}
                                value={content}
                                onChangeText={setContent}
                            />
                            {image &&
                                <View>
                                    <TouchableOpacity style={styles.deleteImage} onPress={handleDeleteImage}>
                                        <MaterialIcons name='delete' size={25} color='#FFFFFF' />
                                    </TouchableOpacity>
                                    <Image source={{uri: `data:image/jpeg;base64,${image}`}} style={{width: '100%', height: 250}}/>
                                </View>
                            }
                            <TouchableOpacity onPress={handlePickImage}>
                                <MaterialIcons name='add-photo-alternate' size={40}/>
                            </TouchableOpacity>
                            <View style={styles.sendButton} >
                                <Button  buttonText={mode == Mode.create ? 'Publicar' : 'Atualizar publicação'}  onPress={handleSaveData}/>
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </Modal> 
    )
}

/**
 * Estilização do cabeçalho da lista de comentários
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
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
    deleteImage : {
        backgroundColor: '#3f3f46', 
        width: 30,
        height: 30, 
        borderRadius: 100, 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 4,
        position: 'absolute',
        top: 10,
        right: 10

    },
});

//Exporta o componente com o nome default
export default PostFormModal;