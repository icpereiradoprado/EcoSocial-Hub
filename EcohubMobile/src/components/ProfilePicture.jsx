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
 * @param {imageUri} imageUri URI da imagem de perfil do usuário
 * @param {name} name Nome do usuário
 * @returns Componente Imagem do Perfil do usuário
 */
export function ProfilePicture({token, userId, imageUri, name}){
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
            setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
            
            //console.log(result.assets[0].uri)
            //TODO: Extrair o type/extensão do arquivo para colocar na string abaixo, tornando a extensão dinâmica
            //saveImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
            saveImage(`${result.assets[0].base64}`);
        }
    };

    const saveImage = async (base64String) => {
        try {
            const reqBody = { "profile_picture" : base64String }

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

    // Função para pegar a primeira letra do nome
    const getInitialLetter = (name) => {
        return name ? name.charAt(0).toUpperCase() : '';
    };


    // Carrega a imagem com base na inicial do nome
    const getInitialImage = (initialLetter) => {
        switch (initialLetter) {
            case 'A': return require('../assets/images/profile_pictures/A.png');
            case 'B': return require('../assets/images/profile_pictures/B.png');
            case 'C': return require('../assets/images/profile_pictures/C.png');
            case 'D': return require('../assets/images/profile_pictures/D.png');
            case 'E': return require('../assets/images/profile_pictures/E.png');
            case 'F': return require('../assets/images/profile_pictures/F.png');
            case 'G': return require('../assets/images/profile_pictures/G.png');
            case 'H': return require('../assets/images/profile_pictures/H.png');
            case 'I': return require('../assets/images/profile_pictures/I.png');
            case 'J': return require('../assets/images/profile_pictures/J.png');
            case 'K': return require('../assets/images/profile_pictures/K.png');
            case 'L': return require('../assets/images/profile_pictures/L.png');
            case 'M': return require('../assets/images/profile_pictures/M.png');
            case 'N': return require('../assets/images/profile_pictures/N.png');
            case 'O': return require('../assets/images/profile_pictures/O.png');
            case 'P': return require('../assets/images/profile_pictures/P.png');
            case 'Q': return require('../assets/images/profile_pictures/Q.png');
            case 'R': return require('../assets/images/profile_pictures/R.png');
            case 'S': return require('../assets/images/profile_pictures/S.png');
            case 'T': return require('../assets/images/profile_pictures/T.png');
            case 'U': return require('../assets/images/profile_pictures/U.png');
            case 'V': return require('../assets/images/profile_pictures/V.png');
            case 'W': return require('../assets/images/profile_pictures/W.png');
            case 'X': return require('../assets/images/profile_pictures/X.png');
            case 'Y': return require('../assets/images/profile_pictures/Y.png');
            case 'Z': return require('../assets/images/profile_pictures/Z.png');
            default: return require('../assets/images/profile_pictures/perfil-default.png')
        }
    };

    const initialLetter = getInitialLetter(name);
    const initialImage = getInitialImage(initialLetter);

    
    return (
        <>
        <TouchableOpacity activeOpacity={0.9} onPress={handleShowModal}>
            <Image 
                source={image ? {uri : image} : imageUri ? {uri : `data:image/jpeg;base64,${imageUri}`} : initialImage }
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
                    source={image ? {uri : image} : imageUri ? {uri : `data:image/jpeg;base64,${imageUri}`} : require('../assets/images/profile_pictures/perfil-default.png')}
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