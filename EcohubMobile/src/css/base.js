/**IMPORTS NECESSÁRIOS PARA O COMPONENTE */
import { StyleSheet } from "react-native";

/**Estilização base para o projeto
 * Contém estilizações comuns para os componentes
 */
export const base = StyleSheet.create({
    input : {
        height: 40,
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
        width:'100%',
        textAlign:'left',
        borderRadius: 10,
    },
    textArea: {
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
        textAlign:'left',
        borderRadius: 10,
        height: 130,
        textAlignVertical: 'top'
    },
    passwordInput:{
        height: 40,
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
        width:'100%',
        textAlign:'left',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent:'space-between'
    },
    logo:{
        width: 180,
        height: 180,
    },
    button: {
        margin: 12,
        padding: 10,
        width:'80%',
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#AED581'
    },
    buttonText: {
        textAlign: 'center',
        color: '#424242',
        fontSize: 16,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 10 
    },
    flexRow:{
        flexDirection: 'row',
    },
    bgColorDefault:{
        backgroundColor: '#f0f0f0'
    }

});

export const colors = {
    green_default : '#AED581',
    green_dark    : '#aed581',
    white_default : '#f0f0f0',
    gray_default  : '#424242',
    black_default : '#000000'
}
