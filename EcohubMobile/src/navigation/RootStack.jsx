import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainTabNavigator from './MainTabNavigator';

const Stack = createStackNavigator();

/**
 * Componente de naveção
 * @returns Componente de naveção
 */
export default function RootStack(){
   return(
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='LoginScreen'> 
                <Stack.Screen name="MainTabNavigator" component={MainTabNavigator}/>
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            </Stack.Navigator>
        </NavigationContainer>
   ) 
}
//alterado initialRouteName de loginscreen para maintab, assim n preciso do banco de dados para ver as views
