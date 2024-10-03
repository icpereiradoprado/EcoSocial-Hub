import { View, StyleSheet, TouchableOpacity, Image, Text, Dimensions, FlatList} from "react-native";
import { Entypo, AntDesign } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

export default function EducationalContent({educationalContents, userData }) {
    const EducationalContentItem = ({id, title, content}) => (
        <View style={styles.postContainer}>
            <View style={{paddingHorizontal: 25}}>
                {/*HEADER DO POST*/}
                <View style={styles.postHeader}>
                    <View style={styles.postUserIdentificationContainer}>
                        <Image source={{ uri: 'x' }} style={styles.image}/>
                        <View style={styles.postUserIdentification}>
                            <Text style={styles.postUserName}>Nome do usuário</Text>
                            <Text style={styles.postUserRole}>Admin | Morador</Text>
                            <Text style={styles.postDate}>02/10/2024</Text>
                        </View>
                    </View>
                    <TouchableOpacity>
                        <Entypo name="dots-three-horizontal" size={25} />
                    </TouchableOpacity>
                </View>
                {/*DESCRIPT DO POST*/}
                <View>
                    <Text>DESCRIÇÃO DO CONTEÚDO EDUCACIONAL</Text>
                </View>
            </View>
            {/*IMAGEM DO CONTEÚDO*/}
            <Image source={{uri: 'x'}}alt="Erro ao carregar a imagem" style={styles.postImage}/>
            {/*FOOTER DO CONTEÚDO*/}
            <View>
                {/*COMETÁRIOS*/}
                <Text style={styles.comments}>0 Comentários</Text>
                {/*ACÇÕES FOOTER */}
                <View style={styles.footerActions}>
                        <TouchableOpacity>
                            <AntDesign name="like2" size={25}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <AntDesign name="dislike2" size={25}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <AntDesign name="message1" size={25}/>
                        </TouchableOpacity>
                </View>
            </View>
        </View>
    )
    return (
        <FlatList 
            data={educationalContents}
            renderItem={({item}) => <EducationalContentItem title={item.title}/>}
            keyExtractor={item => item.id}
            style={{width: width}}
        />
    )
}

const styles = StyleSheet.create({
    postContainer:{
        backgroundColor: '#FFBDBD',
        width: width,
        marginBottom: 24
    },
    image:{
        width: 65,
        height: 65,
        backgroundColor: 'gray'
    },
    postHeader:{
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    postUserIdentificationContainer:{
        flexDirection: 'row'
    },
    postUserIdentification: {
        gap: 4
    },
    postUserName:{
        fontSize: 18,
        fontWeight: 'bold',
        //COLOCAR UM OVERFLOW PARA ACRESTAR ... QUANDO O NOME FOR MUITO GRANDE
    },
    postUserRole:{
        fontSize: 14,
    },
    postDate:{
        fontSize: 12
    },
    postImage:{
        width: width,
        height: height - 350,
        backgroundColor: 'gray'
    },
    footerActions:{
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    comments:{
        textAlign: 'right',
        fontSize: 12
    },

});

