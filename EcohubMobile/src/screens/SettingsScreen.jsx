// Importa os componentes e módulos necessários do React Native e outras bibliotecas externas
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { base, colors } from '../css/base';
import { ProfilePicture } from '../components/ProfilePicture';
import { Input } from '../components/Input';
import { useCallback, useEffect, useState, useContext } from 'react';
import { PasswordInput } from '../components/PasswordInput';
import { Button } from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import Loading from '../components/Loading';
import { getSocket } from '../helpers/socket';
import { TextInputMask } from 'react-native-masked-text';
import { SettingsContext } from '../context/SettingsContext';

// Obtém a altura da janela do dispositivo
const { height } = Dimensions.get('window');

/**
 * Tela de Configurações do usuário
 * @returns Tela de Configurações do usuário
 */
export function SettingsScreen() {
    // Configurações iniciais e hooks de estado
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;
    const navigator = useNavigation();
    const [scrollEnabled, setScrollEnabled] = useState(true);
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

    // Contexto para atualizar a cidade do usuário no contexto de configurações
    const { setUserCity } = useContext(SettingsContext);

    /**
     * Exibe uma mensagem de confirmação de Logout
     */
    const handleLogoutMessage = () => {
        Alert.alert('Logout', 'Deseja sair?', [
            {
                text: 'Não',
                style: 'cancel'
            },
            {
                text: 'Sim',
                onPress: handleLogout
            }
        ]);
    };

    /**
     * Realiza o logout do usuário e limpa o token armazenado
     */
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('jwtToken');
            const socket = getSocket();
            console.log('disconnect', socket.id);
            socket.disconnect();
            
            // Navega para a tela de login após o logout
            navigator.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }]
            });
        } catch (err) {
            console.error('Erro ao fazer logout:', err);
        }
    };

    /**
     * Recupera o token e o userId do armazenamento assíncrono
     * @returns `{token, userId}`
     */
    const getTokenAndUserId = async () => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            const userId = await AsyncStorage.getItem('userId');
            return { token, userId };
        } catch (error) {
            console.error('Erro ao obter o token ou userId:', error);
            return null;
        }
    };

    /**
     * Obtém as preferências do usuário através da API e atualiza o estado
     */
    const fetchPreferences = useCallback(async () => {
        try {
            setLoadingPreferencesData(true);

            // Recupera o token e o userId do armazenamento
            const { token, userId } = await getTokenAndUserId();

            if (!userId || isNaN(userId)) {
                console.error('User ID é inválido ou não definido.');
                setLoadingPreferencesData(false);
                return;
            }

            setUserId(userId);
            setToken(token);

            // Realiza a requisição para obter os dados do usuário
            const response = await fetch(`${url}/users/${userId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            // Atualiza o estado com os dados do usuário
            setName(data.name || '');
            setOriginalName(data.name || '');
            setEmail(data.email || '');
            setOriginalEmail(data.email || '');
            setPhoneNumber(data.phonenumber || '');
            setOriginalPhoneNumber(data.phonenumber || '');
            setCity(data.city || '');
            setOriginalCity(data.city || '');
            setProfilePicture(data.profile_picture);
            
            setLoadingPreferencesData(false);
        } catch (err) {
            console.error('Erro ao buscar preferências:', err);
        }
    }, []);

    // Chama `fetchPreferences` ao montar o componente
    useEffect(() => {
        fetchPreferences();
    }, [fetchPreferences]);

    // Controla o scroll da tela com base no estado de carregamento das preferências
    useEffect(() => {
        setScrollEnabled(!loadingPreferencesData);
    }, [loadingPreferencesData]);

    /**
     * Handler para alteração dos dados do usuário
     */
    const handleChangeUserData = async () => {
        // Verifica se houve alterações nos dados para envio
        if (name !== originalName || email !== originalEmail || phoneNumber !== originalPhoneNumber || city !== originalCity || (password && confirmPassword)) {
            setLoading(true);
            const { token, userId } = await getTokenAndUserId();
            if (!token) {
                Alert.alert('Sessão expirada. Faça o login novamente!');
                return;
            }

            // Prepara o corpo da requisição com as informações alteradas
            let body = {};
            if (name !== originalName) body.name = name;
            if (email !== originalEmail) body.email = email;
            if (phoneNumber !== originalPhoneNumber) body.phone_number = phoneNumber;
            if (city !== originalCity) body.city = city;
            if (password && confirmPassword) {
                body.password = password;
                body.confirm_password = confirmPassword;
            }

            try {
                // Envia a requisição para atualizar os dados do usuário
                const response = await fetch(`${url}/users/edit/${userId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                });

                const data = await response.json();

                // Exibe mensagem de sucesso ou erro com base na resposta da API
                if (response.ok) {
                    Alert.alert('Sucesso', data.message);
                    setUserCity(city); // Atualiza a cidade no contexto de configurações
                    fetchPreferences();
                    setPassword('');
                    setConfirmPassword('');
                } else {
                    Alert.alert('Erro', data.message);
                }

            } catch (err) {
                console.error('Erro ao atualizar o usuário:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <ScrollView style={{ flex: 1 }} scrollEnabled={scrollEnabled}>
            {/* Exibe o componente de loading enquanto os dados estão sendo carregados */}
            <Loading isLoading={loadingPreferencesData} loadingText='Carregando dados do usuário...' />
            <View style={style.container}>
                <Text style={[base.title, { marginBottom: 40 }]}>Preferências</Text>
                {/* Componente de foto de perfil do usuário */}
                <ProfilePicture token={token} userId={userId} imageUri={profilePicture} name={name} setImageUri={setProfilePicture} setScrollEnabled={setScrollEnabled} />
                
                <View style={{ marginBottom: 40, marginTop: 10 }}>
                    {/* Botão para logout */}
                    <TouchableOpacity onPress={handleLogoutMessage}>
                        <Text style={{ textDecorationLine: 'underline', color: '#F5392B' }}>Sair</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={{ width: '100%' }}>
                    {/* Inputs para os dados do usuário */}
                    <Input name="name" value={name} onChangeText={setName} autoCapitalize="none" placeholder="Usuário" editable={!loadingPreferencesData} />
                    <Input name="email" value={email} onChangeText={setEmail} autoCapitalize="none" placeholder="E-mail" inputMode="email" editable={!loadingPreferencesData} />
                    <TextInputMask type={'custom'} name='phone_number' options={{ mask: '(99) 99999-9999' }} value={phoneNumber} onChangeText={setPhoneNumber} placeholder='Celular' style={base.input} inputMode='numeric' editable={!loadingPreferencesData} />
                    <Input name="city" value={city} onChangeText={setCity} autoCapitalize="none" placeholder="Cidade" editable={!loadingPreferencesData} />
                    <PasswordInput name="password" value={password} onChangeText={setPassword} placeholder="Senha" />
                    <PasswordInput name="confirm-password" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirmar senha" />
                </View>

                {/* Botão para salvar as alterações */}
                <Button buttonText='Salvar' loading={loading} loadingText="Salvando..." onPress={handleChangeUserData} />
            </View>
        </ScrollView>
    );
}

// Estilos para a tela de configurações
const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white_default,
        alignItems: 'center',
        minHeight: height,
        paddingTop: 10,
        padding: 30,
        paddingBottom: 70
    }
});
