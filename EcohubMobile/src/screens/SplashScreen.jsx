import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Componente de Tela Splash
const Splash = () => {
    // Hook de navegação para redirecionar para outras telas
    const navigation = useNavigation();

    useEffect(() => {
        // Define um temporizador de 3 segundos para redirecionar para a tela de login
        setTimeout(() => {
            navigation.replace('LoginScreen'); // Redireciona para a tela de LoginScreen
        }, 3000);
    }, []);

    return (
        // Estrutura visual da tela Splash com o logotipo centralizado
        <View style={styles.container}>
            <Image source={require('../images/logo.png')} style={styles.logo} />
        </View>
    );
};
// Estilos para a tela Splash
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // Centraliza o conteúdo verticalmente
        alignItems: 'center', // Centraliza o conteúdo horizontalmente
        backgroundColor: '#fff', // Define o fundo da tela como branco
    },
    logo: {
        width: 200, // Largura do logotipo
        height: 200, // Altura do logotipo
    },
    text: {
        fontSize: 23, // Tamanho da fonte do texto
    }
});
export default Splash;
