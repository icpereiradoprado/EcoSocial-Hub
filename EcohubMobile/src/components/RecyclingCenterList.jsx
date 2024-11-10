/**IMPORTS NECESSÁRIOS PARA O COMPONENTE */
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { FlatList } from "react-native";
import { base } from "../css/base";
import RecyclingCenter from "./RecyclingCenter";
import { Mode } from "../helpers/Enums";
import { useState, useEffect } from 'react';
import { colors } from "../css/base";
import { getTokenAndUserId } from "../helpers/Auth";
import { Button } from "./Button";

const { width } = Dimensions.get('window');

/**
 * Componente que exibe a lista de pontos de coleta de reciclagem.
 * @param {Array} recyclingCenterData - Dados dos pontos de coleta para exibição.
 * @param {Function} setModalVisible - Função para exibir ou ocultar o modal de criação/edição de ponto de coleta.
 * @param {Function} setMode - Função para definir o modo do formulário (criação ou edição).
 * @param {Function} setRecyclingCenterToEdit - Função para definir o ponto de coleta a ser editado.
 * @returns {JSX.Element} Lista de pontos de coleta ou mensagem caso não haja pontos cadastrados.
 */
const RecyclingCenterList = ({recyclingCenterData, setModalVisible, setMode, setRecyclingCenterToEdit}) => {
    // Estados do componete
    const [isAdmin, setIsAdmin ] = useState(null);

    // Hook useEffect que verifica se o usuário é admin
    useEffect(()=> {
        const getUserInfo = async () => {
            const { isAdmin } = await getTokenAndUserId();
            setIsAdmin(isAdmin);
        }
        getUserInfo();
    }, []);

    // Cabeçalho da lista de pontos de coleta
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

    // Componente a ser exibido quando não houver pontos de coleta
    const RecyclingCenterEmptyList = () => (
        <View style={{alignItems: 'center', marginTop: 40}}>
            <Text>Não há nenhum ponto de coleta cadastrado na sua cidade!</Text>
        </View>
    )
    return(
        /**
         * Lista de pontos de coleta ou mensagem caso não haja pontos cadastrados.
         */
        <FlatList 
            data={recyclingCenterData}
            ListEmptyComponent={() => <RecyclingCenterEmptyList />}
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

//Exporta o componente com o nome default
export default RecyclingCenterList;

/**
 * Estilização do cabeçalho da lista de comentários
 */
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