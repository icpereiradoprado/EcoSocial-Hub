import * as React from 'react';
import { View, StyleSheet, Image , Text, useWindowDimensions, ActivityIndicator } from 'react-native';
import CommunityContentList from '../components/CommunityContentList';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { getTokenAndUserId } from '../helpers/Auth';
import { getSocket } from '../helpers/socket';
import { Snackbar } from 'react-native-paper';
import EducationalContentFormModal from '../components/EducationalContentFormModal';

export function CommunityScreen(){
    const { height, width } = useWindowDimensions();
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;

    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [CommunityContentData, setCommunityContentData] = useState(null);
	const onDismissSnackBar = () => setVisible(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [mode, setMode] = useState(null);

    const fetchPosts = async () => {
        const [offset, setOffset] = useState(0);
        const [posts, setPost] = useState(null);

        const { token, userId } = await getTokenAndUserId();

        const response = await fetch(`${url}/posts/${offset}`,{
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if(response.ok){
            const data = await response.json();
            setPost(data);
        }else{
            console.error('Não foi possível carregar os posts!');
        }
    }
    useEffect(() => {
        const listenEvent = async () => {
			//Carrega os conteúdos educacionais do banco de dados
			await fetchPosts();
			const socketIo = getSocket();

			socketIo.on('postcreate', (newContent)=>{
				setPost((prevPost) => [newContent, ...prevPost]);
			});

			socketIo.on('postdeleted', (contentId) => {
				setPost((prevPost) => {
					if (!prevPost) {
						return prevPost;
					}
					const contents = prevPost.filter((content) => content.id != contentId);
					//setVisible(true);
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
					<CommunityContentList CommunityContents={CommunityContentData} setModalVisible={setModalVisible} setMode={setMode}/>
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
}
const styles = StyleSheet.create({
    
    logo:{
        marginTop:10,
        width:48,
        height:48,
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
