import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { RenderImageTest } from '../screens/RenderImageTest';
import MainTabNavigator from './MainTabNavigator';

const Stack = createStackNavigator();

export default function RootStack(){
   return(
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='LoginScreen'>
                <Stack.Screen name="MainTabNavigator" component={MainTabNavigator}/>
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                <Stack.Screen name="RenderImageTest" component={RenderImageTest}/>
            </Stack.Navigator>
        </NavigationContainer>
   ) 
}