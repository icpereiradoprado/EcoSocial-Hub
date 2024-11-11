// Importações de bibliotecas e componentes necessários.
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native"; 
import io from 'socket.io-client'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import Constants from 'expo-constants';
import { Button } from '../components/Button';
import { ButtonLink } from '../components/ButtonLink';
import { Input } from '../components/Input';
import { Title } from '../components/Title';
import Logo from '../components/Logo';
import { PasswordInput } from '../components/PasswordInput';
import { connectSocket } from '../helpers/socket'; 

/**
 * Tela de Login principal
 * @returns Componente de tela de login
 */
const LoginScreen = () => {
    // Objeto de navegação para transições entre telas.
	const navigation = useNavigation();
    // Estados para gerenciar o carregamento e os inputs do usuário.
	const [loading, setLoading] = useState(false);
	const [userIdentification, setUserIdentification] = useState(''); // Estado para usuário ou e-mail.
	const [password, setPassword] = useState(''); // Estado para senha.

    /**
     * Função para salvar o token JWT, ID do usuário e status de administrador no armazenamento local.
     * @param {string} token - Token JWT de autenticação.
     * @param {number} userId - ID do usuário autenticado.
     * @param {boolean} isAdmin - Status se o usuário é administrador.
     */
	const saveTokenAndUserId = async (token, userId, isAdmin) => {
		try {
			await AsyncStorage.setItem('jwtToken', token); // Salva o token.
			await AsyncStorage.setItem('userId', userId.toString()); // Salva o ID do usuário.
			await AsyncStorage.setItem('isAdmin', isAdmin.toString()); // Salva o status de administrador.
		} catch (err) {
			console.error('Erro ao salvar token!', err); // Loga erro em caso de falha.
		}
	};

    /**
     * Função para lidar com o processo de login.
     */
	const handleLogin = async () => {
		setLoading(true); // Define o estado de carregamento como verdadeiro.
		try {
			// URL base da API a partir das constantes do ambiente Expo.
			const url = Constants.manifest2.extra.expoClient.extra.apiUrl;
			const response = await fetch(`${url}/users/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userIdentification, // Dados do usuário.
					password, // Senha.
				}),
			});
		
			const data = await response.json(); // Converte a resposta em JSON.

			if (response.ok) {
				await saveTokenAndUserId(data.token, data.userId, data.isAdmin); // Salva o token e informações.
				connectSocket(data.token); // Conecta o socket com o token.

				resetInputs(); // Limpa os inputs.
				navigation.navigate("MainTabNavigator"); // Navega para a tela principal.
			} else {
				resetInputs(); // Limpa os inputs.
				Alert.alert('Erro', data.message); // Exibe um alerta com a mensagem de erro.
			}
		} catch (error) {
			console.log("Erro:", error); // Loga erro em caso de falha.
		} finally {
			setLoading(false); // Define o estado de carregamento como falso.
		}
	};

    /**
     * Função para navegar para a tela de cadastro.
     */
  	const handleNavigateToRegisterScreen = () => {
		navigation.navigate("RegisterScreen"); // Redireciona para a tela de cadastro.
	};

    /**
     * Função para limpar os campos de input.
     */
	const resetInputs = () => {
		setUserIdentification(''); // Limpa o campo de identificação do usuário.
		setPassword(''); // Limpa o campo de senha.
	};

	return (
		<View style={styles.container}>
			<Logo /> {/* Componente de logo */}
			<Title /> {/* Componente de título */}

			{/* Formulário de login */}
			<View style={{ width: '100%' }}>
				<Input
					name="userIdentification"
					value={userIdentification}
					onChangeText={setUserIdentification} // Atualiza o estado conforme o usuário digita.
					autoCapitalize="none"
					placeholder="Usuário ou e-mail"
				/>
				<PasswordInput
					name="password"
					value={password}
					onChangeText={setPassword} // Atualiza o estado conforme o usuário digita.
					placeholder="Senha"
				/>
			</View>

			{/* Botão de login */}
			<Button 
				loading={loading}
				loadingText='Logando...'
				onPress={handleLogin}
				buttonText="Entrar"
			/>

			{/* Botão de link para cadastro */}
			<ButtonLink linkText="Cadastrar-se" additionalText={null} onPress={handleNavigateToRegisterScreen} />
		</View>
	);
};

// Estilização do componente.
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f0f0f0',
		padding: 30,
	},
});

export default LoginScreen; // Exporta o componente como padrão.
