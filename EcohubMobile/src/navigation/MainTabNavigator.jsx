import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
import { RecyclingCentersScreen } from '../screens/RecyclingCentersScreen';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomFabBar } from 'rn-wave-bottom-bar';
import { base, colors } from '../css/base';

const Tab = createBottomTabNavigator();

/**
 * Coponente Barra de navagação
 * @returns Coponente Barra de navagação
 */
export default function MainTabNavigator(){
    return(
        <Tab.Navigator
            initialRouteName='HomeScreen'
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.green_dark,
                tabBarActiveBackgroundColor: colors.green_dark,
                backgroundColor: 'transparent',
                tabBarLabelStyle: {
                    color: colors.black_default,
                    fontSize: 13
                }

            }}
            tabBar={(props) => {
                return(
                <BottomFabBar
                    mode='default'
                    isRtl={false}
                    focusedButtonStyle={{
                        shadowColor: colors.black_default,
                        shadowOffset: {
                            width: 0,
                            height: 7,
                            backgroundColor: 'transparent'
                            
                        },
                        shadowOpacity: 0.41,
                        shadowRadius: 9.11,
                        elevation: 14
                    }}
                    bottomBarContainerStyle={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'transparent'
                        
                    }}
                    {...props}
                />
                );
            }}
        >
            <Tab.Screen 
                name='HomeScreen'
                component={HomeScreen}
                options={{
                    tabBarIcon: () => <MaterialIcons name='home' size={25} color={colors.black_default}/>,
                    tabBarLabel: ''
                }}
            />
            <Tab.Screen 
                name='CommunityScreen'
                component={CommunityScreen}
                options={{
                    tabBarIcon: () => <MaterialIcons name='people-alt' size={25} color={colors.black_default}/>,
                    tabBarLabel: ''
                }}
            />
            <Tab.Screen 
                name='RecyclingCentersScreen'
                component={RecyclingCentersScreen}
                options={{
                    tabBarIcon: () => <MaterialCommunityIcons name='recycle' size={25} color={colors.black_default}/>,
                    tabBarLabel: ''
                }}
            />
            <Tab.Screen 
                name='SettingsScreen'
                component={SettingsScreen}
                options={{
                    tabBarIcon: () => <MaterialIcons name='settings' size={25} color={colors.black_default}/>,
                    tabBarLabel: ''
                   
                }}
            />
        </Tab.Navigator>
    );
}