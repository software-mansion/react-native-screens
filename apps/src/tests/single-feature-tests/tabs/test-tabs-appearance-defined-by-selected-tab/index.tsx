import React from 'react';
import { Button, Text, View } from 'react-native';
import {
  TabsContainer,
  useTabsNavigationContext,
} from '@apps/shared/gamma/containers/tabs';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';
import {
  TabsScreenAppearanceAndroid,
  TabsScreenAppearanceIOS,
} from 'react-native-screens';
import { Colors } from '@apps/shared/styling';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';

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
  tabBarItemBadgeTextColor: Colors.White,
  tabBarItemBadgeBackgroundColor: Colors.GreenDark100,
};

const DEFAULT_APPEARANCE_IOS: TabsScreenAppearanceIOS = {
  tabBarBackgroundColor: Colors.NavyLight100,
  tabBarBlurEffect: 'systemDefault',
  stacked: {
    normal: {
      tabBarItemIconColor: Colors.BlueLight100,
      tabBarItemTitleFontColor: Colors.BlueLight40,
      tabBarItemBadgeBackgroundColor: Colors.GreenDark100,
    },
    selected: {
      tabBarItemIconColor: Colors.GreenLight100,
      tabBarItemTitleFontColor: Colors.GreenLight40,
    },
  },
};

const TAB2_APPEARANCE_IOS: TabsScreenAppearanceIOS = {
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
      tabBarItemTitleFontColor: Colors.RedDark80,
      tabBarItemTitleFontStyle: 'italic',
      tabBarItemTitleFontSize: 16,
      tabBarItemTitleFontFamily: 'Courier',
      tabBarItemTitleFontWeight: '700',
    },
  },
};

const TAB3_APPEARANCE_IOS: TabsScreenAppearanceIOS = {
  ...DEFAULT_APPEARANCE_IOS,
  stacked: {
    ...DEFAULT_APPEARANCE_IOS.stacked,
    normal: {
      ...DEFAULT_APPEARANCE_IOS.stacked?.normal,
      tabBarItemBadgeBackgroundColor: Colors.RedDark100,
    },
  },
};

function TabScreen() {
  const navigation = useTabsNavigationContext();
  return (
    <CenteredLayoutView>
      <TabsRouteInformation />
      <Button
        title="Select tab 1"
        onPress={() => navigation.selectTab('Tab1')}
      />
      <Button
        title="Select tab 2"
        onPress={() => navigation.selectTab('Tab2')}
      />
      <Button
        title="Select tab 3"
        onPress={() => navigation.selectTab('Tab3')}
      />
    </CenteredLayoutView>
  );
}

function TabsRouteInformation() {
  const navigation = useTabsNavigationContext();

  return (
    <View>
      <Text>{navigation.routeKey}</Text>
    </View>
  );
}

export function TestTabsAppearanceDefinedBySelectedTab() {
  return (
    <TabsContainer
      routeConfigs={[
        {
          name: 'Tab1',
          Component: TabScreen,
          options: {
            title: 'Tab1',
            ios: {
              icon: {
                type: 'sfSymbol',
                name: 'house.fill',
              },
              selectedIcon: {
                type: 'sfSymbol',
                name: 'house.fill',
              },
              standardAppearance: DEFAULT_APPEARANCE_IOS,
              scrollEdgeAppearance: DEFAULT_APPEARANCE_IOS,
            },
            android: {
              icon: {
                type: 'imageSource',
                imageSource: require('@assets/variableIcons/icon.png'),
              },
              selectedIcon: {
                type: 'imageSource',
                imageSource: require('@assets/variableIcons/icon_fill.png'),
              },
              standardAppearance: DEFAULT_APPEARANCE_ANDROID,
            },
          },
        },
        {
          name: 'Tab2',
          Component: TabScreen,
          options: {
            title: 'Tab2',
            ios: {
              icon: {
                type: 'templateSource',
                templateSource: require('@assets/variableIcons/icon.png'),
              },
              standardAppearance: TAB2_APPEARANCE_IOS,
              scrollEdgeAppearance: TAB2_APPEARANCE_IOS,
            },
            android: {
              icon: {
                type: 'drawableResource',
                name: 'sym_call_missed',
              },
              standardAppearance: {
                ...DEFAULT_APPEARANCE_ANDROID,
                tabBarItemTitleSmallLabelFontSize: 10,
                tabBarItemTitleLargeLabelFontSize: 16,
                tabBarItemTitleFontFamily: 'monospace',
                tabBarItemTitleFontStyle: 'italic',
                tabBarItemTitleFontWeight: 700,
                tabBarBackgroundColor: Colors.PurpleDark100,
                tabBarItemRippleColor: Colors.PurpleDark40,
                normal: {
                  tabBarItemIconColor: Colors.YellowDark100,
                  tabBarItemTitleFontColor: Colors.YellowDark40,
                },
                selected: {
                  tabBarItemIconColor: Colors.RedDark100,
                  tabBarItemTitleFontColor: Colors.RedDark60,
                },
                focused: {
                  tabBarItemIconColor: Colors.RedLight100,
                  tabBarItemTitleFontColor: Colors.RedLight60,
                },
                tabBarItemActiveIndicatorColor: Colors.PurpleDark120,
              },
            },
          },
        },
        {
          name: 'Tab3',
          Component: TabScreen,
          options: {
            title: 'Tab3',
            badgeValue: '123',
            ios: {
              icon: {
                type: 'templateSource',
                templateSource: require('@assets/variableIcons/icon_fill.png'),
              },
              standardAppearance: TAB3_APPEARANCE_IOS,
              scrollEdgeAppearance: TAB3_APPEARANCE_IOS,
            },
            android: {
              icon: {
                type: 'imageSource',
                imageSource: require('@assets/variableIcons/icon_fill.png'),
              },
              standardAppearance: {
                ...DEFAULT_APPEARANCE_ANDROID,
                tabBarItemBadgeTextColor: Colors.GreenDark100,
                tabBarItemBadgeBackgroundColor: Colors.RedDark100,
              },
            },
          },
        },
      ]}
    />
  );
}

export default createScenario(TestTabsAppearanceDefinedBySelectedTab, scenarioDescription);
