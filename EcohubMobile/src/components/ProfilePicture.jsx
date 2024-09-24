import { View, TouchableOpacity, Alert, Modal } from 'react-native';
import { MaterialIcons }  from '@expo/vector-icons';
import { colors } from '../css/base';

export function ProfilePicture(props){
    const handleEditProfilePicutre = () => {
        Alert.alert('Editar foto', 'Escolha sua foto')
    }
    return (
        <View style={{borderWidth: 1, width: 150, height: 150, backgroundColor: colors.gray_default, borderRadius: 100}}>
            <TouchableOpacity onPress={handleEditProfilePicutre}>
                <View>
                    <MaterialIcons name='edit' size={25} color={colors.green_default}/>
                </View>
            </TouchableOpacity>
        </View>
    )
}