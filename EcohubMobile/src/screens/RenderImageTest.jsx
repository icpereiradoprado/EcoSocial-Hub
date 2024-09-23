import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'
export function RenderImageTest(){
    const navigator = useNavigation();
    return(
        <View>
            <Text>
                Capturar imagem...
            </Text>
            <Button title='Voltar' onPress={()=>{navigator.goBack()}}/>
        </View>
    )
}
