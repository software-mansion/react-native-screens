import React from 'react';
import { enableFreeze } from 'react-native-screens';
import * as Test from './src/tests';

enableFreeze(true);

export default function App() {
  return <Test.Test42 />;
}
