/**IMPORTS NECESSÁRIOS PARA O COMPONENTE */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainTabNavigator from './MainTabNavigator';
import { SettingsProvider } from '../context/SettingsContext';

// Importa a função `createStackNavigator` para criar uma pilha de navegação.
const Stack = createStackNavigator();

/**
 * Componente de navegação principal do aplicativo.
 * @returns Componente de navegação que contém as rotas empilhadas.
 */
export default function RootStack() {
    return (
        // Envolve a navegação com o `SettingsProvider` para fornecer o contexto de configurações às telas.
        <SettingsProvider>
            {/* Componente que gerencia a navegação do aplicativo. */}
            <NavigationContainer>
                {/* Criação do `Stack.Navigator` para gerenciar a navegação entre as telas em forma de pilha. */}
                <Stack.Navigator
                    // Configurações padrão para todas as telas dentro do Stack.
                    screenOptions={{ headerShown: false }} // Oculta o cabeçalho padrão das telas.
                    initialRouteName='LoginScreen' // Define a tela inicial da pilha de navegação.
                >
                    {/* Define uma tela para a navegação de abas principal */}
                    <Stack.Screen 
                        name="MainTabNavigator" // Nome da rota.
                        component={MainTabNavigator} // Componente associado à rota.
                    />
                    {/* Define uma tela para o login */}
                    <Stack.Screen 
                        name="LoginScreen" // Nome da rota.
                        component={LoginScreen} // Componente associado à rota.
                    />
                    {/* Define uma tela para o registro */}
                    <Stack.Screen 
                        name="RegisterScreen" // Nome da rota.
                        component={RegisterScreen} // Componente associado à rota.
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </SettingsProvider>
    );
}
