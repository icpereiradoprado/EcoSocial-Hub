import { View, StyleSheet, Image , Text, useWindowDimensions} from 'react-native';
import EducationalContentList from '../components/EducationalContentList';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { getTokenAndUserId } from '../helpers/Auth';
import { ScrollView } from 'react-native';
import Post from '../components/Post'; // Supondo que o componente esteja nesse arquivo
import { base } from '../css/base';

export function HomeScreen(){
    const { height, width } = useWindowDimensions();

    // const url = Constants.manifest2.extra.expoClient.extra.apiUrl;
    // const [educationalContentData, setEducationalContentData] = useState(null);

    // const fetchEducationalContents = async () => {
    //     const { token, userId } = await getTokenAndUserId();
    //     const response = await fetch(`${url}/educationalcontents`,{
    //         method: 'GET',
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": `Bearer ${token}`
    //         }
    //     });

    //     if(response.ok){
    //         const data = await response.json();
    //         setEducationalContentData(data);
    //     }else{
    //         console.error('Não foi possível carregar os conteúdos educacionais!')
    //     }
    // }
    // useEffect(()=>{
    //     fetchEducationalContents();
    // }, []);
    return(
        <ScrollView style={{ padding: 10, marginBottom:80}}>
                <View style = {[base.flexRow, styles.container]}>
                    <Image source={require('../assets/images/news.png')} style = {styles.logo} />
                    <Text style= {base.title}>
                    Eco News
                    </Text>
                </View>
        <Post
          userImage="https://via.placeholder.com/150"
          userName="Jagunço"
          postTitle="Titulo da postagem"
          date="25/09/2003"
          postDescription="Este é um post exemplo no estilo do LinkedIn."
          postImage="https://via.placeholder.com/600x400"
        />
         <Post
        userImage="https://via.placeholder.com/150"
        userName="Maria Souza"
        postTitle="Titulo da postagem"
        date="25/09/2003"
        postDescription="Aqui está uma descrição de um post sem imagem."
      />
        <Post
          userImage="https://via.placeholder.com/150"
          userName="Gervásio"
          postTitle="Titulo da postagem"
          date="29/09/2003"
          postDescription="Este é um post exemplo no estilo do LinkedIn."
          postImage="https://via.placeholder.com/600x400"
        />
       <Post
        userImage="https://via.placeholder.com/150"
        userName="Xexerio"
        postTitle="Titulo da postagem"
        date="24/09/2003"
        postDescription="Aqui está uma descrição de um post sem imagem."
      />
       <Post
        userImage="https://via.placeholder.com/150"
        userName="Pafuncio"
        postTitle="Titulo da postagem"
        date="22/08/2003"
        postDescription="Aqui está uma descrição de um post sem imagem."
      />
      </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent:'center',
      padding : 20,
    },
    logo:{
        width:50,
        height:50,
    },
 
  });