import { View, TouchableOpacity, Image, StyleSheet, Dimensions, Text } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { format } from 'date-fns'
import Constants from 'expo-constants'
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../css/base';
import { getTokenAndUserId } from '../helpers/Auth';
import { Alert } from 'react-native';
import { Mode } from '../helpers/Enums';

const { height, width } = Dimensions.get('window');

const EducationalContent = ({id, title, content, tag, create_date: createDate, username, user_id: userId, content_picture:contentPicture, setModalVisible, setMode, setEducationalContentToEdit }) => {
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;
    const [userPicture, setUserPicture] = useState(null);
    const [selectEducationalContent, setSelectEducationalContent] = useState(null);
    const [isAdmin, setIsAdmin] = useState(0);
    const [userToken, setUserToken] = useState(null);
    const tags = tag ? tag.split(';') : null;

    const fetchUserImage = async () => {
        const response = await fetch(`${url}/users/${userId}`);

        if(response.ok){
            
            const data = await response.json();
            setUserPicture(data.profile_picture);
        }
    }

    const showEditTooltip = (id) => {
        if(selectEducationalContent === id){
            setSelectEducationalContent(null);
        }else{
            setSelectEducationalContent(id);
        }
        
    }
    const handleDeleteContent = async (id) => {
        try {
            await fetch(`${url}/educationalcontents/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });
        } catch (err) {
            console.error(`Erro ao deletar conteúdo: ${err.message}`);
        }
    }
    const handleDeleteContentMesssage = (title, id) => {
        Alert.alert('Deletar conteúdo educativo', `Você realmente deseja deletar o conteúdo '${title}'?`,[
            { text: 'Não', style: 'cancel'},
            { text: 'Sim', style: 'default', onPress: () => handleDeleteContent(id) }
        ])
    }
    const handleToSetEducationalContentToEdit = () => {
        const educationalContent = {
            id,
            title,
            content,
            contentPicture,
            tag
        }
        setEducationalContentToEdit(educationalContent);
    }
    useEffect(() => {
        const getUserInfo = async () => {
            const { userId: loggedUserId, isAdmin, token } = await getTokenAndUserId();
            setIsAdmin(isAdmin);
            setUserToken(token);
        }
        getUserInfo();
    }, []);

    useFocusEffect(
        useCallback(()=>{
            fetchUserImage();
        },[])
    );
    return (
        <View style={styles.postContainer}>
            {/* Informações do usuário */}
            <View style={styles.userInfo}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={{ uri:`data:image/jpeg;base64,${userPicture}`}} style={styles.userImage} />
                    <View>
                        <Text style={styles.userName}>{username}</Text>
                        <Text style={styles.postUserRole}>Administrador</Text>
                    </View>
                </View>
                {(isAdmin == 1) && (
                    <TouchableOpacity onPress={() => showEditTooltip(id) }>
                        <MaterialIcons name='more-vert' size={25}/>
                    </TouchableOpacity>
                )}
                {selectEducationalContent === id && (
                    <View style={styles.editTooltip}>
                        <TouchableOpacity onPress={() => {setModalVisible(true); setMode(Mode.update); handleToSetEducationalContentToEdit(); setSelectEducationalContent(null)}}>
                            <Text style={styles.buttonTooltip}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {handleDeleteContentMesssage(title, id); setSelectEducationalContent(null)}}>
                            <Text style={[styles.buttonTooltip, {color: 'red'}]}>Deletar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Descrição do post */}
            <Text style={styles.postTitle}>{title}</Text>
            <Text style={styles.postDescription}>{content}</Text>

            {/* Imagem postada */}
            {contentPicture ? <Image source={{ uri:`data:image/jpeg;base64,${contentPicture}` }} style={[styles.postImage,{width: '100%', height: height-350}]} /> : null}
            {tags && 
                <View style={styles.tags}>
                    {Array.isArray(tags) ? tags.map((tag, index) => <Text key={index} style={styles.textTag}>#{tag}</Text>) : <Text style={styles.textTag}>#{tags}</Text>}
                </View>
            }
            <Text style={styles.date}>{format(new Date(createDate), 'dd/MM/yyyy HH:mm:ss')}</Text>

        </View>
    )
}

export default EducationalContent;

const styles = StyleSheet.create({
    postContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
        justifyContent: 'space-between'
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    postTitle:{
        fontWeight: 'bold',
        fontSize:20,
    },
    postDescription: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    postImage: {
        borderRadius: 8,
        marginBottom: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        padding: 10,
        backgroundColor: '#ddd',
        borderRadius: 4,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    editTooltip:{
        width: 150,
        position: 'absolute',
        borderRadius: 12,
        backgroundColor: 'white',
        right: 5,
        top: 25,
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
    tags: {
        flexDirection: 'row',
        marginBottom: 8,
        gap: 4
    },
    textTag : {
        color: '#52525b'
    }
});