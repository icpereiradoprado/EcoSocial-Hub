/**IMPORTS NECESSÁRIOS PARA O COMPONENTE */
import { View, StyleSheet, TouchableOpacity, Image, Text, Dimensions, FlatList, TextInput} from "react-native";
import {useState} from 'react';
import Post from "./Post";
import { base, colors } from "../css/base";
import { Mode } from "../helpers/Enums";
import CommentsModal from "./CommetsModal";

const { width } = Dimensions.get('window');

/**
 * Componente de Lista de Post
 * @param {Array} posts Array de Posts
 * @param {Function} setModalVisible Hook para alterar o estado de modalVisible
 * @param {Function} setMode Hook para alterar o estado de mode
 * @param {Function} setPostToEdit Hook para alterar o estado de postToEdit
 * @returns Componente de Lista de Posts
 */
export default function PostList({
    posts, 
    setModalVisible, 
    setMode,
    setPostToEdit
}) {
    //Estados do componente
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [postId, setPostId] = useState(null);

    //Componente Header para a lista de post
    const PostHeader = () => (
          <View>
             <View style={[base.flexRow, {justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, width: '100%'}]}>
                <View style={[base.flexRow]}>
                    <Text style={[base.title,{paddingTop:13}]}>Comunidade  </Text>
                    <Image source={require('../assets/images/community.png')} style={styles.logo} />
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
        
    );
    /**
     * Retorna a Lista do Posts, caso `posts` seja vazio exibe mensagem de conteúdo vazio.
     * Caso haja items retorna lista o componente `Post.jsx` 
     */
    return (
        <View>
        <FlatList 
            data={posts}
            ListEmptyComponent={() => <View style={{alignItems: 'center'}}><Text style={{textAlign: 'center'}}>Não há nenhum conteúdo postado!</Text></View>}
            renderItem={({item}) => <Post 
                id={item.id}
                title={item.title}
                content={item.content}
                create_date={item.create_date}
                username={item.username} 
                user_id={item.user_id}
                post_picture={item.post_picture}
                upvotes={item.upvotes}
                downvotes={item.downvotes}
                city={item.city}
                commentCount={item.comment_count}
                setModalVisible={setModalVisible}
                setMode={setMode}
                setPostToEdit={setPostToEdit}
                setCommentModalVisible={setCommentModalVisible}
                setPostId={setPostId}
            />}
            keyExtractor={item => item.id}
            ListHeaderComponent={()=> <PostHeader />}
            ListHeaderComponentStyle={styles.headerComponent}
            ListFooterComponent={()=> <View></View>}
            ListFooterComponentStyle={{backgroundColor: 'transparent', padding: 35}}
            style={{width: width, paddingHorizontal: 10}}
        />
        <CommentsModal modalVisible={commentModalVisible} setModalVisible={setCommentModalVisible} postId={postId}/>
        </View>
    )
}

/**Estilização do componente PostList */
const styles = StyleSheet.create({
    headerComponent: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.white_default,
        paddingVertical: 10,
    },
    logo:{
        width:50,
        height:50,
        marginTop:10
    },
    div:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 10,
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
