import * as React from 'react';
import { View, StyleSheet, Image , Text, useWindowDimensions, ActivityIndicator } from 'react-native';
import EducationalContentList from '../components/EducationalContentList';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { getTokenAndUserId } from '../helpers/Auth';
import { getSocket } from '../helpers/socket';
import { Snackbar } from 'react-native-paper';
import EducationalContentFormModal from '../components/EducationalContentFormModal';

export function HomeScreen(){
    const { height, width } = useWindowDimensions();
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;

	const [loading, setLoading] = useState(false);
    const [educationalContentData, setEducationalContentData] = useState(null);
	const [visible, setVisible] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	
	const onDismissSnackBar = () => setVisible(false);

    const fetchEducationalContents = async () => {
		setLoading(true);
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
			setLoading(false);
        }else{
            console.error('Não foi possível carregar os conteúdos educacionais!')
        }
    }
    useEffect(()=>{
		const listenEvent = async () => {
			await fetchEducationalContents();
			const socketIo = getSocket();

			socketIo.on('educationalcontentcreate', (newContent)=>{
				setEducationalContentData((prevEducationContents) => [newContent, ...prevEducationContents]);
			});

			socketIo.on('educationalcontentdeleted', (contentId) => {
				setEducationalContentData((prevEducationContents) => {
					if (!prevEducationContents) {
						return prevEducationContents;
					}
					const contents = prevEducationContents.filter((content) => content.id != contentId);
					setVisible(true);
					return contents;
				});
			});
		}
		listenEvent();

		return () => {}
		
    }, []);

    return(
        <View style = {styles.container}>
			{!loading ? (
				<>
					<EducationalContentList educationalContents={educationalContentData} setModalVisible={setModalVisible}/>
					<EducationalContentFormModal modalVisible={modalVisible} setModalVisible={setModalVisible}/>
					<Snackbar style={{width: width - 10, position: 'absolute', bottom: 80}} visible={visible} duration={2000} onDismiss={onDismissSnackBar}>
						Conteúdo educacional deletado com sucesso!
					</Snackbar>
				</>
			) : (
				<View>
					<ActivityIndicator size="large" />
				</View>
			)}
        </View>
    )
	/* return(
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
	) */
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent:'center'
    },
    logo:{
        width:50,
        height:50,
    },
 
  });