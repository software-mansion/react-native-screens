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
import { Tab1, Tab2, Tab3, Tab4 } from './tabs';
import { internalEnableDetailedBottomTabsLogging } from 'react-native-screens/private';

enableFreeze(true);
internalEnableDetailedBottomTabsLogging();

const TAB_CONFIGS: TabConfiguration[] = [
  {
    tabScreenProps: {
      tabKey: 'Tab1',
      title: 'Tab1',
      isFocused: true,
      icon: {
        sfSymbolName: 'house',
      },
      selectedIcon: {
        sfSymbolName: 'house.fill',
      },
    },
    component: Tab1,
  },
  {
    tabScreenProps: {
      tabKey: 'Tab2',
      icon: {
        templateSource: require('../../../assets/variableIcons/icon.png'),
      },
      selectedIcon: {
        templateSource: require('../../../assets/variableIcons/icon_fill.png'),
      },
      title: 'Tab2',
    },
    component: Tab2,
    safeAreaConfiguration: {
      edges: {
        top: true,
        bottom: true,
      },
    },
  },
  {
    tabScreenProps: {
      tabKey: 'Tab3',
      icon: {
        imageSource: require('../../../assets/variableIcons/icon.png'),
      },
      selectedIcon: {
        imageSource: require('../../../assets/variableIcons/icon_fill.png'),
      },
      title: 'Tab3',
    },
    component: Tab3,
  },
  {
    tabScreenProps: {
      tabKey: 'Tab4',
      icon: {
        sfSymbolName: 'rectangle.stack',
      },
      selectedIcon: {
        sfSymbolName: 'rectangle.stack.fill',
      },
      title: 'Tab4',
    },
    component: Tab4,
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
      <BottomTabsContainer
        tabConfigs={TAB_CONFIGS}
        tabBarMinimizeBehavior="onScrollDown"
      />
    </ConfigWrapperContext.Provider>
  );
}

export default App;
