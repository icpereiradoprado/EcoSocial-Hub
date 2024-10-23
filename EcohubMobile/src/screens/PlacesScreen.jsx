import { View, StyleSheet, TouchableOpacity, Image, Text, Dimensions, FlatList, Button, TextInput} from "react-native";
import { base, colors } from "../css/base";

export function PlacesScreen(){
    return(
        <View >
             <View style={[base.flexRow, {justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, width: '100%'}]}>
                <View style={[base.flexRow]}>
                    <Text style={[base.title,{paddingTop:13}]}>Pontos de Coleta </Text>
                    <Image source={require('../assets/images/pontoColeta.png')} style = {styles.logo} />
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    
    logo:{
        marginTop:15,
        width:45,
        height:45,
    },
    input:{
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    width:'120%',
    textAlign:'center',
    
    }
});
