import { View, TouchableOpacity, Image, StyleSheet, Dimensions, Text } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { format } from 'date-fns'
import Constants from 'expo-constants'
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const EducationalContent = ({id, title, content, create_date: createDate, username, user_id: userId, content_picture:contentPicutre }) => {
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;
    const [userPicture, setUserPicture] = useState(null);
    const fetchUserImage = async () => {
        const response = await fetch(`${url}/users/${userId}`);

        if(response.ok){
            const data = await response.json();
            setUserPicture(data.profile_picture);
        }
    }

    useFocusEffect(
        useCallback(()=>{
            fetchUserImage();
        }, [])
    );
    return (
        <View style={styles.postContainer}>
            {/* Informações do usuário */}
            <View style={styles.userInfo}>
                <Image source={{ uri:`data:image/jpeg;base64,${userPicture}`}} style={styles.userImage} />
                <View>
                    <Text style={styles.userName}>{username}</Text>
                    <Text style={styles.postUserRole}>Administrador</Text>
                </View>
            </View>

            {/* Descrição do post */}
            <Text style={styles.postTitle}>{title}</Text>
            <Text style={styles.postDescription}>{content}</Text>

            {/* Imagem postada */}
            {contentPicutre ? <Image source={{ uri:`data:image/jpeg;base64,${contentPicutre}` }} style={[styles.postImage,{width: width-50, height: height-250}]} /> : null}
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
        elevation: 3, // Sombra para Android
        shadowColor: '#000', // Sombra para iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
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
});

/* const styles = StyleSheet.create({
    postContainer:{
        backgroundColor: '#FFBDBD',
        width: width,
        marginBottom: 24,
    },
    image:{
        width: 65,
        height: 65,
        backgroundColor: 'gray'
    },
    postHeader:{
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    postUserIdentificationContainer:{
        flexDirection: 'row',
        gap: 12
    },
    postUserIdentification: {
        gap: 4
    },
    postUserName:{
        fontSize: 18,
        fontWeight: 'bold',
        //COLOCAR UM OVERFLOW PARA ACRESTAR ... QUANDO O NOME FOR MUITO GRANDE
    },
    postUserRole:{
        fontSize: 14,
    },
    postDate:{
        fontSize: 12
    },
    postImage:{
        width: width,
        height: height - 350,
        backgroundColor: 'gray'
    },
    footerActions:{
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    comments:{
        textAlign: 'right',
        fontSize: 12
    },

}); */