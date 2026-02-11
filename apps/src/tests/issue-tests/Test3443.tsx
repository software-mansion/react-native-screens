import React from 'react';

import {
  BottomTabsContainer,
  type TabConfiguration,
} from '../../shared/gamma/containers/bottom-tabs/BottomTabsContainer';
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

const TAB_CONFIGS: TabConfiguration[] = [
  {
    tabScreenProps: {
      tabKey: 'Tab1',
      title: 'Tab 1',
      icon: {
        ios: {
          type: 'xcasset',
          name: 'custom-icon',
        },
      },
    },
    component: makeTab(
      'Tab 1',
      'Tab icon is from Xcassets.\nOnly icon prop is defined.',
    ),
  },
  {
    tabScreenProps: {
      tabKey: 'Tab2',
      title: 'Tab 2',
      icon: {
        ios: {
          type: 'xcasset',
          name: 'custom-icon',
        },
      },
      selectedIcon: {
        ios: {
          type: 'xcasset',
          name: 'custom-icon-fill',
        }
      },
    },
    component: makeTab(
      'Tab 2',
      'Tab icon is from Xcassets.\nBoth icon and selectedIcon props are defined.',
    ),
  },
];

function App() {
  return <BottomTabsContainer tabConfigs={TAB_CONFIGS} />;
}

export default App;
