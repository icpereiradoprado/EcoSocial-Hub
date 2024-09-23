import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Logo from '../components/Logo';
import { Title } from '../components/Title';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ButtonLink } from '../components/ButtonLink';

export default function RegisterScreen(){
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [city, setCity] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
  
    const handleRegister = async () => {
      try {
        const response = await fetch(`http://192.168.187.7:5000/users/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            phone_number : phoneNumber,
            city,
            password,
            confirm_password : confirmPassword
          }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
          Alert.alert('Sucesso', data.message);
        } else {
            console.log(data);
          Alert.alert('Erro', data.message);
        }
      } catch (error) {
        console.log("Erro:", error);
      }
    
    }

    const handleGoBack = ()=>{
        navigation.goBack();
    }
    return (
        <ScrollView style={styles.scrollView}>

            <View style={styles.container}>
                <Logo />
                < Title />
                <Input 
                    name="name"
                    style={styles.input}
                    value={name}
                    placeholder="Usuário"
                    onChangeText={setName}
                    autoCapitalize="none"
                />
          
                <Input 
                    name="email"
                    style={styles.input}
                    value={email}
                    placeholder="E-mail"
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    inputMode='email'
                />
            
                <Input 
                    name="phone_number"
                    style={styles.input}
                    value={phoneNumber}
                    placeholder="Celular"
                    onChangeText={setPhoneNumber}
                    autoCapitalize="none"
                    inputMode="numeric"
                />
                <Input 
                    name="city"
                    style={styles.input}
                    value={city}
                    placeholder="Cidade"
                    onChangeText={setCity}
                    autoCapitalize="none"
                />
                <Input 
                    name="password"
                    style={styles.input}
                    placeholder="Senha"
                    secureTextEntry= {true}
                    value={password}
                    onChangeText={setPassword}
                />
                <Input 
                    name="confirm_password"
                    style={styles.input}
                    placeholder="Confirmar senha"
                    secureTextEntry= {true}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />

                <Button onPress={handleRegister} buttonText="Cadastrar"/>

                <ButtonLink onPress={handleGoBack} linkText="Clique aqui" additionalText="Já possui uma conta?"/>
          </View>
      </ScrollView>
    );
  };
  
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 30,
        paddingTop: 50,
        paddingBottom: 10, 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0', // Cor de fundo da tela Home
    },
    scrollView:{
        flex: 1
    }
});