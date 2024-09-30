import { useEffect, useId, useState } from 'react';
import { View, TouchableOpacity, Alert, Image, StyleSheet, Text, Pressable, Dimensions } from 'react-native';
import { MaterialIcons }  from '@expo/vector-icons';
import { colors } from '../css/base';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height,  width } = Dimensions.get('window');

/**
 * Componente Imagem do Perfil do usuário
 * @param {string} token token de autenticação
 * @param {number} userId id do usuário
 * @param {imageUri} imageUri URI da imagem de perfil do usuário
 * @param {name} name Nome do usuário
 * @returns Componente Imagem do Perfil do usuário
 */
export function ProfilePicture({token, userId, imageUri, setImageUri, name}){
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;

    const [modalVisible, setModalVisible] = useState(false);
    const [image, setImage] = useState(null);
    const [initialImage, setInitialImage] = useState(null);
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
                    setImage(null);
                    try {
                        await AsyncStorage.removeItem('profile_picture_removed');
                    } catch (err) {
                        console.error('Erro ao criar armazenar dado em cache:', err)
                    }
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
            case 'A': setInitialImage(require('../assets/images/profile_pictures/A.png')); break;
            case 'B': setInitialImage(require('../assets/images/profile_pictures/B.png')); break;
            case 'C': setInitialImage(require('../assets/images/profile_pictures/C.png')); break;
            case 'D': setInitialImage(require('../assets/images/profile_pictures/D.png')); break;
            case 'E': setInitialImage(require('../assets/images/profile_pictures/E.png')); break;
            case 'F': setInitialImage(require('../assets/images/profile_pictures/F.png')); break;
            case 'G': setInitialImage(require('../assets/images/profile_pictures/G.png')); break;
            case 'H': setInitialImage(require('../assets/images/profile_pictures/H.png')); break;
            case 'I': setInitialImage(require('../assets/images/profile_pictures/I.png')); break;
            case 'J': setInitialImage(require('../assets/images/profile_pictures/J.png')); break;
            case 'K': setInitialImage(require('../assets/images/profile_pictures/K.png')); break;
            case 'L': setInitialImage(require('../assets/images/profile_pictures/L.png')); break;
            case 'M': setInitialImage(require('../assets/images/profile_pictures/M.png')); break;
            case 'N': setInitialImage(require('../assets/images/profile_pictures/N.png')); break;
            case 'O': setInitialImage(require('../assets/images/profile_pictures/O.png')); break;
            case 'P': setInitialImage(require('../assets/images/profile_pictures/P.png')); break;
            case 'Q': setInitialImage(require('../assets/images/profile_pictures/Q.png')); break;
            case 'R': setInitialImage(require('../assets/images/profile_pictures/R.png')); break;
            case 'S': setInitialImage(require('../assets/images/profile_pictures/S.png')); break;
            case 'T': setInitialImage(require('../assets/images/profile_pictures/T.png')); break;
            case 'U': setInitialImage(require('../assets/images/profile_pictures/U.png')); break;
            case 'V': setInitialImage(require('../assets/images/profile_pictures/V.png')); break;
            case 'W': setInitialImage(require('../assets/images/profile_pictures/W.png')); break;
            case 'X': setInitialImage(require('../assets/images/profile_pictures/X.png')); break;
            case 'Y': setInitialImage(require('../assets/images/profile_pictures/Y.png')); break;
            case 'Z': setInitialImage(require('../assets/images/profile_pictures/Z.png')); break;
            default : setInitialImage(require('../assets/images/profile_pictures/perfil-default.png'))
        }
    }; 

    const handleDeletePictureMessage = () =>{
        Alert.alert('Remover foto', 'Você realmente deseja remover a foto do perfil? ',[{
            text: 'Não',
            style: 'cancel'
        },{
            text: 'Sim',
            onPress: handleDeletePicture
        }])
    }

    const handleDeletePicture = async () => {
        try {
            const profile_picture_removed = await AsyncStorage.getItem('profile_picture_removed');
            console.log(profile_picture_removed);
            if(profile_picture_removed !== 'true'){
                if(token && userId && imageUri){
                    const response = await fetch(`${url}/users/edit/${useId}`,{
                        method: 'PATCH',
                        headers: {
                            'Content-type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({"profile_picture" : null})
                    });
    
                    if(response.ok){
                        setImageUri(null);
                        setImage(null);
                        setInitialImage(null);
                        try {
                            await AsyncStorage.setItem('profile_picture_removed', 'true');
                        } catch (err) {
                            console.error('Erro ao criar armazenar dado em cache:', err)
                        }
                        Alert.alert('Sucesso', 'Imagem removida com sucesso!');
                    }
                }
            }
        } catch (err) {
            console.error('Erro ao deletar a imagem:', err)
        }
    }

    useEffect(()=>{
        const initialLetter = getInitialLetter(name);
        getInitialImage(initialLetter);
    }, [name])

    return (
        <>
        <TouchableOpacity activeOpacity={0.9} onPress={handleShowModal}>
            <Image 
                source={image ? {uri : image} : imageUri ? {uri : `data:image/jpeg;base64,${imageUri}`} : initialImage }
                style={styles.picture}
                key={imageUri}
            />
            <TouchableOpacity activeOpacity={0.7} style={styles.editButton} onPress={pickImage}>
                <MaterialIcons name='photo-camera' size={20} color={colors.black_default} />
            </TouchableOpacity>
        </TouchableOpacity>

        <View style={[styles.modal, {display: modalVisible ? 'flex' : 'none'}]}>
            <View style={[styles.modalBody]}>
                <Image 
                    source={image ? {uri : image} : imageUri ? {uri : `data:image/jpeg;base64,${imageUri}`} : initialImage }
                    style={styles.img}
                    key={imageUri}
                />
                <TouchableOpacity style={styles.btnClose} activeOpacity={0.7} onPress={handleShowModal}>
                    <MaterialIcons name="close" size={25} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={handleDeletePictureMessage}>
                <View style={{alignItems: 'center', flexDirection: 'row', marginTop: 10}}>
                    <Text style={{color: '#F5392B', textDecorationLine: 'underline'}}>Remover foto</Text>
                    <MaterialIcons name='delete' size={20} color='#F5392B'/>
                </View>
            </TouchableOpacity>
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