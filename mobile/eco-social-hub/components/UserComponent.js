import React from "react";
import axios from "axios";
import { View, Text, Button, Alert } from "react-native";

export default function UserComponent({name, email}){
    const handleDeleteUser = async () => {
        const response = await axios.delete(`http://192.168.216.7:5000/users/delete/${name}/${email}`);
        Alert.alert('Sucesso', response.data.message);
    }

    return (
        <View style={{ padding: 20}}>
            <Text>Usuário : {name}</Text>
            <Button title="Deletar usuário" onPress={handleDeleteUser} color="red" />
        </View>
    );
}