import {
  TabsContainer,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
  useTabsNavigationContext,
} from '@apps/shared/gamma/containers/tabs';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { SettingsPicker } from '@apps/shared';
import React, { useCallback, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import type { TabsScreenAppearanceIOS } from 'react-native-screens';
import { Colors } from '@apps/shared/styling';

type BlurEffect = NonNullable<TabsScreenAppearanceIOS['tabBarBlurEffect']>;

const BLUR_EFFECT_OPTIONS: BlurEffect[] = [
  'none',
  'systemChromeMaterialDark',
  'systemDefault',
];

const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar General Appearance No Liquid Glass',
  key: 'test-tabs-general-appearance-no-liquid-glass-ios',
  details:
    'Exercises per-tab tab bar appearance props via both standardAppearance and scrollEdgeAppearance: tabBarBackgroundColor, tabBarBlurEffect, tabBarShadowColor.',
  platforms: ['ios'],
};

const SCROLL_EDGE_APPEARANCE: TabsScreenAppearanceIOS = {
  tabBarBackgroundColor: Colors.PurpleDarkTransparent,
  tabBarShadowColor: Colors.PurpleLight100,
};

const STANDARD_APPEARANCE: TabsScreenAppearanceIOS = {
  tabBarBackgroundColor: Colors.NavyDark100,
  tabBarShadowColor: Colors.RedDark100,
};

const TAB3_BASE_STANDARD_APPEARANCE: TabsScreenAppearanceIOS = {
  tabBarBackgroundColor: Colors.NavyLightTransparent,
  tabBarBlurEffect: 'none',
  tabBarShadowColor: Colors.NavyDark80,
};

const TAB3_SCROLL_EDGE_APPEARANCE: TabsScreenAppearanceIOS = {
  tabBarBackgroundColor: Colors.PurpleDark100,
  tabBarBlurEffect: 'none',
  tabBarShadowColor: Colors.PurpleLight100,
};


const SCROLL_ITEM_COUNT = 30;

export function Tab1Screen() {
  return (
    <CenteredLayoutView testID="tab1-screen">
      <Text style={styles.description}>
        No ScrollView. The scrollEdgeAppearance is always active.
      </Text>
    </CenteredLayoutView>
  );
}

export function Tab2Screen() {
  return (
    <ScrollView
      testID="tab2-scrollview"
      style={styles.scrollView}
      contentInsetAdjustmentBehavior="automatic">
      {Array.from({ length: SCROLL_ITEM_COUNT }, (_, i) => (
        <View key={i} style={styles.scrollItem} testID={`tab2-item-${i + 1}`}>
          <Text style={styles.itemText}>Item {i + 1}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

export function Tab3Screen() {
  const { routeKey, setRouteOptions } = useTabsNavigationContext();
  const [blurEffect, setBlurEffect] = useState<BlurEffect>('none');

  const onBlurChange = useCallback(
    (value: BlurEffect) => {
      setBlurEffect(value);
      setRouteOptions(routeKey, {
        ios: {
          ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
          standardAppearance: {
            ...TAB3_BASE_STANDARD_APPEARANCE,
            tabBarBlurEffect: value,
          },
          scrollEdgeAppearance: TAB3_SCROLL_EDGE_APPEARANCE,
        },
      });
    },
    [routeKey, setRouteOptions],
  );

  return (
    <ScrollView
      testID="tab3-scrollview"
      style={styles.scrollView}
      contentInsetAdjustmentBehavior="automatic">
      <View style={styles.header} testID="tab3-header">
        <Text style={styles.headerText}>
          Pick a value to update scrollEdgeAppearance.tabBarBlurEffect on this
          tab in runtime. Background and shadow stay constant so
          the blur is the only varying input.
        </Text>
      </View>
      <SettingsPicker<BlurEffect>
        testID="tab3-blur-picker"
        label="tabBarBlurEffect"
        value={blurEffect}
        onValueChange={onBlurChange}
        items={BLUR_EFFECT_OPTIONS}
      />
      {Array.from({ length: SCROLL_ITEM_COUNT }, (_, i) => (
        <View key={i} style={styles.scrollItem} testID={`tab2-item-${i + 1}`}>
          <Text style={styles.itemText}>Item {i + 1}</Text>
        </View>
      ))}
    </ScrollView>

  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Tab1',
    Component: Tab1Screen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab1',
      ios: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
        standardAppearance: STANDARD_APPEARANCE,
        scrollEdgeAppearance: SCROLL_EDGE_APPEARANCE,
      },
    },
  },
  {
    name: 'Tab2',
    Component: Tab2Screen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab2',
      ios: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
        standardAppearance: STANDARD_APPEARANCE,
        scrollEdgeAppearance: {
          ...SCROLL_EDGE_APPEARANCE,
          tabBarBlurEffect: 'systemChromeMaterialDark',
        },
      },
    },
  },
  {
    name: 'Tab3',
    Component: Tab3Screen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab3',
      ios: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
        standardAppearance: TAB3_BASE_STANDARD_APPEARANCE,
        scrollEdgeAppearance: TAB3_SCROLL_EDGE_APPEARANCE,
      },
    },
  },
];

export function App() {
  return <TabsContainer routeConfigs={ROUTE_CONFIGS} />;
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 24,
  },
  scrollItem: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  itemText: {
    fontSize: 16,
  },
});

export default createScenario(App, scenarioDescription);
