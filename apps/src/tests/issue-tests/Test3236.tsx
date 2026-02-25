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
import { Text } from 'react-native';
import { Button } from '../../shared';

function makeTab(
  title: string,
  controllerMode: TabBarControllerMode,
  setControllerMode: (mode: TabBarControllerMode) => void,
) {
  return function Tab() {
    return (
      <CenteredLayoutView>
        <Text>{title}</Text>
        <Button
          title={`Change mode (currently ${controllerMode})`}
          onPress={() => {
            switch (controllerMode) {
              case 'automatic':
                setControllerMode('tabBar');
                break;
              case 'tabBar':
                setControllerMode('tabSidebar');
                break;
              default:
                setControllerMode('automatic');
                break;
            }
          }}
        />
      </CenteredLayoutView>
    );
  };
}

function App() {
  const [config, setConfig] = React.useState<Configuration>(
    DEFAULT_GLOBAL_CONFIGURATION,
  );

  const [controllerMode, setControllerMode] =
    useState<TabBarControllerMode>('automatic');

  const TAB_CONFIGS: TabConfiguration[] = [
    {
      tabScreenProps: {
        tabKey: 'Tab1',
        title: 'Tab 1',
        icon: {
          ios: {
            type: 'sfSymbol',
            name: 'sun.max',
          },
          android: {
            type: 'drawableResource',
            name: 'sunny',
          },
        },
      },
      component: makeTab('Tab 1', controllerMode, setControllerMode),
    },
    {
      tabScreenProps: {
        tabKey: 'Tab2',
        title: 'Tab 2',
        icon: {
          ios: {
            type: 'sfSymbol',
            name: 'snow',
          },
          android: {
            type: 'drawableResource',
            name: 'mode_cool',
          },
        },
      },
      component: makeTab('Tab 2', controllerMode, setControllerMode),
    },
  ];

  return (
    <ConfigWrapperContext.Provider
      value={{
        config,
        setConfig,
      }}>
      <BottomTabsContainer
        tabConfigs={TAB_CONFIGS}
        tabBarControllerMode={controllerMode}
      />
    </ConfigWrapperContext.Provider>
  );
}

export default App;
