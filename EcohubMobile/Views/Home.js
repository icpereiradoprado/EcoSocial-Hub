import React from 'react';
import { View, Text, StyleSheet, TextInput , Pressable, Image} from 'react-native';

const Home = () => {
  return (
    <View style={styles.container}>

       <Image  source={require('../images/logo.png')}  
      style={styles.logo}/>


      <Text style={styles.title}> Eco Hub Social </Text>

      <TextInput name="user" 
      style={styles.input}
      placeholder="Usuario"
      />

      <TextInput name="password" 
      style={styles.input}
      placeholder="Senha"
      secureTextEntry= {true}
      />

    <Pressable style={styles.button}>
      <Text style={styles.textButton}>Entrar</Text>
    </Pressable>
    
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

export default Home;
