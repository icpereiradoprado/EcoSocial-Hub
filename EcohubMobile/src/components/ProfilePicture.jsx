/**IMPORTS NECESSÁRIOS PARA O COMPONENTE */
import { useEffect, useId, useState } from 'react';
import { View, TouchableOpacity, Alert, Image, StyleSheet, Text, Pressable, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../css/base';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import Loading from './Loading';

const { height, width } = Dimensions.get('window');

/**
 * Componente Imagem do Perfil do usuário
 * @param {string} token token de autenticação
 * @param {number} userId id do usuário
 * @param {imageUri} imageUri URI da imagem de perfil do usuário
 * @param {setImageUri} setImageUri Handler que altera o estado de `imageUri`
 * @param {name} name Nome do usuário
 * @param {setScrollEnabled} setScrollEnabled Handler que altera o estado de `scrollEnabled`. Propriedade utilizada em `SettingsScreen`
 * @returns Componente Imagem do Perfil do usuário
 */
export function ProfilePicture({ token, userId, imageUri, setImageUri, name, setScrollEnabled }) {
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleOptionPicture, setModalVisibleOptionPicture] = useState(false);
    const [image, setImage] = useState(null);
    const [initialImage, setInitialImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');

    /**
     * Método handler para exibir o modal de exibição da imagem
     */
    const handleShowModal = () => {
        setModalVisible(!modalVisible);
    }

    /**
     * Método handler para exibir o modal de opções de seleção de imagem
     */
    const handleShowModalOptionPicture = () => {
        setModalVisibleOptionPicture(!modalVisibleOptionPicture);
        if(modalVisibleOptionPicture){
            setScrollEnabled(false);
        }else{
            setScrollEnabled(true);
        }
    }

    /**
     * Método handler para selecionar uma image para o perfil do usário
     * @param {number} option opção de carregamento da imagem (0 = Galeria [default] | 1 = Câmera)
     */
    const handlePickImage = async (option = 0) => {
        const lauchImagePickerOptions = {
            0 : "launchImageLibraryAsync",
            1 : "launchCameraAsync"
        }

        const optionsImagePicker = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            base64: true,
            cameraType: ImagePicker.CameraType.front
        }

        let result = await ImagePicker[lauchImagePickerOptions[option]](optionsImagePicker);

        if (!result.canceled) {
            setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);

            //TODO: Extrair o type/extensão do arquivo para colocar na string abaixo, tornando a extensão dinâmica
            //handleSaveImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
            handleSaveImage(`${result.assets[0].base64}`);
            handleShowModalOptionPicture();
        }
    };

    /**
     * Método handler para salvar a imagem selecionada no banco de dados
     * @param {string} base64String Imagem em base64
     */
    const handleSaveImage = async (base64String) => {
        setIsLoading(true);
        setLoadingText('Salvando a imagem...');
        try {
            const reqBody = { "profile_picture": base64String }

            if (token && userId) {
                const response = await fetch(`${url}/users/edit/${userId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(reqBody)
                });

                const data = await response.json();
                if (response.ok) {
                    setIsLoading(false);
                    //Alert.alert('Sucesso!', 'Imagem alterada!');
                    setImageUri(base64String);
                } else {
                    Alert.alert('Erro ao salvar a imagem!', data.message);
                }
            } else {
                console.error('Token ou Id do usuário não pode ser nulo!');
            }

        } catch (err) {
            console.error('Erro ao enviar a imagem:', err);
        }
    };

    /**
     * Função para pegar a primeira letra do nome
     * @param {string} name Nome do usuário
     * @returns 
     */
    const getInitialLetter = (name) => {
        //Se existir um nome iniciado em letra, converte ela para Maiúsculo e normaliza, removendo os acentos.
        return name ? name.charAt(0).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
    };


    /**
     * Carrega a imagem com base na inicial do nome do usuário
     * @param {string} initialLetter Letra inicial do nome do usuário
     */
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
            default: setInitialImage(require('../assets/images/profile_pictures/perfil-default.png'))
        }
    };

    /**
     * Método handler para exibir a mensagem de confirmação para a deleção da imagem de perfil
     */
    const handleDeletePictureMessage = () => {
        Alert.alert('Remover foto', 'Você realmente deseja remover a foto do perfil? ', [{
            text: 'Não',
            style: 'cancel'
        }, {
            text: 'Sim',
            onPress: handleDeletePicture
        }])
    }

    /**
     * Método handler para deletar a imagem de perfil
     */
    const handleDeletePicture = async () => {
        setIsLoading(true);
        setLoadingText('Deletando a imagem...');
        try {
            if (token && userId && imageUri) {
                const response = await fetch(`${url}/users/edit/${useId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ "profile_picture": null })
                });

                if (response.ok) {
                    setImageUri(null);
                    setImage(null);
                    setIsLoading(false);
                }
            }
        } catch (err) {
            console.error('Erro ao deletar a imagem:', err)
        }
    }

    /**UseEffect usado para alterar a imagem inicial de acordo com a mudança de estado de `name` */
    useEffect(() => {
        const initialLetter = getInitialLetter(name);
        getInitialImage(initialLetter);
    }, [name]);

    /**UseEffect usado para alterar o estado do scroll da tela de acordo a mudança de estado de `modalVisible`, `modalVisibleOptionPicture` ou `isLoading` */
    useEffect(() => {
        if(modalVisible || modalVisibleOptionPicture || isLoading){
            setScrollEnabled(false);
        }else{
            setScrollEnabled(true);
        }
    }, [modalVisible, modalVisibleOptionPicture, isLoading]);

    /**
     * Modal de foto de perfil do usuário
     */
    return (
        <>
            <Loading isLoading={isLoading} loadingText={loadingText} />
            <TouchableOpacity activeOpacity={0.9} onPress={handleShowModal}>
                {/** IMAGEM COM DIMENSÕES MENORES */}
                <Image
                    source={image ? { uri: image } : imageUri ? { uri: `data:image/jpeg;base64,${imageUri}` } : initialImage}
                    style={styles.picture}
                    key={imageUri}
                />
                <TouchableOpacity activeOpacity={0.7} style={styles.editButton} onPress={handleShowModalOptionPicture}>
                    <MaterialIcons name='photo-camera' size={20} color={colors.black_default} />
                </TouchableOpacity>
            </TouchableOpacity>

            {/**MODAL QUE EXIBE A IMAGEM */}
            <View style={[styles.modal, { display: modalVisible ? 'flex' : 'none' }]}>
                <View style={[styles.modalBody]}>
                    {/** IMAGEM COM DIMENSÕES MAIORES */}
                    <Image
                        source={image ? { uri: image } : imageUri ? { uri: `data:image/jpeg;base64,${imageUri}` } : initialImage}
                        style={styles.img}
                        key={imageUri}
                    />
                    <TouchableOpacity style={styles.btnClose} activeOpacity={0.7} onPress={handleShowModal}>
                        <MaterialIcons name="close" size={25} />
                    </TouchableOpacity>
                </View>
                {
                    (imageUri || image) &&
                    <TouchableOpacity activeOpacity={0.7} onPress={handleDeletePictureMessage}>
                        <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
                            <Text style={{ color: '#F5392B', textDecorationLine: 'underline' }}>Remover foto</Text>
                            <MaterialIcons name='delete' size={20} color='#F5392B' />
                        </View>
                    </TouchableOpacity>
                }
            </View>
            
            {/**MODAL QUE EXIBE AS OPÇÕES DE SELEÇÃO DE IMAGEM */}
            <View style={[styles.modal, { display:  modalVisibleOptionPicture ? 'flex' : 'none' }]}>
                <View style={[styles.modalBody, {height: height - 600, alignItems: 'center', justifyContent: 'center'}]}>
                    <View style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-around'
                    }}
                    >
                        <TouchableOpacity activeOpacity={0.7} onPress={()=>{handlePickImage(1)}}>
                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                <MaterialIcons name='add-a-photo' size={50} color={colors.green_default}/>
                                <Text style={{color: '#FFFFFF', fontWeight: '600', textAlign: 'center'}}>Câmera</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} onPress={()=>{handlePickImage(0)}}>
                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                <MaterialIcons name='add-photo-alternate' size={50} color={colors.green_default}/>
                                <Text style={{color: '#FFFFFF', fontWeight: '600', textAlign: 'center'}}>Galeria</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.btnClose} activeOpacity={0.7} onPress={handleShowModalOptionPicture}>
                        <MaterialIcons name="close" size={25} />
                    </TouchableOpacity>
                </View>  
            </View>

        </>
    )
}

/**
 * Estilização do cabeçalho da lista de comentários
 */
const styles = StyleSheet.create({
    picture: {
        borderWidth: 1,
        width: 150,
        height: 150,
        backgroundColor: colors.gray_default,
        borderRadius: 100,
        position: 'relative'
    },
    editButton: {
        position: 'absolute',
        bottom: 10,
        right: 2,
        backgroundColor: colors.green_dark,
        borderRadius: 100,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modal: {
        backgroundColor: colors.white_default,
        position: 'absolute',
        width,
        height,
        zIndex: 9,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalBody: {
        width: width - 80,
        height: height - 450,
        backgroundColor: colors.gray_default,
        borderRadius: 20,
        zIndex: 10

    },
    img: {
        width: '100%',
        height: '100%',
        borderRadius: 20
    },
    btnClose: {
        position: 'absolute',
        right: -10,
        top: -15,
        backgroundColor: colors.green_dark,
        padding: 5,
        borderRadius: 100
    }
})