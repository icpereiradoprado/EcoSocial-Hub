import { View, Text, StyleSheet, Image, useWindowDimensions, ScrollView } from 'react-native';
import { base, colors } from '../css/base';
import EducationalContent from '../components/EducationalContent';

const DATA = [
    {
        id: 1,
        title: "teste",
        content: "lorem ipsum dolor aset!",
        content_picture: null,
        tag: "first;second;third",
        create_date: null,
        update_date: null
    },
    {
        id: 2,
        title: "Lorem ipsum",
        content: "lorem ipsum dolor aset teste descript!",
        content_picture: null,
        tag: "first;second",
        create_date: null,
        update_date: null
    },
    {
        id: 3,
        title: "Lorem ipsum",
        content: "lorem ipsum dolor aset teste descript!",
        content_picture: null,
        tag: "first;second",
        create_date: null,
        update_date: null
    }
]
export function HomeScreen(){
    const { width, height } = useWindowDimensions();
    return(
        <View style = {styles.container}>
            <EducationalContent educationalContents={DATA}/>
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