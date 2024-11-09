import * as React from 'react';
import { View, StyleSheet, Image , Text, useWindowDimensions, ActivityIndicator } from 'react-native';
import PostList from '../components/PostList';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { getTokenAndUserId } from '../helpers/Auth';
import { getSocket } from '../helpers/socket';
import { Snackbar } from 'react-native-paper';
import PostFormModal from '../components/PostFormModal';

export function CommunityScreen(){
    const { width } = useWindowDimensions();
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;

    const [loading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [offset] = useState(0);
    const [posts, setPosts] = useState(null);
	const onDismissSnackBar = () => setVisible(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [mode, setMode] = useState(null);
    const [postToEdit, setPostToEdit] = useState(null);

    const fetchPosts = async () => {

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
            setPosts(data);
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
				setPosts((prevPosts) => [newContent, ...prevPosts]);
			});

			socketIo.on('postdeleted', (contentId) => {
				setPosts((prevPosts) => {
					if (!prevPosts) {
						return prevPosts;
					}
					const contents = prevPosts.filter((content) => content.id != contentId);
					setVisible(true);
					return contents;
				});
			});

            socketIo.on('postedit', (updatedPost) => {
				setPosts((prevPosts) => {
					if (!prevPosts) {
						return prevPosts;
					}
					// Mapeia a lista, substituindo o item pelo novo conteúdo se o ID for correspondente
					const contents = prevPosts.map((content) =>
						content.id === updatedPost.id ? updatedPost : content
					);
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
					<PostList posts={posts} setModalVisible={setModalVisible} setMode={setMode} setPostToEdit={setPostToEdit}/>
                    <PostFormModal modalVisible={modalVisible} setModalVisible={setModalVisible} mode={mode} postToEdit={postToEdit}/>
					<Snackbar style={{width: width - 10, position: 'absolute', bottom: 80}} visible={visible} duration={2000} onDismiss={onDismissSnackBar}>
						Post deletado com sucesso!
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
