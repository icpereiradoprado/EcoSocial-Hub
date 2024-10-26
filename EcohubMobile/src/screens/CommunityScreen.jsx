import { View, StyleSheet, TouchableOpacity, Image, Text, Dimensions, FlatList, Button, TextInput} from "react-native";
import { base, colors } from "../css/base";
import { useEffect, useState } from 'react';
import { getTokenAndUserId } from "../helpers/Auth";

export function CommunityScreen(){
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;

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
        <View>
             <View style={[base.flexRow, {justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, width: '100%'}]}>
                <View style={[base.flexRow]}>
                    <Text style={[base.title,{paddingTop:13}]}>Comunidade</Text>
                    <Image source={require('../assets/images/community.png')} style = {styles.logo} />
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
