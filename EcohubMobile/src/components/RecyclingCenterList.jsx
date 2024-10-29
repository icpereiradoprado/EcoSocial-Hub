import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { FlatList } from "react-native";
import { base } from "../css/base";
import RecyclingCenter from "./RecyclingCenter";
import { Mode } from "../helpers/Enums";
import { useState, useEffect } from 'react';
import { colors } from "../css/base";
import { getTokenAndUserId } from "../helpers/Auth";

const { height, width } = Dimensions.get('window');

const RecyclingCenterList = ({recyclingCenterData, setModalVisible, setMode, setRecyclingCenterToEdit}) => {
    const [isAdmin, setIsAdmin ] = useState(null);

    useEffect(()=> {
        const getUserInfo = async () => {
            const { isAdmin } = await getTokenAndUserId();
            setIsAdmin(isAdmin);
        }
        getUserInfo();
    }, []);

    const RecyclingCenterListHeader = () => (
        <View>
            <View style={[base.flexRow, {gap: 12, alignItems: 'center', paddingHorizontal: 24, justifyContent: "space-between", width: '100%'}]}>
                <View style={[base.flexRow]}>
                    <Text style={[base.title]}>Pontos de Coleta</Text>
                    <Image source={require('../assets/images/pontoColeta.png')} style = {styles.logo} />
                </View>
                {isAdmin == '1' &&
                    <TouchableOpacity style={styles.createContent} onPress={()=> {setModalVisible(true); setMode(Mode.create)}}>
                            <Text style={styles.input}>Novo local</Text>
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
    return(
        <FlatList 
            data={recyclingCenterData}
            renderItem ={({item}) => <RecyclingCenter 
                id={item.id}
                name={item.name}
                street={item.street} 
                complement={item.complement} 
                number={item.number} 
                openingHour={item.opening_hour} 
                city={item.city}
                phoneNumber={item.phone_number}
                postalCode={item.postal_code}
                state={item.state}
                setModalVisible={setModalVisible}
                setMode={setMode}
                setRecyclingCenterToEdit={setRecyclingCenterToEdit}
            />}
            keyExtractor={item => item.id}
            ListHeaderComponent={()=> <RecyclingCenterListHeader />}
            ListHeaderComponentStyle={styles.headerComponent}
            ListFooterComponent={()=> <View></View>}
            ListFooterComponentStyle={{backgroundColor: 'transparent', padding: 37}}
            style={{width: width, paddingHorizontal: 10}}
        />
    )
}

export default RecyclingCenterList;

const styles = StyleSheet.create({
    logo:{
        width:45,
        height:45,
    },
    createContent:{
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 6
    },
    input:{
        color: 'gray'
    },
    headerComponent: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.white_default,
        paddingVertical: 10,
    }
});