import React from 'react';

import { StackContainer } from '../../shared/gamma/containers/stack/StackContainer';
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';

export default function App() {
  return (
    <StackContainer
      pathConfigs={[
        { name: 'home', component: HomeScreen },
        { name: 'details', component: DetailsScreen },
      ]}
    />
  );
}
