import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from '../components/Button';
import { ButtonLink } from '../components/ButtonLink';
import { Input } from '../components/Input';
import { Title } from '../components/Title';
import Logo from '../components/Logo';
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
	const navigation = useNavigation();
	const [userIdentification, setUserIdentification] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = async () => {
		try {
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
				Alert.alert('Sucesso', data.message);
			} else {
				Alert.alert('Erro', data.message);
			}
		} catch (error) {
			console.log("Erro:", error);
		}
	};

  	const handleNavigateToRegisterScreen = () => {
		navigation.navigate("RegisterScreen");
	};

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

			<Input 
				name="password"
				value={password}
				onChangeText={setPassword} 
				secureTextEntry
				placeholder="Senha"
			/>

			<Button 
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
    backgroundColor: '#f0f0f0', // Cor de fundo da tela Home
	padding: 30
  },
  
});

export default LoginScreen;
