import React from 'react';

import {
  TabsContainer,
  type TabRouteConfig,
} from '../../shared/gamma/containers/tabs';
import { CenteredLayoutView } from '../../shared/CenteredLayoutView';
import { Text } from 'react-native';

function makeTab(title: string, description: string) {
  return () => (
    <CenteredLayoutView>
      <Text style={{ fontWeight: 'bold' }}>{title}</Text>
      <Text style={{ textAlign: 'center' }}>{description}</Text>
    </CenteredLayoutView>
  );
}

const TAB_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Tab1',
    Component: makeTab(
      'Tab 1',
      'Tab icon is from Xcassets.\nOnly icon prop is defined.',
    ),
    options: {
      title: 'Tab 1',
      ios: {
        icon: {
          type: 'xcasset',
          name: 'custom-icon',
        },
      },
    },
  },
  {
    name: 'Tab2',
    Component: makeTab(
      'Tab 2',
      'Tab icon is from Xcassets.\nBoth icon and selectedIcon props are defined.',
    ),
    options: {
      title: 'Tab 2',
      ios: {
        icon: {
          type: 'xcasset',
          name: 'custom-icon',
        },
        selectedIcon: {
          type: 'xcasset',
          name: 'custom-icon-fill',
        },
      },
    },
  },
];

function App() {
  return <TabsContainer routeConfigs={TAB_CONFIGS} />;
}

export default App;
