import React from 'react';

import {
  BottomTabsContainer,
  type TabConfiguration,
} from '../../shared/gamma/containers/bottom-tabs/BottomTabsContainer';
import { CenteredLayoutView } from '../../shared/CenteredLayoutView';
import { I18nManager, Text } from 'react-native';

function makeTab(title: string) {
  return function Tab() {
    return (
      <CenteredLayoutView>
        <Text>{title}</Text>
        <Text style={{ fontWeight: 'bold' }}>
          {'Direction is ' + (I18nManager.isRTL ? 'RTL' : 'LTR')}
        </Text>
      </CenteredLayoutView>
    );
  };
}

function App() {
  const TAB_CONFIGS: TabConfiguration[] = [
    {
      tabScreenProps: {
        tabKey: 'Tab1',
        title: 'قائمة ١',
        icon: {
          android: {
            type: 'drawableResource',
            name: 'sym_call_missed',
          },
          ios: {
            type: 'sfSymbol',
            name: 'sun.max',
          },
        },
      },
      component: makeTab('Tab 1'),
    },
    {
      tabScreenProps: {
        tabKey: 'Tab2',
        title: 'قائمة ٢',
        icon: {
          android: {
            type: 'drawableResource',
            name: 'sym_call_incoming',
          },
          ios: {
            type: 'sfSymbol',
            name: 'snow',
          },
        },
      },
      component: makeTab('Tab 2'),
    },
  ];

  return <BottomTabsContainer tabConfigs={TAB_CONFIGS} />;
}

export default App;
