import { StyleSheet } from "react-native";

export const base = StyleSheet.create({
    input : {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width:'100%',
        textAlign:"center",
        borderRadius: 10,
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
        fontSize: 16
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 10 
    }

});