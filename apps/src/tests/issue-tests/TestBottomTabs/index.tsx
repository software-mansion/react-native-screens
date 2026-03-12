import React from 'react';

import {
  enableFreeze,
  TabsScreenAppearanceAndroid,
} from 'react-native-screens';
import ConfigWrapperContext, {
  type Configuration,
  DEFAULT_GLOBAL_CONFIGURATION,
} from '../../../shared/gamma/containers/bottom-tabs/ConfigWrapperContext';
import {
  BottomTabsContainer,
  type TabConfiguration,
} from '../../../shared/gamma/containers/bottom-tabs/BottomTabsContainer';
import { Tab1, Tab2, Tab3, Tab4 } from './tabs';
import Colors from '../../../shared/styling/Colors';

enableFreeze(true);

const DEFAULT_APPEARANCE_ANDROID: TabsScreenAppearanceAndroid = {
  tabBarBackgroundColor: Colors.NavyLight100,
  tabBarItemRippleColor: Colors.WhiteTransparentDark,
  tabBarItemLabelVisibilityMode: 'auto',
  normal: {
    tabBarItemIconColor: Colors.BlueLight100,
    tabBarItemTitleFontColor: Colors.BlueLight40,
  },
  selected: {
    tabBarItemIconColor: Colors.GreenLight100,
    tabBarItemTitleFontColor: Colors.GreenLight40,
  },
  focused: {
    tabBarItemIconColor: Colors.YellowDark100,
    tabBarItemTitleFontColor: Colors.YellowDark40,
  },
  tabBarItemActiveIndicatorEnabled: true,
  tabBarItemActiveIndicatorColor: Colors.GreenLight40,
  tabBarItemTitleSmallLabelFontSize: 10,
  tabBarItemTitleLargeLabelFontSize: 16,
  tabBarItemTitleFontFamily: 'monospace',
  tabBarItemTitleFontStyle: 'italic',
  tabBarItemTitleFontWeight: 700,
  tabBarItemBadgeTextColor: Colors.RedDark120,
  tabBarItemBadgeBackgroundColor: Colors.RedDark40,
};

const TAB_CONFIGS: TabConfiguration[] = [
  {
    tabScreenProps: {
      android: {
        standardAppearance: DEFAULT_APPEARANCE_ANDROID,
        icon: {
          type: 'imageSource',
          imageSource: require('../../../../assets/variableIcons/icon.png'),
        },
        selectedIcon: {
          type: 'imageSource',
          imageSource: require('../../../../assets/variableIcons/icon_fill.png'),
        },
      },
      ios: {
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
        icon: {
          type: 'sfSymbol',
          name: 'house.fill',
        },
        selectedIcon: {
          type: 'sfSymbol',
          name: 'house.fill',
        },
      },

      testID: 'tab-screen-1-id',
      accessibilityLabel: 'First Tab Screen',
      tabBarItemTestID: 'tab-item-1-id',
      tabBarItemAccessibilityLabel: 'First Tab Item',
      screenKey: 'Tab1',
      title: 'Tab1',
      isFocused: true,
    },
    component: Tab1,
  },
  {
    tabScreenProps: {
      screenKey: 'Tab2',
      badgeValue: 'NEW',
      testID: 'tab-screen-2-id',
      accessibilityLabel: 'Second Tab Screen',
      tabBarItemTestID: 'tab-item-2-id',
      tabBarItemAccessibilityLabel: 'Second Tab Item',
      android: {
        standardAppearance: DEFAULT_APPEARANCE_ANDROID,
        icon: {
          type: 'drawableResource',
          name: 'sym_call_missed',
        },
        selectedIcon: {
          type: 'drawableResource',
          name: 'sym_call_incoming',
        },
      },
      ios: {
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
        icon: {
          type: 'templateSource',
          templateSource: require('../../../../assets/variableIcons/icon.png'),
        },
        selectedIcon: {
          type: 'templateSource',
          templateSource: require('../../../../assets/variableIcons/icon_fill.png'),
        },
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
      screenKey: 'Tab3',
      badgeValue: '2137',
      testID: 'tab-screen-3-id',
      accessibilityLabel: 'Third Tab Screen',
      tabBarItemTestID: 'tab-item-3-id',
      tabBarItemAccessibilityLabel: 'Third Tab Item',
      ios: {
        scrollEdgeEffects: { bottom: 'hard' },
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
          type: 'imageSource',
          imageSource: require('../../../../assets/variableIcons/icon.png'),
        },
        selectedIcon: {
          type: 'imageSource',
          imageSource: require('../../../../assets/variableIcons/icon_fill.png'),
        },
      },
      android: {
        standardAppearance: DEFAULT_APPEARANCE_ANDROID,
        icon: {
          type: 'imageSource',
          imageSource: require('../../../../assets/variableIcons/icon.png'),
        },
        selectedIcon: {
          type: 'imageSource',
          imageSource: require('../../../../assets/variableIcons/icon_fill.png'),
        },
      },
      title: 'Tab3',
      // systemItem: 'search', // iOS specific
      // systemItem: 'contacts', // iOS specific
      // systemItem: 'history', // iOS specific
    },
    component: Tab3,
  },
  {
    tabScreenProps: {
      screenKey: 'Tab4',
      testID: 'tab-screen-4-id',
      accessibilityLabel: 'Fourth Tab Screen',
      tabBarItemTestID: 'tab-item-4-id',
      tabBarItemAccessibilityLabel: 'Fourth Tab Item',
      android: {
        standardAppearance: DEFAULT_APPEARANCE_ANDROID,
        icon: {
          type: 'drawableResource',
          name: 'custom_home_icon',
        },
        selectedIcon: {
          type: 'drawableResource',
          name: 'custom_home_icon',
        },
      },
      ios: {
        icon: {
          type: 'sfSymbol',
          name: 'rectangle.stack',
        },
        selectedIcon: {
          type: 'sfSymbol',
          name: 'rectangle.stack.fill',
        },
        systemItem: 'search', // iOS specific
      },
      title: 'Tab4',

      badgeValue: '123',
      specialEffects: {
        repeatedTabSelection: {
          popToRoot: false,
        },
      },
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
        ios={{
          tabBarTintColor: Colors.YellowLight100,
          tabBarMinimizeBehavior: 'onScrollDown',
        }}
      />
    </ConfigWrapperContext.Provider>
  );
}

export default App;
