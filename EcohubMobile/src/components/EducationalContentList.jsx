import { View, StyleSheet, TouchableOpacity, Image, Text, Dimensions, FlatList, Button} from "react-native";
import { Entypo, AntDesign } from '@expo/vector-icons';
import EducationalContent from "./EducationalContent";
import { base, colors } from "../css/base";
import { Mode } from "../helpers/Enums";

const { height, width } = Dimensions.get('window');

export default function EducationalContentList({educationalContents, setModalVisible, setMode }) {
    const HomeHeader = () => (
        <View >
          
        </View>
        
    );
    return (
        <View style={styles.container}>
        {/* Sticky header at the top */}
        <View style={[styles.div, {flexDirection: 'column'}]}>
          <View style={[styles.stickyView]}>
            <Text> </Text>
                <Text style={[base.title,{paddingTop:13}]}>Eco News</Text>
                <Image source={require('../assets/images/news.png')} style = {styles.logo} />
                <Text style={base.title}>                          </Text>
                <TouchableOpacity style={styles.criarContent}  onPress={()=> {setModalVisible(true); setMode(Mode.create)}}>
                    <Image
                    source={require('../assets/images/criar.png')}// URL ou caminho local da imagem
                    style={styles.logoBtn}
                    />
                    <Text>+</Text>
                </TouchableOpacity>
               
            </View>
            
        </View>
        <FlatList 
            data={educationalContents}
            ListEmptyComponent={() => <View style={{alignItems: 'center', marginTop: 40}}><Text>Não há nenhum conteúdo postado!</Text></View>}
            renderItem={({item}) => <EducationalContent 
                id={item.id}
                title={item.title}
                content={item.content}
                create_date={item.create_date}
                username={item.username} 
                user_id={item.user_id}
                content_picture={item.content_picture}
                setModalVisible={setModalVisible}
                setMode={setMode}
            />}
            keyExtractor={item => item.id}
            ListHeaderComponent={()=> <HomeHeader />}
            ListHeaderComponentStyle={styles.headerComponent}
            ListFooterComponent={()=> <View></View>}
            ListFooterComponentStyle={{backgroundColor: 'transparent', padding: 35}}
            style={{width: width, paddingHorizontal: 10}}
        />
         </View>
    )
}

const styles = StyleSheet.create({
    headerComponent:{
        width: width,
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.white_default,
        paddingVertical: 20 
    },
    stickyView: {
        position: 'absolute', // Para manter a barra fixa no topo
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: colors.white_default,
        flexDirection: 'row', // Alinha os filhos em uma linha
        justifyContent: 'space-between', // Distribui os itens ao longo da linha
        alignItems: 'center', // Alinha verticalmente os itens no centro
        paddingHorizontal: 10, // Adiciona um espaçamento horizontal nas bordas
        zIndex: 10, // Garante que a barra fique acima do conteúdo
    },
    logo:{
        width:50,
        height:50,
    },
    div:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 10
    },
    logoBtn: {
        width: 30,
        height: 30,
        
    },
    criarContent:{
        flexDirection: 'row',

    }
   
  });
