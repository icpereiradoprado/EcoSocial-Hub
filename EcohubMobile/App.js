import React from 'react';
import { StatusBar } from 'react-native'
import RootStack from './src/navigation/RootStack';
import { base, colors } from './src/css/base';

const App = () => {
  return (
	<>
		<StatusBar barStyle="dark-content" backgroundColor={colors.white_default}/>
		<RootStack />
	</>
  );
};

export default App;