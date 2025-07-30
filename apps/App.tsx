import React from 'react';
import { enableFreeze } from 'react-native-screens';
import Basic from './src/screens/Basic';
import BasicBareScreens from './src/screens/BasicBareScreens';
// import Example from './Example';
import * as Test from './src/tests';

enableFreeze(true);

export default function App() {
  // return <Example />;
  // return <Test.TestBottomTabs />;
  return <Basic />;
  // return <BasicBareScreens />;
}
