import { View, TouchableOpacity, Image, StyleSheet, Dimensions, Text } from 'react-native'
import { MaterialIcons, AntDesign,  } from '@expo/vector-icons'
import { format } from 'date-fns'
import Constants from 'expo-constants'
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../css/base';
import { getTokenAndUserId } from '../helpers/Auth';
import { Alert } from 'react-native';
import { Mode, VoteType } from '../helpers/Enums';

const { height, width } = Dimensions.get('window');

const Post = ({
    id, 
    title, 
    content,
    create_date: createDate, 
    username, 
    user_id: userId, 
    post_picture:postPicture,
    upvotes:upvotes,
    downvotes:downvotes,
    city,
    setModalVisible, 
    setMode,
    setPostToEdit
}) => {
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;
    const [userPicture, setUserPicture] = useState(null);
    const [selectPost, setSelectPost] = useState(null);
    const [isAdmin, setIsAdmin] = useState(0);
    const [userToken, setUserToken] = useState(null);
    const [loggedUserId, setLoggedUser] = useState(null);
    const [upVotes, setUpVotes] = useState(0);
    const [downVotes, setDownVotes] = useState(0);
    const [hasPostUpVoted, setHasPostUpVoted] = useState(false);
    const [hasPostDownVoted, setHasPostDownVoted] = useState(false);
    const [commentsCount, setCommentsCount] = useState(0);

    const fetchUserImage = async () => {
        const response = await fetch(`${url}/users/${userId}`);

        if(response.ok){
            
            const data = await response.json();
            setUserPicture(data.profile_picture);
        }
    }

    const fetchPostVoted = async () => {
        const { userId, token } = await getTokenAndUserId();
        try {
            const response = await fetch(`${url}/posts/postsvoted/${userId}/${id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if(response.ok){
                const data = await response.json();
                const postVoted = data.postsVoted[0];
                if(postVoted && postVoted.type == VoteType.up){
                    setHasPostUpVoted(true);
                    setHasPostDownVoted(false);
                }else if(postVoted && postVoted.type == VoteType.down){
                    setHasPostDownVoted(true);
                    setHasPostUpVoted(false);
                }
            }
        } catch (err) {
            console.error(`Erro ao realizar a requisição ${err.message}`)
        }
    }

    const showEditTooltip = (id) => {
        if(selectPost === id){
            setSelectPost(null);
        }else{
            setSelectPost(id);
        }
        
    }
    const handleDeleteContent = async (id) => {
        try {
            await fetch(`${url}/posts/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });
        } catch (err) {
            console.error(`Erro ao deletar post: ${err.message}`);
        }
    }
    const handleDeleteContentMesssage = (title, id) => {
        Alert.alert('Deletar post', `Você realmente deseja deletar o post '${title}'?`,[
            { text: 'Não', style: 'cancel'},
            { text: 'Sim', style: 'default', onPress: () => handleDeleteContent(id) }
        ])
    }

    const handleToSetPostToEdit = () => {
        const post = {
            id,
            title,
            content,
            postPicture,
        }
        setPostToEdit(post);
    }

    const handleToUpVote = async () => {
        try {
            const { userId, token } = await getTokenAndUserId();
            const body = JSON.stringify({
                user_id: userId,
                post_id: id
            });
            const response = await fetch(`${url}/posts/up`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body
            });

            if(response.ok){
                if(hasPostUpVoted){
                    setHasPostUpVoted(false);
                    setUpVotes((prevPost) => {
                        if(prevPost == 0) return prevPost;
                        return prevPost - 1;
                    });
                }else{
                    setHasPostUpVoted(true);
                    setUpVotes((prevPost) => prevPost + 1);
                }
                if(hasPostDownVoted){
                    setHasPostDownVoted(false);
                    if(hasPostDownVoted){
                        setDownVotes((prevPost) => {
                            if(prevPost == 0) return prevPost;
                            return prevPost - 1;
                        });
                    }
                }
            }else{
                console.log('upvote failed');
            }
        } catch (err) {
            console.error(`Erro ao realizar esta ação: ${err.message}`);
        }
    }
    const handleToDownVote = async () => {
        try {
            const { userId, token } = await getTokenAndUserId();
            const body = JSON.stringify({
                user_id: userId,
                post_id: id
            });
            const response = await fetch(`${url}/posts/down`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body
            });

            if(response.ok){
                if(hasPostUpVoted){
                    setHasPostUpVoted(false);
                }
                if(hasPostDownVoted){
                    setHasPostDownVoted(false);
                    setDownVotes((prevPost) => {
                        if(prevPost == 0) return prevPost;
                        return prevPost - 1;
                    });
                }else{
                    setHasPostDownVoted(true);
                    setDownVotes((prevPost) => prevPost + 1);
                    if(hasPostUpVoted){
                        setUpVotes((prevPost) => {
                            if(prevPost == 0) return prevPost;
                            return prevPost - 1;
                        });
                    }
                }
            }else{
                const data = await response.json()
                console.log('downvote failed', data.message);
            }
        } catch (err) {
            console.error(`Erro ao realizar esta ação: ${err.message}`);
        }
    }

    useEffect(() => {
        const getUserInfo = async () => {
            const { userId: loggedUserId, isAdmin, token } = await getTokenAndUserId();
            setIsAdmin(isAdmin);
            setUserToken(token);
            setLoggedUser(loggedUserId);
        }
        getUserInfo();

        setUpVotes(upvotes);
        setDownVotes(downvotes);

        fetchPostVoted();
        
    }, []);

    useFocusEffect(
        useCallback(()=>{
            fetchUserImage();
        },[])
    );
    return (
        <View style={styles.postContainer}>
            {/* Informações do usuário */}
            <View style={styles.userInfo}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={{ uri:`data:image/jpeg;base64,${userPicture}`}} style={styles.userImage} />
                    <View>
                        <Text style={styles.userName}>{username}</Text>
                        <Text style={styles.postUserRole}>{city}</Text>
                    </View>
                </View>
                {((isAdmin == 1) || (userId == loggedUserId)) && (
                    <TouchableOpacity onPress={() => showEditTooltip(id) }>
                        <MaterialIcons name='more-vert' size={25}/>
                    </TouchableOpacity>
                )}
                {selectPost === id && (
                    <View style={styles.editTooltip}>
                        {(userId == loggedUserId) && (
                            <TouchableOpacity onPress={() => {setModalVisible(true); setMode(Mode.update); handleToSetPostToEdit();setSelectPost(null)}}>
                                <Text style={styles.buttonTooltip}>Editar</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={() => {handleDeleteContentMesssage(title, id); setSelectPost(null)}}>
                            <Text style={[styles.buttonTooltip, {color: 'red'}]}>Deletar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <Text style={styles.postTitle}>{title}</Text>
            {/* Descrição do post */}
            <Text style={styles.postDescription}>{content}</Text>
                {/* Imagem do post */}
                {postPicture ? <Image source={{ uri:`data:image/jpeg;base64,${postPicture}` }} style={[styles.postImage,{width: '100%', height: height-350}]} /> : null}
                <Text style={styles.date}>{format(new Date(createDate), 'dd/MM/yyyy HH:mm:ss')}</Text>

            <View style={styles.footer}>           
                <View style={ {flexDirection:'row', gap:5, alignItems:'center', fontSize:'20'}}>
                    <TouchableOpacity onPress={handleToUpVote}>
                        <AntDesign name={hasPostUpVoted ? 'like1' : 'like2'} size={22}/>
                    </TouchableOpacity>
                    <Text style={{ fontSize:16, fontWeight:'500'}}>{upVotes}</Text>
                </View>

                <View style={ {flexDirection:'row', gap:5, alignItems:'center'}}>                     
                    <TouchableOpacity onPress={handleToDownVote}>
                        <AntDesign name={hasPostDownVoted ? 'dislike1' : 'dislike2'} size={22} /> 
                    </TouchableOpacity>
                    <Text  style={{ fontSize:16, fontWeight:'500'}}>{downVotes}</Text>
                </View>

                <View style={ {flexDirection:'row', gap:5 ,alignItems:'center'}}>
                    <TouchableOpacity>
                            <AntDesign name='message1' size={22}/>
                    </TouchableOpacity>
                    <Text  style={{ fontSize:16, fontWeight:'500'}}>{commentsCount}</Text>
                </View>
            </View>
        </View>
    )
}

export default React.memo(Post);

const styles = StyleSheet.create({
    postContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
        justifyContent: 'space-between'
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    postTitle:{
        fontWeight: 'bold',
        fontSize:20,
    },
    postDescription: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    postImage: {
        borderRadius: 8,
        marginBottom: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        padding: 10,
        backgroundColor: '#ddd',
        borderRadius: 4,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    editTooltip:{
        width: 150,
        position: 'absolute',
        borderRadius: 12,
        backgroundColor: 'white',
        right: 5,
        top: 25,
        padding: 12,
        zIndex: 1,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonTooltip:{
        padding: 4,
        fontWeight: '700'
    },
    footer:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop:10,

    }
});