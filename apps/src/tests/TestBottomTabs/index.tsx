import React from 'react';

import { enableFreeze } from 'react-native-screens';
import ConfigWrapperContext, {
  type Configuration,
  DEFAULT_GLOBAL_CONFIGURATION,
} from './ConfigWrapperContext';
import {
  BottomTabsContainer,
  type TabConfiguration,
} from './BottomTabsContainer';
import { Tab1, Tab2, Tab3 } from './tabs';
import Colors from '../../shared/styling/Colors';

enableFreeze(true);

const TAB_CONFIGS: TabConfiguration[] = [
  {
    tabScreenProps: {
      tabKey: 'Tab1',
      badgeValue: '1',
      title: 'Tab1',
      isFocused: true,
      iconSFSymbolName: 'house',
      selectedIconSFSymbolName: 'house.fill',
    },
    contentViewRenderFn: Tab1,
  },
  {
    tabScreenProps: {
      tabKey: 'Tab2',
      badgeValue: '2',
      tabBarItemBadgeBackgroundColor: Colors.PurpleLight100,
      tabBarBackgroundColor: Colors.NavyDark140,
      tabBarItemTitleFontSize: 20,
      tabBarItemTitleFontStyle: 'italic',
      tabBarItemTitleFontColor: Colors.RedDark120,
      tabBarItemTitleFontWeight: 'bold',
      tabBarItemTitleFontFamily: 'Baskerville',
      tabBarItemTitlePositionAdjustment: {
        vertical: 8,
      },
      iconSFSymbolName: 'text.bubble',
      selectedIconSFSymbolName: 'text.bubble.fill',
      tabBarItemIconColor: Colors.RedDark120,
      title: 'Tab2',
    },
    contentViewRenderFn: Tab2,
  },
  {
    tabScreenProps: {
      tabKey: 'Tab3',
      badgeValue: '3',
      tabBarItemBadgeBackgroundColor: Colors.YellowDark120,
      iconSFSymbolName: 'gear',
      selectedIconSFSymbolName: 'gear',
      title: 'Tab3',
    },
    contentViewRenderFn: Tab3,
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
