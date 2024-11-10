/**IMPORTS NECESSÁRIOS PARA O COMPONENTE */
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { colors } from "../css/base";
import { MaterialIcons, Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { getTokenAndUserId } from "../helpers/Auth";
import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import { Mode } from "../helpers/Enums";


/**
 * Componente que exibe as informações de um ponto de coleta (recycling center).
 * @param {object} props - Propriedades do componente.
 * @param {string} props.id - ID do ponto de coleta.
 * @param {string} props.name - Nome do ponto de coleta.
 * @param {string} props.street - Rua do ponto de coleta.
 * @param {string} props.number - Número do ponto de coleta.
 * @param {string} props.complement - Complemento do endereço.
 * @param {string} props.postalCode - Código postal do ponto de coleta.
 * @param {string} props.state - Estado onde o ponto de coleta está localizado.
 * @param {string} props.city - Cidade onde o ponto de coleta está localizado.
 * @param {string} props.openingHour - Horário de funcionamento do ponto de coleta.
 * @param {string} props.phoneNumber - Número de telefone do ponto de coleta.
 * @param {function} props.setModalVisible - Função para mostrar ou esconder o modal de edição.
 * @param {function} props.setMode - Função para definir o modo (criação ou edição).
 * @param {function} props.setRecyclingCenterToEdit - Função para definir os dados do ponto de coleta a ser editado.
 * @returns Componente de exibição do ponto de coleta.
 */
const RecyclingCenter = ({id, name, street, number, complement, postalCode, state, city, openingHour, phoneNumber, setModalVisible, setMode, setRecyclingCenterToEdit}) =>{
    // Estados do componente
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;
    const [isAdmin, setIsAdmin] = useState(null);
    /**
     * Método handler para exibir uma mensagem de confirmação para deletar um ponto de coleta.
     */
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

    /**
     * Função para deletar o ponto de coleta do banco de dados.
     * @param {string} id - ID do ponto de coleta a ser deletado.
     */
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

    /**
     * Método handler para copiar o endereço do ponto de coleta para a área de transferência.
     */
    const handleClipBoard = async () => {
        const address = `${street}, ${number}, ${city}-${state}`;
        await Clipboard.setStringAsync(address);
    };

    /**
     * Função para abrir o modal de edição do ponto de coleta.
     * Define o modo para edição e os dados do ponto a ser editado.
     */
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
    // Efeito para obter as informações do usuário (se é admin ou não) ao carregar o componente
    useEffect(() => {
        const getUserInfo = async () => {
            const { isAdmin } = await getTokenAndUserId();
            setIsAdmin(isAdmin);
        }

        getUserInfo();
    }, []);
    /**
     * Componente de exibição do ponto de coleta.
     */
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

//Exporta o componente com o nome default
export default RecyclingCenter;

/**
 * Estilização do cabeçalho da lista de comentários
 */
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