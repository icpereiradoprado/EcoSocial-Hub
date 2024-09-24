import React from 'react';
import { StatusBar } from 'react-native'
import RootStack from './src/navigation/RootStack';
import { base } from './src/css/base';

const App = () => {
  return (
	<>
		<StatusBar barStyle="dark-content" backgroundColor='#f0f0f0'/>
		<RootStack />
	</>
  );
};

export default App;