import React, { useState } from 'react';

import { TabBarControllerMode } from 'react-native-screens';
import ConfigWrapperContext, {
  type Configuration,
  DEFAULT_GLOBAL_CONFIGURATION,
} from '../../shared/gamma/containers/bottom-tabs/ConfigWrapperContext';
import {
  BottomTabsContainer,
  type TabConfiguration,
} from '../../shared/gamma/containers/bottom-tabs/BottomTabsContainer';
import { CenteredLayoutView } from '../../shared/CenteredLayoutView';
import { I18nManager, Text } from 'react-native';
import { Button } from '../../shared';

function makeTab(title: string) {
  return function Tab() {
    return (
      <CenteredLayoutView>
        <Text>{title}</Text>
        <Button title={'Direction is ' + (I18nManager.isRTL ? 'RTL' : 'LTR')} />
      </CenteredLayoutView>
    );
  };
}

function App() {
  const [config, setConfig] = React.useState<Configuration>(
    DEFAULT_GLOBAL_CONFIGURATION,
  );

  const TAB_CONFIGS: TabConfiguration[] = [
    {
      tabScreenProps: {
        tabKey: 'Tab1',
        title: 'قائمة ١',
        freezeContents: false,
        icon: {
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
          ios: {
            type: 'sfSymbol',
            name: 'snow',
          },
        },
      },
      component: makeTab('Tab 2'),
    },
  ];

  return (
    <ConfigWrapperContext.Provider
      value={{
        config,
        setConfig,
      }}>
      <BottomTabsContainer tabConfigs={TAB_CONFIGS} />
    </ConfigWrapperContext.Provider>
  );
}

export default App;
