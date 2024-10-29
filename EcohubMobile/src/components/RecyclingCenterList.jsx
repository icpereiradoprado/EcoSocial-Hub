import { FlatList } from "react-native";

const RecyclingCenterList = () => {
    const RecyclingCenterListHeader = () => (
        <View >
             <View style={[base.flexRow, {justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, width: '100%'}]}>
                <View style={[base.flexRow]}>
                    <Text style={[base.title,{paddingTop:13}]}>Pontos de Coleta </Text>
                    <Image source={require('../assets/images/pontoColeta.png')} style = {styles.logo} />
                </View>
            </View>
        </View>
    )
    return(
        <FlatList>

        </FlatList>
    )
}

export default RecyclingCenterList;