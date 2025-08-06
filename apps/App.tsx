import React from 'react';
import { enableFreeze } from 'react-native-screens';
// import Example from './Example';
import * as Test from './src/tests';
//import BarButtonItemsExample from './src/screens/BarButtonItems';

enableFreeze(true);

export default function App() {
  // return <Example />;
  // return <BarButtonItemsExample />;
  return <Test.TestBottomTabs />;
}
