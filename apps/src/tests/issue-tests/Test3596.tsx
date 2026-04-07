import React from 'react';

import { enableFreeze } from 'react-native-screens';
import ConfigWrapperContext, {
  type Configuration,
  DEFAULT_GLOBAL_CONFIGURATION,
} from '@apps/shared/gamma/containers/tabs/ConfigWrapperContext';
import {
  TabsContainer,
  type TabRouteConfig,
} from '@apps/shared/gamma/containers/tabs';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { Text } from 'react-native';
import Colors from '@apps/shared/styling/Colors';

enableFreeze(true);

const ICON = require('@assets/variableIcons/globe_oversized.png');

function makeTab(title: string) {
  return function Tab() {
    return (
      <CenteredLayoutView style={{ backgroundColor: Colors.PurpleLight60 }}>
        <Text>{title}</Text>
      </CenteredLayoutView>
    );
  };
}

const TAB_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Tab1',
    Component: makeTab('Tab 1'),
    options: {
      title: 'Tab 1',
      ios: {
        icon: {
          type: 'imageSource',
          imageSource: ICON,
        },
      },
      android: {
        icon: {
          type: 'imageSource',
          imageSource: ICON,
        },
      },
    },
  },
  {
    name: 'Tab2',
    Component: makeTab('Tab 2'),
    options: {
      title: 'Tab 2',
      ios: {
        icon: {
          type: 'imageSource',
          imageSource: ICON,
        },
      },
      android: {
        icon: {
          type: 'imageSource',
          imageSource: ICON,
        },
      },
    },
  },
  {
    name: 'Tab3',
    Component: makeTab('Tab 3'),
    options: {
      title: 'Tab 3',
      ios: {
        systemItem: 'search',
      },
    },
  },
];

function App() {
  const [config, setConfig] = React.useState<Configuration>(
    DEFAULT_GLOBAL_CONFIGURATION,
  );

  return (
    <ConfigWrapperContext.Provider
      value={{
        config,
        setConfig,
      }}>
      <TabsContainer routeConfigs={TAB_CONFIGS} />
    </ConfigWrapperContext.Provider>
  );
}

export default App;
