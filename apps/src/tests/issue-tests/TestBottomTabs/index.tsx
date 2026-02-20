import React from 'react';

import { AndroidTabsAppearance, enableFreeze } from 'react-native-screens';
import ConfigWrapperContext, {
  type Configuration,
  DEFAULT_GLOBAL_CONFIGURATION,
} from '../../../shared/gamma/containers/bottom-tabs/ConfigWrapperContext'
import {
  BottomTabsContainer,
  type TabConfiguration,
} from '../../../shared/gamma/containers/bottom-tabs/BottomTabsContainer'
import { Tab1, Tab2, Tab3, Tab4 } from './tabs';
import Colors from '../../../shared/styling/Colors'
import { internalEnableDetailedBottomTabsLogging } from 'react-native-screens/private';

enableFreeze(true);
internalEnableDetailedBottomTabsLogging();

const DEFAULT_APPEARANCE_ANDROID: AndroidTabsAppearance = {
  backgroundColor: Colors.NavyLight100,
  itemRippleColor: Colors.WhiteTransparentDark,
  labelVisibilityMode: 'auto',
  itemColors: {
    normal: {
      iconColor: Colors.BlueLight100,
      titleColor: Colors.BlueLight40,
    },
    selected: {
      iconColor: Colors.GreenLight100,
      titleColor: Colors.GreenLight40,
    },
    focused: {
      iconColor: Colors.YellowDark100,
      titleColor: Colors.YellowDark40,
    }
  },
  activeIndicator: {
    enabled: true,
    color: Colors.GreenLight40,
  },
  typography: {
    fontSizeSmall: 10,
    fontSizeLarge: 16,
    fontFamily: 'monospace',
    fontStyle: 'italic',
    fontWeight: 700,
  },
  badge: {
    textColor: Colors.RedDark120,
    backgroundColor: Colors.RedDark40,
  }
}

const TAB_CONFIGS: TabConfiguration[] = [
  {
    tabScreenProps: {
      standardAppearanceAndroid: DEFAULT_APPEARANCE_ANDROID,
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
      testID: 'tab-screen-1-id',
      accessibilityLabel: 'First Tab Screen',
      tabBarItemTestID: 'tab-item-1-id',
      tabBarItemAccessibilityLabel: 'First Tab Item',
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
          imageSource: require('../../../../assets/variableIcons/icon.png'),
        },
      },
      selectedIcon: {
        ios: {
          type: 'sfSymbol',
          name: 'house.fill',
        }, 
        android: {
          type: 'imageSource',
          imageSource: require('../../../../assets/variableIcons/icon_fill.png'),
        }
      },
    },
    component: Tab1,
  },
  {
    tabScreenProps: {
      tabKey: 'Tab2',
      badgeValue: 'NEW',
      testID: 'tab-screen-2-id',
      accessibilityLabel: 'Second Tab Screen',
      tabBarItemTestID: 'tab-item-2-id',
      tabBarItemAccessibilityLabel: 'Second Tab Item',
      standardAppearanceAndroid: DEFAULT_APPEARANCE_ANDROID,
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
        ios: {
          type: 'templateSource',
          templateSource: require('../../../../assets/variableIcons/icon.png'),
        },
        android: {
          type: 'drawableResource',
          name: 'sym_call_missed',
        },
      },
      selectedIcon: {
        ios: {
          type: 'templateSource',
          templateSource: require('../../../../assets/variableIcons/icon_fill.png'),
        },
        android: {
          type: 'drawableResource',
          name: 'sym_call_incoming',
        }
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
      badgeValue: '2137',
      testID: 'tab-screen-3-id',
      accessibilityLabel: 'Third Tab Screen',
      tabBarItemTestID: 'tab-item-3-id',
      tabBarItemAccessibilityLabel: 'Third Tab Item',
      scrollEdgeEffects: { bottom: 'hard' },
      standardAppearanceAndroid: DEFAULT_APPEARANCE_ANDROID,
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
          imageSource: require('../../../../assets/variableIcons/icon.png'),
        },
      },
      selectedIcon: {
        shared: {
          type: 'imageSource',
          imageSource: require('../../../../assets/variableIcons/icon_fill.png'),
        }
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
      tabKey: 'Tab4',
      testID: 'tab-screen-4-id',
      accessibilityLabel: 'Fourth Tab Screen',
      tabBarItemTestID: 'tab-item-4-id',
      tabBarItemAccessibilityLabel: 'Fourth Tab Item',
      icon: {
        ios: {
          type: 'sfSymbol',
          name: 'rectangle.stack',
        },
        android: {
          type: 'drawableResource',
          name: 'custom_home_icon',
        },
      },
      selectedIcon: {
        ios: {
          type: 'sfSymbol',
          name: 'rectangle.stack.fill',
        },
        android: {
          type: 'drawableResource',
          name: 'custom_home_icon',
        },
      },
      title: 'Tab4',
      systemItem: 'search', // iOS specific
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
        tabBarTintColor={Colors.YellowLight100}
        tabBarMinimizeBehavior="onScrollDown"
      />
    </ConfigWrapperContext.Provider>
  );
}

export default App;
