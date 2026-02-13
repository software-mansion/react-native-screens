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
      title: 'xcasset',
      icon: {
        ios: {
          type: 'xcasset',
          name: 'custom-icon-fill',
        },
      },
    },
    component: makeTab(
      'xcasset',
      'Uses default rendering mode from asset catalog.\nIcon color depends on asset catalog settings.',
    ),
  },
  {
    tabScreenProps: {
      tabKey: 'Tab2',
      title: 'Tinted',
      icon: {
        ios: {
          type: 'xcassetTinted',
          name: 'custom-icon-fill',
        },
      },
    },
    component: makeTab(
      'xcassetTinted',
      'Uses UIImageRenderingModeAlwaysTemplate.\nIcon should respect the tab bar tint color.',
    ),
  },
  {
    tabScreenProps: {
      tabKey: 'Tab3',
      title: 'Original',
      icon: {
        ios: {
          type: 'xcassetOriginal',
          name: 'custom-icon-fill',
        },
      },
    },
    component: makeTab(
      'xcassetOriginal',
      'Uses UIImageRenderingModeAlwaysOriginal.\nIcon should render with its original asset colors.',
    ),
  },
];

function App() {
  return (
    <BottomTabsContainer tabBarTintColor={'red'} tabConfigs={TAB_CONFIGS} />
  );
}

export default App;
