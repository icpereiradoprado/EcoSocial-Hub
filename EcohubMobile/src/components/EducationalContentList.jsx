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
        /* flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 30, */
    }
    
  });
