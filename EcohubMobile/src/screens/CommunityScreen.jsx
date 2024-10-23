import { View, StyleSheet, TouchableOpacity, Image, Text, Dimensions, FlatList, Button, TextInput} from "react-native";
import { base, colors } from "../css/base";

export function CommunityScreen(){
    return(
        <View >
         
             <View style={[base.flexRow, {justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, width: '100%'}]}>
                <View style={[base.flexRow]}>
                    <Text style={[base.title,{paddingTop:13}]}>Comunidade  </Text>
                    <Image source={require('../assets/images/community.png')} style = {styles.logo} />
                </View>
                <TouchableOpacity style={styles.criarContent} onPress={()=> {setModalVisible(true); setMode(Mode.create)}}>
                     <TextInput 
                     style={[
                        styles.input,
                      ]}
                     placeholder="Criar publicação"
                     onFocus={() => {setModalVisible(true); setMode(Mode.create)}}                     
                     /> 
                </TouchableOpacity>
            </View>
            
        </View>
    )
}
const styles = StyleSheet.create({
    
    logo:{
        marginTop:10,
        width:48,
        height:48,
    },
    criarContent:{
        paddingTop:13
    },

    input:{
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    width:'120%',
    textAlign:'center',
    
    }
});
