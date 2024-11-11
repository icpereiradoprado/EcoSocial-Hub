/**IMPORTS NECESSÁRIOS PARA O COMPONENTE */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
import { RecyclingCentersScreen } from '../screens/RecyclingCentersScreen';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomFabBar } from 'rn-wave-bottom-bar';
import { base, colors } from '../css/base';

// Importa a função `createBottomTabNavigator` para criar uma barra de navegação inferior.
const Tab = createBottomTabNavigator();

/**
 * Componente principal que configura a barra de navegação inferior do aplicativo.
 * @returns Retorna a barra de navegação configurada com diferentes abas.
 */
export default function MainTabNavigator() {
    return (
        // Cria um componente de navegação com abas.
        <Tab.Navigator
            // Define a rota inicial ao abrir o app.
            initialRouteName='HomeScreen'
            // Define opções padrão para todas as telas.
            screenOptions={{
                headerShown: false, // Remove o cabeçalho padrão das telas.
                tabBarActiveTintColor: colors.green_dark, // Cor do ícone e texto da aba ativa.
                tabBarActiveBackgroundColor: colors.green_dark, // Cor de fundo da aba ativa.
                backgroundColor: 'transparent', // Cor de fundo da barra de navegação.
                tabBarLabelStyle: {
                    color: colors.black_default, // Cor do texto da label.
                    fontSize: 13 // Tamanho da fonte da label.
                }
            }}
            // Define um componente customizado para a barra de navegação.
            tabBar={(props) => {
                return (
                    // Componente `BottomFabBar` que customiza a barra inferior.
                    <BottomFabBar
                        mode='default' // Modo padrão de exibição.
                        isRtl={false} // Define se a orientação é da direita para a esquerda (não é).
                        // Estilização do botão que está em foco.
                        focusedButtonStyle={{
                            shadowColor: colors.black_default, // Cor da sombra do botão.
                            shadowOffset: {
                                width: 0, // Deslocamento horizontal da sombra.
                                height: 7, // Deslocamento vertical da sombra.
                                backgroundColor: 'transparent' // Cor de fundo do botão.
                            },
                            shadowOpacity: 0.41, // Opacidade da sombra.
                            shadowRadius: 9.11, // Raio de desfoque da sombra.
                            elevation: 14 // Altura da sombra em dispositivos Android.
                        }}
                        // Estilização do container da barra inferior.
                        bottomBarContainerStyle={{
                            position: 'absolute', // Posiciona a barra de forma absoluta na tela.
                            bottom: 0, // Alinha a barra ao fundo da tela.
                            left: 0, // Alinha a barra à esquerda.
                            right: 0, // Alinha a barra à direita.
                            backgroundColor: 'transparent' // Cor de fundo do container.
                        }}
                        {...props} // Passa todas as propriedades adicionais recebidas.
                    />
                );
            }}
        >
            {/* Define uma aba para a tela inicial */}
            <Tab.Screen
                name='HomeScreen' // Nome da rota.
                component={HomeScreen} // Componente a ser renderizado.
                options={{
                    tabBarIcon: () => <MaterialIcons name='home' size={25} color={colors.black_default} />, // Ícone da aba.
                    tabBarLabel: '' // Esconde a label da aba.
                }}
            />
            {/* Define uma aba para a tela da comunidade */}
            <Tab.Screen
                name='CommunityScreen'
                component={CommunityScreen}
                options={{
                    tabBarIcon: () => <MaterialIcons name='people-alt' size={25} color={colors.black_default} />,
                    tabBarLabel: '' // Esconde a label da aba.
                }}
            />
            {/* Define uma aba para a tela dos centros de reciclagem */}
            <Tab.Screen
                name='RecyclingCentersScreen'
                component={RecyclingCentersScreen}
                options={{
                    tabBarIcon: () => <MaterialCommunityIcons name='recycle' size={25} color={colors.black_default} />,
                    tabBarLabel: '' // Esconde a label da aba.
                }}
            />
            {/* Define uma aba para a tela de configurações */}
            <Tab.Screen
                name='SettingsScreen'
                component={SettingsScreen}
                options={{
                    tabBarIcon: () => <MaterialIcons name='settings' size={25} color={colors.black_default} />,
                    tabBarLabel: '' // Esconde a label da aba.
                }}
            />
        </Tab.Navigator>
    );
}
