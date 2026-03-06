import React from 'react';
import { enableFreeze, featureFlags } from 'react-native-screens';

import Example from './Example';
// import { NavigationContainer } from '@react-navigation/native';
// import { Tests } from './src/tests';

enableFreeze(true);
featureFlags.stable.debugLogging = true;

export default function App() {
  return <Example />;
  // return (
  //   <NavigationContainer>
  //     <Tests.Issue.TestBottomTabs />
  //   </NavigationContainer>
  // );
}
