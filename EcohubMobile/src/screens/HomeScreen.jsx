import { View, Text } from 'react-native';
import { colors } from '../css/base';
export function HomeTest(){
    return(
        <View style={{backgroundColor: colors.white_default, flex: 1}}>
            <Text>
                HOME
            </Text>
        </View>
    )
}
