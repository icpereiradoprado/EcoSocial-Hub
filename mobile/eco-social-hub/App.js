import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import UserComponent from './components/UserComponent';

export default function App() {
  const name = 'teste';
  const email = 'teste@testeee.com';

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <UserComponent name={name} email={email} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
