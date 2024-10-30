import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { colors } from "../css/base";
import { MaterialIcons, Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { getTokenAndUserId } from "../helpers/Auth";
import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import { Mode } from "../helpers/Enums";

const RecyclingCenter = ({id, name, street, number, complement, postalCode, state, city, openingHour, phoneNumber, setModalVisible, setMode, setRecyclingCenterToEdit}) =>{
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;
    const [isAdmin, setIsAdmin] = useState(null);
    const handleDeleteMessage = () => {
        Alert.alert('Deletar ponto de coleta', `Você realmente deseja deletar o ponto de coleta '${name}'`, [{
            text: 'Não',
            style: 'cancel'
        },{
            text: 'Sim',
            style: 'default',
            onPress: () => handleDelete(id)
        }])
    };

    const handleDelete = async (id) => {
        const { token } = await getTokenAndUserId();
        const response = await fetch(`${url}/recyclingcenters/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if(!response.ok){
            const data = await response.json();
            Alert.alert('Erro ao deletar ponto de coleta', data.message);
        }
    }

    const handleClipBoard = async () => {
        const address = `${street}, ${number}, ${city}-${state}`;
        await Clipboard.setStringAsync(address);
    };

    const handleToEditRecyclingCenter = () => {
        setMode(Mode.update);
        setModalVisible(true);
        const recyclingToEditData = {
            id,
            name,
            street,
            number,
            complement,
            postalCode,
            state,
            city,
            openingHour,
            phoneNumber
        }
        setRecyclingCenterToEdit(recyclingToEditData);
    }
    useEffect(() => {
        const getUserInfo = async () => {
            const { isAdmin } = await getTokenAndUserId();
            setIsAdmin(isAdmin);
        }

        getUserInfo();
    }, []);
    return (
        <View style={styles.container}>
            
                <View style={{position: 'absolute', top: 5, flexDirection: 'row', right: 5, gap: 4}}>
                {isAdmin == '1' && (
                    <>
                        <TouchableOpacity style={styles.actionButtons} onPress={handleToEditRecyclingCenter}>
                            <MaterialIcons name='edit' size={16} color='#FFFFFF'/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButtons} onPress={handleDeleteMessage}>
                            <MaterialIcons name='delete' size={16} color='#FFFFFF'/>
                        </TouchableOpacity>
                    </>
                )}
                <TouchableOpacity style={styles.actionButtons} onPress={handleClipBoard}>
                    <MaterialIcons name='content-copy' size={16} color='#FFFFFF'/>
                </TouchableOpacity>
                </View>
            

            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 16}}>
                <Text style={styles.recyclingName}>{name}</Text>
            </View>
            <View style={styles.textInfo}>
                <Ionicons name='location-outline' size={22} color={colors.black_default}/>
                <Text style={styles.text}>{street}, {number}, {city}-{state}</Text>
            </View>
            <View style={styles.textInfo}>
                <MaterialIcons name='info-outline' size={22} color={colors.black_default}/>
                <Text style={styles.text}>{complement}</Text>
            </View>
            <View style={styles.textInfo}>
                <MaterialCommunityIcons name='mailbox-outline' size={22} color={colors.black_default}/>
                <Text style={styles.text}>{postalCode}</Text>
            </View>
            <View style={styles.textInfo}>
                <MaterialCommunityIcons name='clock-outline' size={22} color={colors.black_default}/>
                <Text style={styles.text}>{openingHour}</Text>
            </View>
            <View style={styles.textInfo}>
                <Feather name='phone' size={20} color={colors.black_default}/>
                <Text style={styles.text}>{phoneNumber}</Text>
            </View>
        </View>
    )
}

export default RecyclingCenter;

const styles = StyleSheet.create({
    container:{
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        gap: 6,
        backgroundColor: '#FFFFFF',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    recyclingName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black_default
    },
    label:{
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.black_default
    },
    text:{
        fontSize: 14,
        color: '#52525b',
        flex: 1
    },
    textInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        flex: 1,
    },
    actionButtons:{
        backgroundColor: '#4b5563', 
        borderRadius: 100, 
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center'  
    }
});