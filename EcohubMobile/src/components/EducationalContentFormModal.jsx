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
    const [textTag, setTextTag] = useState(null);
    const [tags, setTags] = useState(null);

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

    const handleDeleteImage = () => {
        setImage(null);
    }

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
                tag : tags
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
                tag : tags
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
        setTags((prevTags) => {
            if(!prevTags) return [newTag];

            return [newTag, ...prevTags];
        });
    }

    const handleRemoveTag = (indexToRemove) => {
        setTags((prevTags) => prevTags.filter((tag, index) => index !== indexToRemove));
    };

    const handleResetInputs = () => {
        setTitle('');
        setContent('');
        setImage(null);
        setTags(null);
    }


    useEffect(()=>{
        if(mode == Mode.update && educationalContentToEdit){
            setTitle(educationalContentToEdit.title);
            setContent(educationalContentToEdit.content);
            setImage(educationalContentToEdit.contentPicture);
            const tags = educationalContentToEdit.tag ? educationalContentToEdit.tag.split(';') : null;
            setTags(tags);
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
                            <View style={{marginBottom: 12}}>
                                <Input
                                    name="textTag"
                                    placeholder="Tags"
                                    autoCapitalize="none"
                                    value={textTag}
                                    onChangeText={setTextTag}
                                    onSubmitEditing={() => {
                                        if (textTag) {
                                            handleTagChange(textTag); // Passa o valor atual da tag
                                            setTextTag(''); // Limpa o campo de entrada
                                        }
                                    }}
                                />
                                <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 4}}>
                                    {Array.isArray(tags) && 
                                        tags.map((tag, index) => 
                                            <View key={index} style={styles.tag}>
                                                <Text style={{fontSize: 16, color: '#f8fafc', fontWeight: '600'}}>{tag}</Text>
                                                <TouchableOpacity style={styles.deleteTag} onPress={() => handleRemoveTag(index)}>
                                                    <MaterialIcons name="clear" size={15} color='#FFFFFF'/>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                </View>
                            </View>
                            {image &&
                                <View>
                                    <TouchableOpacity style={styles.deleteImage} onPress={handleDeleteImage}>
                                        <MaterialIcons name='delete' size={25} color='#FFFFFF' />
                                    </TouchableOpacity>
                                    <Image source={{uri: `data:image/jpeg;base64,${image}`}} style={{width: '100%', height: 250}}/>
                                </View>
                            }
                            <TouchableOpacity onPress={handlePickImage} style={{width: 40}}>
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
    tag: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 8,
        backgroundColor: '#64748b',
        borderRadius: 8,
        paddingStart: 8,
        paddingEnd: 4,
        paddingVertical: 4,
        marginEnd: 4
    },
    deleteTag : {
        backgroundColor: '#0f172a', 
        borderRadius: 100, 
        padding: 2
    }
});

export default EducationalContentFormModal;