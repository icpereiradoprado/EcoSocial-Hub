import { useState } from 'react';
import { View, Text, Modal, StyleSheet, Dimensions, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Button } from '../components/Button';
import { base, colors } from "../css/base";
import { MaterialIcons } from '@expo/vector-icons';
import { Mode } from '../helpers/Enums';
import { Input } from './Input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextArea } from './TextArea';
import * as ImagePicker from 'expo-image-picker';

const { height } = Dimensions.get('window');

const EducationalContentFormModal = ({ modalVisible, setModalVisible, mode }) => {
    const [image, setImage] = useState(null);
    const handlePickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
            base64: true,
        });
  
        if (!result.canceled) {
            setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
            //console.log(result.assets[0].uri)
        }
    };
    return(
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        > 
                <KeyboardAwareScrollView>
                    <View style={styles.modalView}>
                        <View style={styles.modalBodyForm}>
                            <Text style={base.title} >{mode === Mode.create ? 'Novo conteúdo' : 'Editar conteúdo'}</Text>
                            <View style={{width: '100%', height: '100%'}}>
                                <Input
                                    name="title"
                                    placeholder="Título"
                                    autoCapitalize="none"
                                />
                                <TextArea
                                    name="content"
                                    placeholder="Conteúdo"
                                    autoCapitalize="none"
                                    multiline={true}
                                    numberOfLines={5}
                                    maxLength={900}
                                />
                                <Input
                                    name="tag"
                                    placeholder="Tags"
                                    autoCapitalize="none"
                                />
                                {image &&
                                    <Image source={{uri: image}} style={{width: 250, height: 250}}/>
                                }
                                <TouchableOpacity onPress={handlePickImage}>
                                    <MaterialIcons name='add-photo-alternate' size={40}/>
                                </TouchableOpacity>
                                <View style={styles.sendButton} >
                                    <Button  buttonText='Criar Conteúdo'  />
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <MaterialIcons name='close' size={25}/>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
        </Modal> 
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        height: height,
        marginTop: 'auto',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    sendButton:{
        justifyContent: 'center',
        alignItems: 'center',
        
    }
    ,
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    modalBodyForm: {
        marginTop: 48,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    closeButton: {
        position: 'absolute',
        left: 10,
        top: 15
    },
});

export default EducationalContentFormModal;