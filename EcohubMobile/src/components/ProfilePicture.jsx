import { useState } from 'react';
import { View, TouchableOpacity, Alert, Image, StyleSheet, Text, Pressable, Dimensions } from 'react-native';
import { MaterialIcons }  from '@expo/vector-icons';
import { colors } from '../css/base';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

const { height,  width } = Dimensions.get('window');

/**
 * Componente Imagem do Perfil do usuário
 * @param {string} token token de autenticação
 * @param {number} userId id do usuário
 * @returns Componente Imagem do Perfil do usuário
 */
export function ProfilePicture({token, userId, imageUri}){
    //console.log('ProfilePictureComponent:', (imageUri ? imageUri : null))
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;

    const [modalVisible, setModalVisible] = useState(false);
    const [image, setImage] = useState(null);

    const handleEditProfilePicutre = () => {
        Alert.alert('Editar foto', 'Escolha sua foto')
    }

    const handleShowModal = () => {
        setModalVisible(!modalVisible);
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            base64: true
        });
    
        if (!result.canceled) {
            setImage(result.assets[0].base64);
            
            //console.log(result.assets[0].uri)
            //TODO: Extrair o typ/extensão do arquivo para colocar na string abaixo, tornando a extensão dinâmica
            saveImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    };

    const saveImage = async (base64String) => {
        try {
            const reqBody = { "profile_picture_text" : base64String }

            if(token && userId){
                const response = await fetch(`${url}/users/edit/${userId}`, {
                    method: 'PATCH',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(reqBody)
                });
            
                const data = await response.json();
                if(!response.ok){
                    Alert.alert('Erro ao salvar a imagem!', data.message);
                }else{
                    Alert.alert('Sucesso!', 'Imagem alterada!');
                }
            }else{
                console.error('Token ou Id do usuário não pode ser nulo!');
            }

        } catch (err) {
            console.error('Erro ao enviar a imagem:', err);
        }
    };

    
    return (
        <>
        <TouchableOpacity activeOpacity={0.9} onPress={handleShowModal}>
            <Image 
                source={ imageUri ? {uri : imageUri} : require('../assets/images/perfil-teste.png')}
                style={styles.picture}
                key={imageUri}
            />
            <TouchableOpacity activeOpacity={0.7} style={styles.editButton} onPress={pickImage}>
                <MaterialIcons name='edit' size={20} color={colors.black_default} />
            </TouchableOpacity>
        </TouchableOpacity>

        <View style={[styles.modal, {display: modalVisible ? 'flex' : 'none'}]}>
            <View style={[styles.modalBody]}>
                <Image 
                    source={ imageUri ? {uri : imageUri} : require('../assets/images/perfil-teste.png')}
                    style={styles.img}
                    key={imageUri}
                />
                <TouchableOpacity style={styles.btnClose} activeOpacity={0.7} onPress={handleShowModal}>
                    <MaterialIcons name="close" size={25} />
                </TouchableOpacity>
            </View>
        </View>

        </>
    )
}

const styles = StyleSheet.create({
    picture: {
        borderWidth: 1, 
        width: 150, 
        height: 150, 
        backgroundColor: colors.gray_default,
        borderRadius: 100,
        position: 'relative'
    },
    editButton : {
        position: 'absolute',
        bottom: 10,
        right: 2,
        backgroundColor: colors.green_dark,
        borderRadius: 100,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modal:{
        backgroundColor: colors.white_default,
        position: 'absolute',
        width,
        height,
        zIndex: 9,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalBody:{
        width: width - 80,
        height: height - 450,
        backgroundColor: colors.gray_default,
        borderRadius: 20,
        zIndex: 10
        
    },
    img:{
        width: '100%', 
        height: '100%', 
        borderRadius: 20
    },
    btnClose:{
        position: 'absolute',
        right: -10,
        top: -15,
        backgroundColor: colors.green_dark,
        padding: 5,
        borderRadius: 100
    }
})