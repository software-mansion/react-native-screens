import React from 'react';
import { Text, View } from 'react-native';
import { BottomTabsContainer } from '../../../shared/gamma/containers/bottom-tabs/BottomTabsContainer';
import { Scenario } from '../../shared/helpers';
import {
  TabsScreenAppearance,
  TabsScreenAppearanceAndroid,
} from 'react-native-screens';
import Colors from '../../../shared/styling/Colors';

const SCENARIO: Scenario = {
  name: 'Tab Bar Appearance',
  key: 'test-tabs-appearance-defined-by-selected-tab',
  platforms: ['ios', 'android'],
  AppComponent: App,
};

export default SCENARIO;

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

const DEFAULT_APPEARANCE_IOS: TabsScreenAppearance = {
  tabBarBackgroundColor: Colors.NavyLight100,
  tabBarBlurEffect: 'systemDefault',
  stacked: {
    normal: {
      tabBarItemIconColor: Colors.BlueLight100,
      tabBarItemTitleFontColor: Colors.BlueLight40,
      tabBarItemTitleFontSize: 12,
      tabBarItemTitleFontFamily: 'Courier',
      tabBarItemTitleFontStyle: 'italic',
      tabBarItemTitleFontWeight: '700',
      tabBarItemBadgeBackgroundColor: Colors.RedDark40,
    },
    selected: {
      tabBarItemIconColor: Colors.GreenLight100,
      tabBarItemTitleFontColor: Colors.GreenLight40,
    },
    focused: {
      tabBarItemIconColor: Colors.YellowDark100,
      tabBarItemTitleFontColor: Colors.YellowDark40,
    },
  },
};

function TabScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Tab</Text>
    </View>
  );
}

export function App() {
  return (
    <BottomTabsContainer
      tabConfigs={[
        {
          component: TabScreen,
          tabScreenProps: {
            tabKey: 'Tab1',
            title: 'Tab1',
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
              },
            },
            standardAppearanceAndroid: DEFAULT_APPEARANCE_ANDROID,
            standardAppearance: DEFAULT_APPEARANCE_IOS,
            scrollEdgeAppearance: DEFAULT_APPEARANCE_IOS,
          },
        },
        {
          component: TabScreen,
          tabScreenProps: {
            tabKey: 'Tab2',
            title: 'Tab2',
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
            standardAppearanceAndroid: {
              ...DEFAULT_APPEARANCE_ANDROID,
              tabBarBackgroundColor: Colors.PurpleDark100,
              tabBarItemRippleColor: Colors.PurpleDark40,
              normal: {
                tabBarItemIconColor: Colors.YellowDark100,
                tabBarItemTitleFontColor: Colors.YellowDark40,
              },
              selected: {
                tabBarItemIconColor: Colors.RedDark100,
                tabBarItemTitleFontColor: Colors.RedDark40,
              },
              focused: {
                tabBarItemIconColor: Colors.RedLight100,
                tabBarItemTitleFontColor: Colors.RedLight40,
              },
              tabBarItemActiveIndicatorColor: Colors.PurpleDark120,
            },
            standardAppearance: {
              ...DEFAULT_APPEARANCE_IOS,
              tabBarBackgroundColor: Colors.PurpleDark100,
              stacked: {
                ...DEFAULT_APPEARANCE_IOS.stacked,
                normal: {
                  ...DEFAULT_APPEARANCE_IOS.stacked?.normal,
                  tabBarItemIconColor: Colors.YellowDark100,
                  tabBarItemTitleFontColor: Colors.YellowDark40,
                },
                selected: {
                  ...DEFAULT_APPEARANCE_IOS.stacked?.selected,
                  tabBarItemIconColor: Colors.RedDark100,
                  tabBarItemTitleFontColor: Colors.RedDark40,
                },
                focused: {
                  ...DEFAULT_APPEARANCE_IOS.stacked?.focused,
                  tabBarItemIconColor: Colors.RedLight100,
                  tabBarItemTitleFontColor: Colors.RedLight40,
                },
              },
            },
            scrollEdgeAppearance: {
              ...DEFAULT_APPEARANCE_IOS,
              tabBarBackgroundColor: Colors.PurpleDark100,
              stacked: {
                ...DEFAULT_APPEARANCE_IOS.stacked,
                normal: {
                  ...DEFAULT_APPEARANCE_IOS.stacked?.normal,
                  tabBarItemIconColor: Colors.YellowDark100,
                  tabBarItemTitleFontColor: Colors.YellowDark40,
                },
                selected: {
                  ...DEFAULT_APPEARANCE_IOS.stacked?.selected,
                  tabBarItemIconColor: Colors.RedDark100,
                  tabBarItemTitleFontColor: Colors.RedDark40,
                },
                focused: {
                  ...DEFAULT_APPEARANCE_IOS.stacked?.focused,
                  tabBarItemIconColor: Colors.RedLight100,
                  tabBarItemTitleFontColor: Colors.RedLight40,
                },
              },
            },
          },
        },
        {
          component: TabScreen,
          tabScreenProps: {
            tabKey: 'Tab3',
            title: 'Tab3',
            icon: {
              ios: {
                type: 'templateSource',
                templateSource: require('../../../../assets/variableIcons/icon_fill.png'),
              },
              android: {
                type: 'imageSource',
                imageSource: require('../../../../assets/variableIcons/icon_fill.png'),
              }
            },
            standardAppearanceAndroid: {
              ...DEFAULT_APPEARANCE_ANDROID,
              tabBarItemBadgeTextColor: Colors.GreenDark120,
              tabBarItemBadgeBackgroundColor: Colors.GreenDark40,
            },
            standardAppearance: {
              ...DEFAULT_APPEARANCE_IOS,
              stacked: {
                ...DEFAULT_APPEARANCE_IOS.stacked,
                normal: {
                  ...DEFAULT_APPEARANCE_IOS.stacked?.normal,
                  tabBarItemBadgeBackgroundColor: Colors.GreenDark40,
                },
              },
            },
            scrollEdgeAppearance: {
              ...DEFAULT_APPEARANCE_IOS,
              stacked: {
                ...DEFAULT_APPEARANCE_IOS.stacked,
                normal: {
                  ...DEFAULT_APPEARANCE_IOS.stacked?.normal,
                  tabBarItemBadgeBackgroundColor: Colors.GreenDark40,
                },
              },
            },
          },
        },
      ]}
    />
  );
}
