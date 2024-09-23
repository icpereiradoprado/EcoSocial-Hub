import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native'
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';


const Stack = createStackNavigator();

const App = () => {
  return (
	<>
		<StatusBar barStyle="light-content" />
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name="LoginScreen" component={LoginScreen} />
				<Stack.Screen name="RegisterScreen" component={RegisterScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	</>
  );
};

export default App;