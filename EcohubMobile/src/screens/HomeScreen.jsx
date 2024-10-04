import { View, StyleSheet } from 'react-native';
import EducationalContentList from '../components/EducationalContentList';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { getTokenAndUserId } from '../helpers/Auth';


export function HomeScreen(){
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;
    const [educationalContentData, setEducationalContentData] = useState(null);

    const fetchEducationalContents = async () => {
        const { token, userId } = await getTokenAndUserId();
        const response = await fetch(`${url}/educationalcontents`,{
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if(response.ok){
            const data = await response.json();
            setEducationalContentData(data);
        }else{
            console.error('Não foi possível carregar os conteúdos educacionais!')
        }
    }
    useEffect(()=>{
        fetchEducationalContents();
    }, []);
    return(
        <View style = {styles.container}>
            <EducationalContentList educationalContents={educationalContentData}/>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      paddingBottom: 64,
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