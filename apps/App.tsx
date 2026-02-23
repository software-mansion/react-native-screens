import React from 'react';
import { enableFreeze } from 'react-native-screens';

import Example from './Example';

// import * as Test from './src/tests/importer';
// import { NavigationContainer } from '@react-navigation/native';
// const Example = Test.CIT.Orientation.scenarios.StackInTabs.AppComponent;

enableFreeze(true);

export default function App() {
  return <Example />;
  // return (
  //   <NavigationContainer>
  //     <Example />
  //   </NavigationContainer>
  // );
}
