import React from 'react';
import { enableFreeze } from 'react-native-screens';
import Example from './Example';
// import * as Test from './src/tests';

enableFreeze(true);

export default function App() {
  return <Example />;
  // return <Test.Test42 />
}
