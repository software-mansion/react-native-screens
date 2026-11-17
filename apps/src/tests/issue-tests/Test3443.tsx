import React from 'react';

import {
  TabsContainer,
  type TabRouteConfig,
} from '@apps/shared/containers/tabs';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { Text } from 'react-native';

function makeTab(title: string, description: string) {
  return (
    <CenteredLayoutView>
      <Text style={{ fontWeight: 'bold' }}>{title}</Text>
      <Text style={{ textAlign: 'center' }}>{description}</Text>
    </CenteredLayoutView>
  );
}

const TAB_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Tab1',
    element: makeTab(
      'Tab 1',
      'Tab icon is from Xcassets.\nOnly icon prop is defined.',
    ),
    options: {
      title: 'Tab 1',
      ios: {
        icon: {
          type: 'imageSource',
          imageSource: { uri: 'custom-icon' },
          renderingMode: 'template',
        },
      },
    },
  },
  {
    name: 'Tab2',
    element: makeTab(
      'Tab 2',
      'Tab icon is from Xcassets.\nBoth icon and selectedIcon props are defined.',
    ),
    options: {
      title: 'Tab 2',
      ios: {
        icon: {
          type: 'imageSource',
          imageSource: { uri: 'custom-icon' },
          renderingMode: 'template',
        },
        selectedIcon: {
          type: 'imageSource',
          imageSource: { uri: 'custom-icon-fill' },
          renderingMode: 'template',
        },
      },
    },
  },
];

function App() {
  return <TabsContainer routeConfigs={TAB_CONFIGS} />;
}

export default App;
