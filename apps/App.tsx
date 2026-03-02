import React from 'react';
import { enableFreeze } from 'react-native-screens';
// import { NavigationContainer } from '@react-navigation/native';

// import { COMPONENT_SCENARIOS as Integration } from './src/tests/component-integration-tests';
// import { COMPONENT_SCENARIOS as Feature } from './src/tests/single-feature-tests';
// import * as Issue from './src/tests/issue-tests';
import Example from './Example';

enableFreeze(true);

export default function App() {
  return <Example />;
  // return <Issue.TestBottomTabs />;
  // return (
  //   <NavigationContainer>
  //     <Integration.Orientation.scenarios.StackInTabs.AppComponent />
  //   </NavigationContainer>
  // );
}
