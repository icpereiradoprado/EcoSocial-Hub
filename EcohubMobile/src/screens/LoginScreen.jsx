import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from '../components/Button';
import { ButtonLink } from '../components/ButtonLink';
import { Input } from '../components/Input';
import { Title } from '../components/Title';
import Logo from '../components/Logo';
import { useNavigation } from "@react-navigation/native";
import { PasswordInput } from '../components/PasswordInput';

/**
 * Tela de Login
 * @returns Tela de Login
 */
const LoginScreen = () => {
	const navigation = useNavigation();
	const [loading, setLoading] = useState(false);
	const [userIdentification, setUserIdentification] = useState('');
	const [password, setPassword] = useState('');

	/**
	 * Handler para executar a API de login
	 */
	const handleLogin = async () => {
		setLoading(true);
		try {
			setTimeout(()=>{
				
			},2000)
			const response = await fetch(`http://192.168.187.7:5000/users/login`, {
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