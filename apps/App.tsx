import React from 'react';
import { enableFreeze } from 'react-native-screens';

import Example from './Example';

// import { TestTabsSimpleNav } from './src/tests/single-feature-tests';
// import { TestTabsInStackStableEnterTransition } from './src/tests/component-integration-tests';
// import { Test42 } from './src/tests/issue-tests';

enableFreeze(true);

export default function App() {
  return <Example />;
}
