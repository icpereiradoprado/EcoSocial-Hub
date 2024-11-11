//Importa as bibliotecas necessárias
import React from 'react';
import { StatusBar } from 'react-native';
import RootStack from './src/navigation/RootStack';
import { base, colors } from './src/css/base';

// Componente principal do aplicativo
const App = () => {
  return (
    <>
      {/* Define a barra de status com conteúdo escuro e fundo claro */}
      <StatusBar barStyle="dark-content" backgroundColor='#f0f0f2'/>
      
      {/* Define o RootStack como o container de navegação principal */}
      <RootStack />
    </>
  );
};

export default App;
