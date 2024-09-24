import { View, Text, StyleSheet, Image } from 'react-native';
import { base } from '../css/base';
export function HomeTest(){
    return(
        <View style = {styles.container}>
            
            <Text style={styles.div}> 
                <Text style={base.title}>
                Eco News 
                </Text>
                <Image source={require('../assets/images/news.png')} style = {styles.logo} />

            </Text>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      padding: 30,
    },
    logo:{
        width:50,
        height:50,
    },
    div:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 30,
    }
    
  });