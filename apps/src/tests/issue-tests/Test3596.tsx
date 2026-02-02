import React from 'react';

import { enableFreeze } from 'react-native-screens';
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
import Colors from '../../shared/styling/Colors';

enableFreeze(true);

const ICON = require('../../../assets/variableIcons/globe_oversized.png');

function makeTab(title: string) {
  return function Tab() {
    return (
      <CenteredLayoutView style={{backgroundColor: Colors.PurpleLight60}}>
        <Text>{title}</Text>
      </CenteredLayoutView>
    );
  };
}

const TAB_CONFIGS: TabConfiguration[] = [
  {
    tabScreenProps: {
      tabKey: 'Tab1',
      title: 'Tab 1',
      icon: {
        shared: {
          type: 'imageSource',
          imageSource: ICON,
        },
      },
    },
    component: makeTab('Tab 1'),
  },
  {
    tabScreenProps: {
      tabKey: 'Tab2',
      title: 'Tab 2',
      icon: {
        shared: {
          type: 'imageSource',
          imageSource: ICON,
        },
      },
    },
    component: makeTab('Tab 2'),
  },
  {
    tabScreenProps: {
      tabKey: 'Tab3',
      title: 'Tab 3',
      systemItem: 'search',
    },
    component: makeTab('Tab 3'),
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
      <BottomTabsContainer tabConfigs={TAB_CONFIGS} />
    </ConfigWrapperContext.Provider>
  );
}

export default App;
