import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Após 3 segundos, navega para a próxima tela
    setTimeout(() => {
      navigation.replace('LoginScreen'); // 'Home' é o nome da sua próxima tela
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <Image  source={require('../images/logo.png')}  
      style={styles.logo}/>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Cor de fundo
  },
  logo: {
    width: 200,  // Defina o tamanho da logo
    height: 200,
  },
  text:{
    fontSize : 23,
  }

});

export default Splash;