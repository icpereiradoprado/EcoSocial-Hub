import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Logo from '../components/Logo';
import { Title } from '../components/Title';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ButtonLink } from '../components/ButtonLink';
import { PasswordInput } from '../components/PasswordInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { TextInputMask } from 'react-native-masked-text';
import { base } from '../css/base';

/**
 * Tela de cadastro de Usuário
 * @returns Tela de cadastro de Usuário
 */
export default function RegisterScreen(){
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [city, setCity] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
    
    const saveTokenAndUserId = async (token, userId) => {
		try{
			await AsyncStorage.setItem('jwtToken', token);
			await AsyncStorage.setItem('userId', userId.toString());
		}catch(err){
			console.error('Erro ao salvar token!', err);
		}
		
	}
	/**
	 * Handler para executar a API de cadastro de um novo usuário
	 */
    const handleRegister = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                phone_number : phoneNumber,
                city,
                password,
                confirm_password : confirmPassword
            }),
            });
        
            const data = await response.json();
        
            if (response.ok) {
                await saveTokenAndUserId(data.token, data.userId);
                resetInputs();
                navigation.navigate('MainTabNavigator')
            } else {
                resetInputs();
                Alert.alert('Erro', data.message);
            }
        }catch (error) {
            console.log("Erro:", error);
        }finally{
            setLoading(false);
        }
    
    }

    /**
     * Método para limpar os inputs
     */
    const resetInputs = () =>{
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setCity('');
        setPhoneNumber('');
    }

	/**
	 * Handler para voltar à tela anterior
	 */
    const handleGoBack = ()=>{
        navigation.goBack();
    }
    return (
        <ScrollView style={styles.scrollView}>

            <View style={styles.container}>
                <Logo />
                < Title />
                <View style={{width: '100%'}}>
                    <Input
                        name="name"
                        style={styles.input}
                        value={name}
                        placeholder="Usuário"
                        onChangeText={setName}
                        autoCapitalize="none"
                    />
                    <Input
                        name="email"
                        style={styles.input}
                        value={email}
                        placeholder="E-mail"
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        inputMode='email'
                    />
                    <TextInputMask
                        type={'custom'}
                        name='phone_number'
                        options={{mask: '(99) 99999-9999'}}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder='Celular'
                        style={base.input}
                        inputMode='numeric'
                    />
                    <Input
                        name="city"
                        style={styles.input}
                        value={city}
                        placeholder="Cidade"
                        onChangeText={setCity}
                        autoCapitalize="none"
                    />
                    <PasswordInput
                        name="password"
                        style={styles.input}
                        placeholder="Senha"
                        value={password}
                        onChangeText={setPassword}
                    />
                    <PasswordInput
                        name="confirm_password"
                        style={styles.input}
                        placeholder="Confirmar senha"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>

                <Button onPress={handleRegister} loading={loading} loadingText='Cadastrando...' buttonText='Cadastrar'/>

                <ButtonLink onPress={handleGoBack} linkText="Clique aqui" additionalText="Já possui uma conta?"/>
          </View>
      </ScrollView>
    );
  };
  
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 30,
        paddingTop: 50,
        paddingBottom: 10, 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0', // Cor de fundo da tela Home
    },
    scrollView:{
        flex: 1
    }
});