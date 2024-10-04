import { View, StyleSheet, TouchableOpacity, Image, Text, Dimensions, FlatList} from "react-native";
import { Entypo, AntDesign } from '@expo/vector-icons';
import EducationalContent from "./EducationalContent";
import { base, colors } from "../css/base";

const { height, width } = Dimensions.get('window');

export default function EducationalContentList({educationalContents }) {
    const HomeHeader = () => (
        <View style={styles.div}>
            <Text style={base.title}>Eco News</Text>
            <Image source={require('../assets/images/news.png')} style = {styles.logo} />
        </View>
    );
    return (
        <FlatList 
            data={educationalContents}
            renderItem={({item}) => <EducationalContent 
                id={item.id}
                title={item.title}
                content={item.content}
                create_date={item.create_date}
                username={item.username} 
                user_id={item.user_id}
            />}
            keyExtractor={item => item.id}
            ListHeaderComponent={()=> <HomeHeader />}
            ListHeaderComponentStyle={styles.headerComponent}
            ListFooterComponent={()=> <View></View>}
            ListFooterComponentStyle={{backgroundColor: 'transparent', padding: 35}}
            style={{width: width}}
        />
    )
}

const styles = StyleSheet.create({
    headerComponent:{
        width: width,
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.white_default,
        paddingVertical: 10 
    },
    logo:{
        width:50,
        height:50,
    },
    div:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14
    }
    
  });
