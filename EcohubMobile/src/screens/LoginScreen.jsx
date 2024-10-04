import React, { useState } from 'react';
import io from 'socket.io-client';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from '../components/Button';
import { ButtonLink } from '../components/ButtonLink';
import { Input } from '../components/Input';
import { Title } from '../components/Title';
import Logo from '../components/Logo';
import { useNavigation } from "@react-navigation/native";
import { PasswordInput } from '../components/PasswordInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { connectSocket } from '../helpers/socket';

/**
 * Tela de Login
 * @returns Tela de Login
 */
const LoginScreen = () => {
	const navigation = useNavigation();
	const [loading, setLoading] = useState(false);
	const [userIdentification, setUserIdentification] = useState('');
	const [password, setPassword] = useState('');

	const saveTokenAndUserId = async (token, userId, isAdmin) => {
		try{
			await AsyncStorage.setItem('jwtToken', token);
			await AsyncStorage.setItem('userId', userId.toString());
		}catch(err){
			console.error('Erro ao salvar token!', err);
		}
		
	}
	/**
	 * Handler para executar a API de login
	 */
	const handleLogin = async () => {
		setLoading(true);
		try {
			const url = Constants.manifest2.extra.expoClient.extra.apiUrl;
			const response = await fetch(`${url}/users/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userIdentification,
					password,
				}),
			});
		
			const data = await response.json();
		
			if (response.ok) {
				await saveTokenAndUserId(data.token, data.userId, data.isAdmin);
				connectSocket(data.token);

				resetInputs();
				navigation.navigate("MainTabNavigator");
			} else {
				resetInputs();
				Alert.alert('Erro', data.message);
			}
		}catch(error){
			console.log("Erro:", error);
		}finally{
			setLoading(false);
		}
	};

	/**
	 * Handler para navegar para a tela de cadastro
	 */
  	const handleNavigateToRegisterScreen = () => {
		navigation.navigate("RegisterScreen");
	};

	/**
	 * Handler para limpar os inputs
	 */
	const resetInputs = () => {
		setUserIdentification('');
		setPassword('');
	}

	return (
		<View style={styles.container}>
			<Logo />
			<Title />

			<Input 
				name="userIdentification" 
				value={userIdentification}
				onChangeText={setUserIdentification} 
				autoCapitalize="none"
				placeholder="Usuário ou e-mail"
			/>

			<PasswordInput 
				name="password"
				value={password}
				onChangeText={setPassword}
				placeholder="Senha"
			/>

			<Button 
				loading={loading}
				loadingText='Logando...'
				onPress={handleLogin}
				buttonText="Entrar"
			/>

			<ButtonLink linkText="Cadastrar-se" additionalText={null} onPress={handleNavigateToRegisterScreen}/>
		</View>
  	)

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
	padding: 30
  },
  
});

export default LoginScreen;
