import { FlatList, StyleSheet, Text, View, Dimensions, ActivityIndicator } from "react-native";
import { useState } from 'react';
import Comment from "./Comment";

const { height, width } = Dimensions.get('window');

const CommentList = ({ commentsData, hasMoreData, loadMoreData, setCommentToEdit }) => {
    const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);
    const handleLoadMoreData = async () => {
        if(hasMoreData){
            setIsLoadingMoreData(true);
            await loadMoreData();
            setIsLoadingMoreData(false);
        }
    }

    const CommentsHeader = () => (
        <View style={stylesHeader.headerComponent}>
            <Text style={stylesHeader.headerText}>Comentários</Text>
        </View>
    );

    const CommentsFooter = () => (
        <View>
            {isLoadingMoreData && (
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: 16}}>Carregando mais cometários...</Text>
                    <ActivityIndicator size="small" color="#000000"/>
                </View>
            )}
        </View>
    )
    return (
        <FlatList
            data={commentsData}
            ListEmptyComponent={() => <View><Text>Não há nenhum comentário ainda...</Text></View>}
            renderItem ={({item}) => <Comment
                id={item.id}
                content={item.content}
                postId={item.post_id}
                userId={item.userId}
                createDate={item.create_date}
                commentParent={item.comment_parent}
                username={item.username}
                setCommentToEdit={setCommentToEdit}
            />}
            keyExtractor={item => item.id}
            onEndReached={handleLoadMoreData}
            onEndReachedThreshold={0.02}
            ListHeaderComponent={()=> <CommentsHeader />}
            ListHeaderComponentStyle={stylesHeader}
            ListFooterComponent={()=> <CommentsFooter />}
            ListFooterComponentStyle={{paddingBottom: hasMoreData ? 140 : 130}}
            style={{width: width, paddingHorizontal: 15}}
        />
    )
}

const stylesHeader = StyleSheet.create({
    headerComponent:{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingBottom: 20
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold'
    }
})

export default CommentList;