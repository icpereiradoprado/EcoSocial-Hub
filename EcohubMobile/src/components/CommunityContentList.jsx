import { View, StyleSheet, TouchableOpacity, Image, Text, Dimensions, FlatList, Button, TextInput} from "react-native";
import { Entypo, AntDesign } from '@expo/vector-icons';
import CommunityContent from "./CommunityContent";
import { base, colors } from "../css/base";
import { Mode } from "../helpers/Enums";

const { height, width } = Dimensions.get('window');

export default function CommunityContentList({CommunityContents, setModalVisible, setMode }) {
    const CommunityHeader = () => (
          <View>
             <View style={[base.flexRow, {justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, width: '100%'}]}>
                <View style={[base.flexRow]}>
                    <Text style={[base.title,{paddingTop:13}]}>Comunidade  </Text>
                    <Image source={require('../assets/images/community.png')} style={styles.logo} />
                </View>
                <TouchableOpacity style={styles.criarContent} onPress={()=> {setModalVisible(true); setMode(Mode.create)}}>
                    <TextInput
                     style={[styles.input,]}
                        placeholder="Criar publicação"
                        onFocus={() => {setModalVisible(true); setMode(Mode.create)}}                     
                     /> 
                </TouchableOpacity>
            </View>
        </View>
        
    );
    return (
        <FlatList 
            data={CommunityContents}
            ListEmptyComponent={() => <View style={{alignItems: 'center', marginTop: 40}}><Text>Não há nenhum conteúdo postado!</Text></View>}
            renderItem={({item}) => <CommunityContent 
                id={item.id}
                title={item.title}
                content={item.content}
                create_date={item.create_date}
                username={item.username} 
                user_id={item.user_id}
                post_picture={item.post_picture}
                upvotes={item.upvotes}
                downvotes={item.downvotes}
                setModalVisible={setModalVisible}
                setMode={setMode}
                
            />}
            keyExtractor={item => item.id}
            ListHeaderComponent={()=> <CommunityHeader />}
            ListHeaderComponentStyle={styles.headerComponent}
            ListFooterComponent={()=> <View></View>}
            ListFooterComponentStyle={{backgroundColor: 'transparent', padding: 35}}
            style={{width: width, paddingHorizontal: 10}}
        />
    )
}

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
        marginTop:10
    },
    div:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 10,
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
