import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput , Pressable, Image, Alert, Button} from 'react-native';

const LoginScreen = () => {
  const [userIdentification, setUserIdentification] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://192.168.15.11:5000/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIdentification,
          password,
        }),
      });
  
      const data = await response.json();
      console.log(data);
  
      if (response.ok) {
        Alert.alert('Sucesso', data.message);
      } else {
        Alert.alert('Erro', data.message);
      }
    } catch (error) {
      console.log("Erro:", error);
    }
    /* try{
      console.log('try')
      //Faz a requisção para api de Login | rota users/login
      const response = await axios.post('http://192.168.15.11:5000/users/login', {
         userOrEmail,
         password
      })
      if(response.status === 200){
        Alert.alert('Sucesso', response.data.message);
      }else{
        console.log(response.status)
      }
    }catch(err){
      if(err.response){
        const { data } = err.response;
        Alert.alert('Erro', data.message);
      }
    } */
  }
  return (
    <View style={styles.container}>

       <Image  source={require('../images/logo.png')}  
      style={styles.logo}/>


      <Text style={styles.title}> Eco Hub Social </Text>

      <TextInput name="user" 
        style={styles.input}
        value={userIdentification}
        placeholder="Usuario"
        onChangeText={setUserIdentification}
        autoCapitalize="none"
      />

      <TextInput name="password" 
        style={styles.input}
        placeholder="Senha"
        secureTextEntry= {true}
        value={password}
        onChangeText={setPassword}
      />

    <Pressable style={styles.button} onPress={handleLogin}>
      <Text style={styles.textButton}>Entrar</Text>
    </Pressable>
    <Button title="Login" onPress={handleLogin} />
    
    <Pressable>
    <Text style={{ color: 'grey', textDecorationLine: 'underline' }}>
        Cadastre-se
      </Text>
     </Pressable>  
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Cor de fundo da tela Home
  },
  title: {
    fontSize: 24, // Tamanho do texto
    fontWeight: 'bold',
    color: '#333', // Cor do texto
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width:200,
    textAlign:"center",
    borderRadius: 10,
  },
  button: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width:100,
    borderRadius: 10,
  },
  textButton:{
    textAlign:"center",
  },
  logo:{
    width: 200,  // Defina o tamanho da logo
    height: 200,
  }
});

export default LoginScreen;
