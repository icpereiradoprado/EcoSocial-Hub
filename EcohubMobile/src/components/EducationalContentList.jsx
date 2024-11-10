/**IMPORTS NECESSÁRIOS PARA O COMPONENTE */
import { View, StyleSheet, TouchableOpacity, Image, Text, Dimensions, FlatList, Button, TextInput, ActivityIndicator} from "react-native";
import EducationalContent from "./EducationalContent";
import { base, colors } from "../css/base";
import { Mode } from "../helpers/Enums";
import { getTokenAndUserId } from "../helpers/Auth";
import { useState, useEffect } from 'react'

const { height, width } = Dimensions.get('window');

/**
 * Componente Modal para criação e edição de conteúdo educacional
 * @param {boolean} modalVisible Controla a visibilidade do modal.
 * @param {function} setModalVisible Função para controlar a visibilidade do modal.
 * @param {Mode} mode Define se o modal está em modo de criação ou edição.
 * @param {object} educationalContentToEdit Contém os dados do conteúdo a ser editado.
 * @returns Componente de Conteúdo educacional
 */
export default function EducationalContentList({educationalContents, setModalVisible, setMode, setEducationalContentToEdit, loadMoreData, hasMoreData }) {
    // Estados do componente
    const [isAdmin, setIsAdmin] = useState(null);
    const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);

    //Componente handler ppara carregar mais itens da lista
    const handleLoadMoreData = async () => {
        if(hasMoreData){
            setIsLoadingMoreData(true);
            await loadMoreData();
            setIsLoadingMoreData(false);
        }
    }
    // UseEffect para pegar as informações do usuário (se é admin ou não) assim que o componente é montado
    useEffect(()=>{
        const getUserInfo = async () => {
            const { isAdmin } = await getTokenAndUserId();
            setIsAdmin(isAdmin);
        }
        getUserInfo();
    },[]);

    // Componente de Header da página de conteúdo eduucacional
    const HomeHeader = () => (
        <View>
            <View style={[base.flexRow, {justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, width: '100%'}]}>
                <View style={[base.flexRow]}>
                    <Text style={[base.title,{paddingTop:13}]}>Eco News</Text>
                    <Image source={require('../assets/images/news.png')} style = {styles.logo} />
                </View>
                { isAdmin == '1' && 
                    <TouchableOpacity style={styles.createContent} onPress={()=> {setModalVisible(true); setMode(Mode.create)}}>
                        <TextInput 
                            style={[
                                styles.input,
                            ]}
                            placeholder="Criar publicação"
                            onFocus={() => {setModalVisible(true); setMode(Mode.create)}}                     
                        />
                    </TouchableOpacity>
                }
            </View>
        </View>
        
    );
 
    //Componente Footer da página de conteúdo eduucacional
    const HomeFooter = () => (
        <View>
            {isLoadingMoreData && (
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: 16}}>Carregando mais conteúdo...</Text>
                    <ActivityIndicator size="small" color="#000000"/>
                </View>
            )}
        </View>
    )
    /**
     * Retorna a Lista do conteúdos educacionais, caso `educationalContents` seja vazio exibe mensagem de conteúdo vazio.
     * Caso haja items retorna lista o componente `EducationalContent.jsx` 
     */
    return (
        <FlatList 
            data={educationalContents}
            ListEmptyComponent={() => <View style={{alignItems: 'center', marginTop: 40}}><Text>Não há nenhum conteúdo postado!</Text></View>}
            keyExtractor={item => item.id}
            renderItem={({item}) => <EducationalContent 
                id={item.id}
                title={item.title}
                content={item.content}
                tag={item.tag}
                create_date={item.create_date}
                username={item.username} 
                user_id={item.user_id}
                content_picture={item.content_picture}
                setModalVisible={setModalVisible}
                setMode={setMode}
                setEducationalContentToEdit={setEducationalContentToEdit}
            />}
            ListHeaderComponent={()=> <HomeHeader />}
            ListHeaderComponentStyle={styles.headerComponent}
            onEndReached={handleLoadMoreData}
            onEndReachedThreshold={0.02}
            ListFooterComponent={()=> <HomeFooter />}
            ListFooterComponentStyle={{paddingBottom: hasMoreData ? 130 : 80}}
            style={{width: width, paddingHorizontal: 10}}
        />
    )
}

/**
 * Estilização do cabeçalho da lista de comentários
 */
const styles = StyleSheet.create({
    headerComponent: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.white_default,
        paddingVertical: 10,
    },
    logo:{
        width:50,
        height:50,
    },
    div:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 10,
    },
    createContent:{
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
