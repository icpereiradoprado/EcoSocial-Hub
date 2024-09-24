import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../css/base';
import { ProfilePicture } from '../components/ProfilePicture';

const { height } = Dimensions.get('window');
export function SettingsTest(){
    const handleEditProfilePicutre = () => {
        Alert.alert('Editar foto', 'Escolha sua foto')
    }
    return(
        <ScrollView style={{flex: 1, backgroundColor: 'red'}}>
            <View style={style.container}>
                <Text>
                    Settings
                </Text>
                <ProfilePicture />
            </View>
        </ScrollView>
    )
}

const style = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: colors.white_default,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: height
    }
})
