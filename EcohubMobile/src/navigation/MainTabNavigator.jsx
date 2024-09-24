import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeTest } from '../screens/HomeScreen';
import { SettingsTest } from '../screens/SettingsScreen';
import { CommunityTest } from '../screens/CommunityScreen';
import { PlacesTest } from '../screens/PlacesScreen';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomFabBar } from 'rn-wave-bottom-bar';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator(){
    return(
        <Tab.Navigator
            initialRouteName='HomeTest'
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: 'green',
                tabBarActiveBackgroundColor: 'gray',
                tabBarLabelStyle: {
                    color: 'white',
                    fontSize: 13
                }

            }}
            tabBar={(props) => {
                return(
                <BottomFabBar
                    mode='default'
                    isRtl={false}
                    focusedButtonStyle={{
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 7,
                        },
                        shadowOpacity: 0.41,
                        shadowRadius: 9.11,
                        elevation: 14,
                    }}
                    bottomBarContainerStyle={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}
                    {...props}
                />
                );
            }}
        >
            <Tab.Screen 
                name='HomeTest'
                component={HomeTest}
                options={{
                    tabBarIcon: () => <MaterialIcons name='home' size={25} color='black'/>,
                    tabBarLabel: 'Home'
                }}
            />
            <Tab.Screen 
                name='CommunityTest'
                component={CommunityTest}
                options={{
                    tabBarIcon: () => <MaterialIcons name='people-alt' size={25} color='black'/>,
                    tabBarLabel: 'Comunidade'
                }}
            />
            <Tab.Screen 
                name='PlacesTest'
                component={PlacesTest}
                options={{
                    tabBarIcon: () => <MaterialIcons name='location-on' size={25} color='black'/>,
                    tabBarLabel: 'Descartes'
                }}
            />
            <Tab.Screen 
                name='SettingsTest'
                component={SettingsTest}
                options={{
                    tabBarIcon: () => <MaterialIcons name='settings' size={25} color='black'/>,
                    tabBarLabel: 'Configurações'
                }}
            />
        </Tab.Navigator>
    );
}