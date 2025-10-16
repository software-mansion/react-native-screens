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
        ios: {
          type: 'sfSymbol',
          name: 'house.fill',
        }, 
        android: {
          type: 'imageSource',
          imageSource: require('../../../assets/variableIcons/icon_fill.png'),
        }
      },
      selectedIcon: {
        type: 'sfSymbol',
        name: 'house.fill',
      },
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
        ios: {
          type: 'templateSource',
          templateSource: require('../../../assets/variableIcons/icon.png'),
        }, 
        android: {
          type: 'drawableResource',
          name: 'sym_call_missed',
        }
      },
      selectedIcon: {
        type: 'templateSource',
        templateSource: require('../../../assets/variableIcons/icon_fill.png'),
      },
      title: 'Tab2',
      orientation: 'landscape',
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
      badgeValue: '2137',
      scrollEdgeEffects: { bottom: 'hard' },
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
        shared: {
          type: 'imageSource',
          imageSource: require('../../../assets/variableIcons/icon.png'),
        }
      },
      selectedIcon: {
        type: 'imageSource',
        imageSource: require('../../../assets/variableIcons/icon_fill.png'),
      },
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
        ios: {
          type: 'sfSymbol',
          name: 'rectangle.stack',
        },
        android: {
          type: 'drawableResource',
          name: 'custom_home_icon'
        }
      },
      selectedIcon: {
        type: 'sfSymbol',
        name: 'rectangle.stack.fill',
      },
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
      <BottomTabsContainer
        tabConfigs={TAB_CONFIGS}
        tabBarBackgroundColor={Colors.NavyLight100}
        tabBarItemActiveIndicatorColor={Colors.GreenLight40}
        tabBarItemActiveIndicatorEnabled={true}
        tabBarTintColor={Colors.YellowLight100}
        tabBarItemIconColor={Colors.BlueLight100}
        tabBarItemTitleFontColor={Colors.BlueLight40}
        tabBarItemIconColorActive={Colors.GreenLight100}
        tabBarItemTitleFontColorActive={Colors.GreenLight40}
        tabBarItemTitleFontSize={10}
        tabBarItemTitleFontSizeActive={15}
        tabBarItemRippleColor={Colors.WhiteTransparentDark}
        tabBarItemTitleFontFamily="monospace"
        tabBarItemTitleFontStyle="italic"
        tabBarItemTitleFontWeight="700"
        tabBarItemLabelVisibilityMode="auto"
        tabBarMinimizeBehavior="onScrollDown"
      />
    </ConfigWrapperContext.Provider>
  );
}

export default App;
