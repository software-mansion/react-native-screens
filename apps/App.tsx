import React from 'react';
import { enableFreeze } from 'react-native-screens';

import Example from './Example';
// import { NavigationContainer } from '@react-navigation/native';
import { Tests } from './src/tests';
import { NavigationContainer } from '@react-navigation/native';

enableFreeze(true);

export default function App() {
  // return <Example />;
  return (
    <NavigationContainer>
      <Tests.Feature.StackV5.scenarios.TestStackSubviewsIOS />
    </NavigationContainer>
  );
}
