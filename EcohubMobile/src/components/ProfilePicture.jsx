import { useState } from 'react';
import { View, TouchableOpacity, Alert, Image, StyleSheet, Text, Pressable, Dimensions } from 'react-native';
import { MaterialIcons }  from '@expo/vector-icons';
import { colors } from '../css/base';
const { height,  width } = Dimensions.get('window');

export function ProfilePicture(props){
    const [modalVisible, setModalVisible] = useState(false);
    const handleEditProfilePicutre = () => {
        Alert.alert('Editar foto', 'Escolha sua foto')
    }

    const handleShowModal = () => {
        setModalVisible(!modalVisible);
    }

    
    return (
        <>
        <TouchableOpacity activeOpacity={0.9} onPress={handleShowModal}>
            <Image style={styles.picture} source={require('../assets/images/perfil-teste.png')} />
            <TouchableOpacity activeOpacity={0.7} style={styles.editButton} onPress={handleEditProfilePicutre}>
                <MaterialIcons name='edit' size={20} color={colors.black_default} />
            </TouchableOpacity>
        </TouchableOpacity>

        <View style={[styles.modal, {display: modalVisible ? 'flex' : 'none'}]}>
            <View style={[styles.modalBody]}>
                <Image style={styles.img} source={require('../assets/images/perfil-teste.png')} />
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