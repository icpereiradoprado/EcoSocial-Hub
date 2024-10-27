import { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Dimensions, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Button } from '../components/Button';
import { base, colors } from "../css/base";
import { MaterialIcons } from '@expo/vector-icons';
import { Mode } from '../helpers/Enums';
import { Input } from './Input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextArea } from './TextArea';
import * as ImagePicker from 'expo-image-picker';
import { getTokenAndUserId } from '../helpers/Auth';
import Constants from 'expo-constants';

const { height } = Dimensions.get('window');

const EducationalContentFormModal = ({ modalVisible, setModalVisible, mode, educationalContentToEdit }) => {
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tag, setTag] = useState(null);

    const handlePickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
            base64: true,
        });
  
        if (!result.canceled) {
            setImage(`${result.assets[0].base64}`);
        }
    };

    /**
     * Método handler para salvar os dados do conteúdo educacional
     */
    const handleSaveData = async () => {
        const { token, userId } = await getTokenAndUserId(); //Traz o token e o Id do usuário logado
        if(mode == Mode.create){
            const body = JSON.stringify({
                userId,
                title,
                content,
                content_picture : image,
                tag
            });
            const response = await fetch(`${url}/educationalcontents/register`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body
            });
            const data = await response.json();
    
            if(!response.ok){    
                Alert.alert('Erro ao criar conteúdo', data.message);
            }else{
                handleResetInputs();
                setModalVisible(false);
            }
        }else if(mode == Mode.update){
            const body = JSON.stringify({
                title,
                content,
                content_picture : image,
                tag
            });
            const response = await fetch(`${url}/educationalcontents/edit/${educationalContentToEdit.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body
            });
            const data = await response.json();
    
            if(!response.ok){    
                Alert.alert('Erro ao editar o conteúdo', data.message);
            }else{
                handleResetInputs();
                setModalVisible(false);
            }
        }
    }

    const handleTagChange = (newTag) => {
        const newTags = [newTag];
        setTag(newTags);
    }

    const handleResetInputs = () => {
        setTitle('');
        setContent('');
        setImage(null);
        setTag([]);
    }


    useEffect(()=>{
        if(mode == Mode.update && educationalContentToEdit){
            setTitle(educationalContentToEdit.title);
            setContent(educationalContentToEdit.content);
            setImage(educationalContentToEdit.contentPicture);
            setTag(educationalContentToEdit.tag)
        }
    }, [educationalContentToEdit]);
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
                            <Input
                                name="tag"
                                placeholder="Tags"
                                autoCapitalize="none"
                                value={tag}
                                onChangeText={handleTagChange}
                            />
                            {image &&
                                <Image source={{uri: `data:image/jpeg;base64,${image}`}} style={{width: '100%', height: 250}}/>
                            }
                            <TouchableOpacity onPress={handlePickImage}>
                                <MaterialIcons name='add-photo-alternate' size={40}/>
                            </TouchableOpacity>
                            <View style={styles.sendButton} >
                                <Button  buttonText={mode == Mode.create ? 'Criar Conteúdo' : 'Atualizar Conteúdo'}  onPress={handleSaveData}/>
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </Modal> 
    )
}

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
        //marginTop: 48,
        width: '100%',
        //height: '100%',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    closeButton: {
        width: 30,
        height: 30
        //position: 'absolute',
        //left: 10,
        //top: 15
    },
});

export default EducationalContentFormModal;