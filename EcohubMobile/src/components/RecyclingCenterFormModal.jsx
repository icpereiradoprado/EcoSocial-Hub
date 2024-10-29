import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert  } from "react-native";
import { Input } from "./Input";
import { Button } from "./Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getTokenAndUserId } from '../helpers/Auth';
import { Mode } from '../helpers/Enums';
import { base, colors } from "../css/base";
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { TextInputMask } from 'react-native-masked-text';
import Constants from 'expo-constants';


const RecyclingCenterFormModal = ({modalVisible, setModalVisible, mode, recyclingCenterToEdit}) => {
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;
    const [name, setName] = useState(null);
    const [street, setStreet] = useState(null);
    const [number, setNumber] = useState(null);
    const [complement, setComplement] = useState(null);
    const [postalCode, setPostalCode] = useState(null);
    const [state, setState] = useState(null);
    const [city, setCity] = useState(null);
    const [openingHour, setOpeningHour] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);

    const handleSaveData = async () => {
        const { token, userId } = await getTokenAndUserId(); //Traz o token e o Id do usuário logado
        if(mode == Mode.create){
            const body = JSON.stringify({
                name,
                street,
                number,
                complement,
                postal_code : postalCode,
                state,
                city,
                opening_hour: openingHour,
                phone_number: phoneNumber
            });

            const response = await fetch(`${url}/recyclingcenters/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body
            })

            if(response.ok){
                setModalVisible(false);
                handleResetInputs();
            }else{
                const data = await response.json();
                Alert.alert('Erro ao cadastrar', data.message);
            }
        }else if(mode == Mode.update){
            const body = JSON.stringify({
                name,
                street,
                number,
                complement,
                postal_code : postalCode,
                state,
                city,
                opening_hour: openingHour,
                phone_number: phoneNumber
            });
            const response = await fetch(`${url}/ecyclingcenters/edit/${recyclingCenterToEdit.id}`,{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body
            });

            if(response.ok){
                setModalVisible(false);
            }else{
                const data = await response.json();
                Alert.alert('Erro ao editar ponto de coleta', data.message);
            }

        }
    }

    const handleResetInputs = ()=>{
        setName(null);
        setStreet(null);
        setNumber(null);
        setComplement(null);
        setPostalCode(null);
        setState(null);
        setCity(null);
        setOpeningHour(null);
        setPhoneNumber(null);
    }

    useEffect(()=>{
        if(mode == Mode.update && recyclingCenterToEdit){
            setName(recyclingCenterToEdit.name);
            setStreet(recyclingCenterToEdit.street);
            setNumber(recyclingCenterToEdit.number);
            setComplement(recyclingCenterToEdit.complement);
            setPostalCode(recyclingCenterToEdit.postalCode);
            setState(recyclingCenterToEdit.state);
            setCity(recyclingCenterToEdit.city);
            setOpeningHour(recyclingCenterToEdit.openingHour);
            setPhoneNumber(recyclingCenterToEdit.phoneNumber);
        }
    },[recyclingCenterToEdit]);

    return (
        <Modal
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        > 
            <KeyboardAwareScrollView>
                <View style={styles.modalView}>
                    <View style={{width: '100%'}}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <MaterialIcons name='close' size={25}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalBodyForm}>
                        <Text style={base.title} >{mode === Mode.create ? 'Novo ponto de coleta' : 'Editar ponto de coleta'}</Text>
                        <View style={{width: '100%', height: '100%'}}>
                            <View style={styles.sendButton}>
                                <Input 
                                    name="name"
                                    value={name}
                                    onChangeText={setName}
                                    placeholder='Nome do local'
                                    autoCapitalize="none"
                                />
                                <Input 
                                    name="street"
                                    value={street}
                                    onChangeText={setStreet}
                                    placeholder='Endereço'
                                    autoCapitalize="none"
                                />
                                <Input 
                                    name="number"
                                    value={number}
                                    onChangeText={setNumber}
                                    placeholder='Número'
                                    autoCapitalize="none"
                                    inputMode='numeric'
                                />
                                <Input 
                                    name="complement"
                                    value={complement}
                                    onChangeText={setComplement}
                                    placeholder='Complemento'
                                    autoCapitalize="none"
                                />
                                <TextInputMask
                                    type={'custom'}
                                    options={{mask: '99999-999'}}
                                    value={postalCode}
                                    onChangeText={setPostalCode}
                                    name='postal_code'
                                    placeholder='CEP'
                                    style={base.input}
                                    inputMode='numeric'
                                />
                                <Input 
                                    name="state"
                                    value={state}
                                    onChangeText={setState}
                                    placeholder='Estado'
                                    autoCapitalize="none"
                                    maxLength={2}
                                />
                                <Input 
                                    name="city"
                                    value={city}
                                    onChangeText={setCity}
                                    placeholder='Cidade'
                                    autoCapitalize="none"
                                />
                                <Input 
                                    name="opening_hour"
                                    value={openingHour}
                                    onChangeText={setOpeningHour}
                                    placeholder='Funcionamento'
                                    autoCapitalize="none"
                                />
                                <TextInputMask
                                    type={'custom'}
                                    name='phone_number'
                                    options={{mask: '(99) 99999-9999'}}
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    placeholder='Telefone'
                                    style={base.input}
                                    inputMode='numeric'
                                />
                                <Button buttonText={mode == Mode.create ? 'Criar ponto de coleta' : 'Atualizar informações'} onPress={handleSaveData}/>
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </Modal> 
    )
}

export default RecyclingCenterFormModal;

const styles = StyleSheet.create({
    modalView: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    sendButton:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    modalBodyForm: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    closeButton: {
        width: 30,
        height: 30
    }
})