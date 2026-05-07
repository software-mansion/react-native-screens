import React from 'react';
import { enableFreeze } from 'react-native-screens';

import { Tests } from './src/tests';

enableFreeze(true);

export default function App() {
  return (
    <Tests.Feature.Tabs.scenarios.TestTabsMoreNavigationController />
  );
}
