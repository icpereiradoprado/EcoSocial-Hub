import { View, TouchableOpacity, Image, StyleSheet, Dimensions, Text } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { format } from 'date-fns'
import Constants from 'expo-constants'
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const EducationalContent = ({id, title, content, create_date: createDate, username, user_id: userId }) => {
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
            <View style={{paddingHorizontal: 16}}>
                {/*HEADER DO POST*/}
                <View style={styles.postHeader}>
                    <View style={styles.postUserIdentificationContainer}>
                        <Image source={{ uri:`data:image/jpeg;base64,${userPicture}`}} style={styles.image}/>
                        <View style={styles.postUserIdentification}>
                            <Text style={styles.postUserName}>{username} </Text>
                            <Text style={styles.postUserRole}>Administrador</Text>
                            <Text style={styles.postDate}>{format(new Date(createDate), 'dd/MM/yyyy HH:mm:ss')}</Text>
                        </View>
                    </View>
                    <TouchableOpacity>
                        <Entypo name="dots-three-horizontal" size={25} />
                    </TouchableOpacity>
                </View>
                {/*DESCRIPT DO POST*/}
                <View>
                    <Text>{title}</Text>
                    <Text>{content}</Text>
                </View>
            </View>
            {/*IMAGEM DO CONTEÚDO*/}
            <Image source={{uri: 'x'}}alt="Erro ao carregar a imagem" style={styles.postImage}/>
        </View>
    )
}

export default EducationalContent;

const styles = StyleSheet.create({
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

});