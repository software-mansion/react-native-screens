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
import Colors from '../../shared/styling/Colors';
import { internalEnableDetailedBottomTabsLogging } from 'react-native-screens/private';

enableFreeze(true);
internalEnableDetailedBottomTabsLogging();

const TAB_CONFIGS: TabConfiguration[] = [
  {
    tabScreenProps: {
      scrollEdgeAppearance: {
        tabBarBackgroundColor: Colors.NavyLight100,
        stacked: {
          normal: {
            tabBarItemIconColor: Colors.NavyLight60,
          },
          selected: {
            tabBarItemIconColor: Colors.NavyLight20,
            tabBarItemTitleFontColor: Colors.NavyLight20,
          },
        },
      },
      tabKey: 'Tab1',
      title: 'Tab1',
      isFocused: true,
      icon: {
        sfSymbolName: 'house',
      },
      selectedIcon: {
        sfSymbolName: 'house.fill',
      },
      // iconResourceName: 'sym_call_incoming', // Android specific
      iconResource: require('../../../assets/variableIcons/icon_fill.png'),
    },
    component: Tab1,
  },
  {
    tabScreenProps: {
      tabKey: 'Tab2',
      badgeValue: 'NEW',
      scrollEdgeAppearance: {
        tabBarBackgroundColor: Colors.NavyDark140,
        stacked: {
          normal: {
            tabBarItemBadgeBackgroundColor: Colors.GreenDark100,
            tabBarItemTitleFontSize: 20,
            tabBarItemTitleFontStyle: 'italic',
            tabBarItemTitleFontColor: Colors.RedDark120,
            tabBarItemTitleFontWeight: 'bold',
            tabBarItemTitleFontFamily: 'Baskerville',
            tabBarItemTitlePositionAdjustment: {
              vertical: 8,
            },
            tabBarItemIconColor: Colors.RedDark120,
          },
        },
        inline: {
          normal: {
            tabBarItemBadgeBackgroundColor: Colors.GreenDark100,
            tabBarItemTitleFontSize: 20,
            tabBarItemTitleFontStyle: 'italic',
            tabBarItemTitleFontColor: Colors.RedDark120,
            tabBarItemTitleFontWeight: 'bold',
            tabBarItemTitleFontFamily: 'Baskerville',
            tabBarItemTitlePositionAdjustment: {
              vertical: 4,
            },
            tabBarItemIconColor: Colors.RedDark120,
          },
        },
        compactInline: {
          normal: {
            tabBarItemBadgeBackgroundColor: Colors.GreenDark100,
            tabBarItemTitleFontSize: 20,
            tabBarItemTitleFontStyle: 'italic',
            tabBarItemTitleFontColor: Colors.RedDark120,
            tabBarItemTitleFontWeight: 'bold',
            tabBarItemTitleFontFamily: 'Baskerville',
            tabBarItemTitlePositionAdjustment: {
              vertical: 4,
            },
            tabBarItemIconColor: Colors.RedDark120,
          },
        },
      },
      tabBarItemBadgeBackgroundColor: Colors.GreenDark100,
      icon: {
        templateSource: require('../../../assets/variableIcons/icon.png'),
      },
      selectedIcon: {
        templateSource: require('../../../assets/variableIcons/icon_fill.png'),
      },
      iconResourceName: 'sym_call_missed', // Android specific
      iconResource: require('../../../assets/variableIcons/icon.png'),
      title: 'Tab2',
      orientation: 'landscape',
    },
    component: Tab2,
  },
  {
    tabScreenProps: {
      tabKey: 'Tab3',
      badgeValue: '2137',
      tabBarItemBadgeBackgroundColor: Colors.RedDark40,
      tabBarItemBadgeTextColor: Colors.RedDark120,
      standardAppearance: {
        stacked: {
          normal: {
            tabBarItemBadgeBackgroundColor: Colors.RedDark40,
          },
        },
      },
      scrollEdgeAppearance: {
        tabBarShadowColor: 'red',
        tabBarBackgroundColor: 'transparent',
        tabBarBlurEffect: 'none',
      },
      icon: {
        imageSource: require('../../../assets/variableIcons/icon.png'),
      },
      selectedIcon: {
        imageSource: require('../../../assets/variableIcons/icon_fill.png'),
      },
      // iconResourceName: 'sym_action_email', // Android specific
      iconResource: require('../../../assets/variableIcons/icon_fill.png'),
      title: 'Tab3',
      // systemItem: 'search', // iOS specific
      // systemItem: 'contacts', // iOS specific
      // systemItem: 'history', // iOS specific
      orientation: 'portrait',
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
      // iconResourceName: 'sym_action_chat', // Android specific
      iconResource: require('../../../assets/svg/cart.svg'),
      title: 'Tab4',
      systemItem: 'search', // iOS specific
      badgeValue: '123',
      orientation: 'portrait',
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
      <BottomTabsContainer tabConfigs={TAB_CONFIGS} />
    </ConfigWrapperContext.Provider>
  );
}

export default App;
