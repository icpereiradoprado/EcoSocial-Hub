import { View, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { base } from '../css/base';

export function PasswordInput(props){
    const [showPassword, setShowPassword] = useState(true);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    return(
        <View style={[base.flexRow, base.passwordInput]}>
            <TextInput {...props}
                secureTextEntry={showPassword}
                style={{width: '90%'}}
            />
            <TouchableOpacity onPress={handleShowPassword}>
                <MaterialIcons 
                    name = {showPassword ? 'visibility-off' : 'visibility'} 
                    size={20}
                />
            </TouchableOpacity>
        </View>
    )
}