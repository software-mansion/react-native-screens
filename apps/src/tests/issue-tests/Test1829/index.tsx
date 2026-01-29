import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import Stacks from './navigation/Stacks';

const App = () => (
  <SafeAreaProvider>
    <NavigationContainer>
      <Stacks />
    </NavigationContainer>
  </SafeAreaProvider>
);

export default App;
