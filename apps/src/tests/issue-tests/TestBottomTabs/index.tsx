import React from 'react';

import { TabsAppearanceAndroid, enableFreeze } from 'react-native-screens';
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
import { internalEnableDetailedBottomTabsLogging } from 'react-native-screens/private';

enableFreeze(true);
internalEnableDetailedBottomTabsLogging();

const DEFAULT_APPEARANCE_ANDROID: TabsAppearanceAndroid = {
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
    },
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
  },
};

const TAB_CONFIGS: TabConfiguration[] = [
  {
    tabScreenProps: {
      android: {
        standardAppearance: DEFAULT_APPEARANCE_ANDROID,
        icon: {
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
      android: {
        icon: {
          type: 'imageSource',
          imageSource: require('../../../../assets/variableIcons/icon.png'),
        },
        selectedIcon: {
            type: 'imageSource',
            imageSource: require('../../../../assets/variableIcons/icon_fill.png'),
        },
      },
      testID: 'tab-screen-1-id',
      accessibilityLabel: 'First Tab Screen',
      tabBarItemTestID: 'tab-item-1-id',
      tabBarItemAccessibilityLabel: 'First Tab Item',
      tabKey: 'Tab1',
      title: 'Tab1',
      isFocused: true,
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
      android: {
        standardAppearance: {
          ...DEFAULT_APPEARANCE_ANDROID,
          backgroundColor: Colors.PurpleDark100,
          itemRippleColor: Colors.PurpleDark40,
          itemColors: {
            normal: {
              iconColor: Colors.YellowDark100,
              titleColor: Colors.YellowDark40,
            },
            selected: {
              iconColor: Colors.RedDark100,
              titleColor: Colors.RedDark40,
            },
            focused: {
              iconColor: Colors.RedLight100,
              titleColor: Colors.RedLight40,
            },
          },
          activeIndicator: {
            color: Colors.PurpleDark120,
          },
        },
        icon: {
          type: 'drawableResource',
          name: 'sym_call_missed',
        },
        selectedIcon: {
          type: 'drawableResource',
          name: 'sym_call_incoming',
        }
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
      tabKey: 'Tab3',
      badgeValue: '2137',
      testID: 'tab-screen-3-id',
      accessibilityLabel: 'Third Tab Screen',
      tabBarItemTestID: 'tab-item-3-id',
      tabBarItemAccessibilityLabel: 'Third Tab Item',
      android: {
        standardAppearance: {
          ...DEFAULT_APPEARANCE_ANDROID,
          badge: {
            textColor: Colors.GreenDark120,
            backgroundColor: Colors.GreenDark40,
          },
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
        // systemItem: 'search', // iOS specific
        // systemItem: 'contacts', // iOS specific
        // systemItem: 'history', // iOS specific
      },
      title: 'Tab3',
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
        specialEffects: {
          repeatedTabSelection: {
            popToRoot: false,
          },
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
        specialEffects: {
          repeatedTabSelection: {
            popToRoot: false,
          },
        },
      },
      title: 'Tab4',
      badgeValue: '123',
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
