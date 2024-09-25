import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { base, colors } from '../css/base';
import { ProfilePicture } from '../components/ProfilePicture';
import { Input } from '../components/Input';
import { useCallback, useEffect, useState } from 'react';
import { PasswordInput } from '../components/PasswordInput';
import { Button } from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const { height } = Dimensions.get('window');
export function SettingsTest(){
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [loadingPreferencesData, setLoadingPreferencesData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disabledButtonSave, setDisabledButtonSave] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [city, setCity] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);

    const [originalName, setOriginalName] = useState('');
    const [originalEmail, setOriginalEmail] = useState('');
    const [originalPhoneNumber, setOriginalPhoneNumber] = useState('');
    const [originalCity, setOriginalCity] = useState('');

    const handleLogoutMessage = () => {
        Alert.alert('Logout', 'Deseja sair?', [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'Sim',
                onPress: handleLogout
            }
        ])
    }

    const handleLogout = ()=>{
        console.log('Logout..')
    }

    const getTokenAndUserId = async () => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            const userId = await AsyncStorage.getItem('userId');
            return {token, userId};
        } catch (error) {
            console.error('Erro ao obter o token ou userId:', error);
            return null;
        }
    };


    const fetchPreferences = useCallback(async () => {
        try{
            setLoadingPreferencesData(false);

            // Recupera o token e o userId
            const { token, userId } = await getTokenAndUserId();

            if (!userId || isNaN(userId)) {
                console.error('User ID é inválido ou não definido.');
                setLoadingPreferencesData(false);
                return;
            }

            setUserId(userId);
            setToken(token);

            const response = await fetch(`${url}/users/${userId}`);
            const data = await response.json();


            if(!response.ok){
                throw new Error(data.message);
            }

            //Atualiza os campos com os dados recebidos:
            setName(data.name || '');
            setOriginalName(data.name || '');
            setEmail(data.email || '');
            setOriginalEmail(data.email || '');
            setPhoneNumber(data.phonenumber || '');
            setOriginalPhoneNumber(data.phonenumber || '');
            setCity(data.city || '');
            setOriginalCity(data.city || '');
            setProfilePicture(data.profile_picture || null);

            setLoadingPreferencesData(false);
            
        }catch(err){
            console.error('Erro ao buscar preferências:', err);
        }
    }, []);

    useEffect(()=>{
        fetchPreferences();
    },[fetchPreferences]);

    const handleChangePreferences = async () => {
        if(name !== originalName || email !== originalEmail || phoneNumber !== originalPhoneNumber || city !== originalCity || (password && confirmPassword)){
            setLoading(true);
            const {token, userId} = await getTokenAndUserId();
            if(!token){
                Alert.alert('Sessão expirada. Faça o login novamente!');
            }
            let body = {};
            if(name !== originalName){
                body.name = name;
            }

            if(email !== originalEmail){
                body.email = email;
            }
            if(phoneNumber !== originalPhoneNumber){
                body.phone_number = phoneNumber;
            }
            if(city !== originalCity){
                body.city = city;
            }

            if(password && confirmPassword){
                body.password = password;
                body.confirm_password = confirmPassword;
            }

            try{
                const response = await fetch(`${url}/users/edit/${userId}`,{
                    method: 'PATCH',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                });

                const data = await response.json();

                if (response.ok) {
                    Alert.alert('Sucesso', data.message);
                    fetchPreferences();
                } else {
                    Alert.alert('Erro', data.message);
                }

            }catch(err){
                console.error('Erro ao atualizar o usuário:', err)
            }finally{
                setLoading(false);
            }
        }
    }

    return(
        <ScrollView style={{flex: 1 }}>
            <View style={style.container}>
                <Text style={[base.title, {marginBottom: 40}]}>Preferências</Text>
                <ProfilePicture token={token} userId={userId} />
                <View style={{marginBottom: 40, marginTop: 10}}>
                    <TouchableOpacity onPress={handleLogoutMessage}>
                        <Text style={{textDecorationLine:'underline', color: '#F5392B'}}>Sair</Text>
                    </TouchableOpacity>
                </View>
                <Input
                    name="name" 
                    value={name}
                    onChangeText={setName} 
                    autoCapitalize="none"
                    placeholder="Usuário"
                    editable={!loadingPreferencesData}
                />
                <Input
                    name="email" 
                    value={email}
                    onChangeText={setEmail} 
                    autoCapitalize="none"
                    placeholder="E-mail"
                    inputMode="email"
                    editable={!loadingPreferencesData}
                />
                <Input
                    name="phone-number" 
                    value={phoneNumber}
                    onChangeText={setPhoneNumber} 
                    autoCapitalize="none"
                    placeholder="Celular"
                    inputMode="numeric"
                    editable={!loadingPreferencesData}
                />
                <Input
                    name="city" 
                    value={city}
                    onChangeText={setCity} 
                    autoCapitalize="none"
                    placeholder="Cidade"
                    editable={!loadingPreferencesData}
                />
                <PasswordInput
                    name="password" 
                    value={password}
                    onChangeText={setPassword} 
                    placeholder="Senha"
                />
                <PasswordInput
                    name="confirm-password" 
                    value={confirmPassword}
                    onChangeText={setConfirmPassword} 
                    placeholder="Confirmar senha"
                />

                <Button buttonText='Salvar' loading={loading} loadingText="Salvando..." onPress={handleChangePreferences}/>
            </View>
        </ScrollView>
    )
}

const style = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: colors.white_default,
        alignItems: 'center',
        minHeight: height,
        paddingTop: 10,
        padding: 30,
        paddingBottom: 70
    }
})
