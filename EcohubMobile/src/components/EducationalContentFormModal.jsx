import { View, Text, Modal, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const { height } = Dimensions.get('window');

const EducationalContentFormModal = ({ modalVisible, setModalVisible }) => {
    return(

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalView}>
                <Text style={styles.modalText}>Aqui você pode criar o conteúdo!</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                    <Text>Fechar</Text>
                </TouchableOpacity>
            </View>
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
        height: height * 0.5,
        marginTop: 'auto',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    closeButton: {
        marginTop: 10,
    },
});

export default EducationalContentFormModal;