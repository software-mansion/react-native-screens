import {
  TabsContainer,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
  useTabsNavigationContext,
} from '@apps/shared/gamma/containers/tabs';
import { SettingsPicker, SettingsSwitch } from '@apps/shared';
import React, { useCallback, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import type { TabsScreenAppearanceIOS } from 'react-native-screens';
import { Colors } from '@apps/shared/styling';

type BlurEffect = NonNullable<TabsScreenAppearanceIOS['tabBarBlurEffect']>;

const BLUR_EFFECT_OPTIONS: BlurEffect[] = [
  'systemDefault',
  'systemChromeMaterialDark',
  'none',
];

const SCROLL_EDGE_APPEARANCE: TabsScreenAppearanceIOS = {
  tabBarBackgroundColor: Colors.PurpleDarkTransparent,
  tabBarShadowColor: Colors.PurpleLight100,
};

const STANDARD_APPEARANCE: TabsScreenAppearanceIOS = {
  tabBarBackgroundColor: Colors.NavyDark100,
  tabBarShadowColor: Colors.RedDark100,
};

const TAB2_SCROLL_EDGE_WITH_BLUR: TabsScreenAppearanceIOS = {
  ...SCROLL_EDGE_APPEARANCE,
  tabBarBlurEffect: 'systemChromeMaterialDark',
};

const TAB3_BASE_STANDARD_APPEARANCE: TabsScreenAppearanceIOS = {
  tabBarBackgroundColor: Colors.NavyLightTransparent,
  tabBarShadowColor: Colors.RedDark100,
};

const TAB3_SCROLL_EDGE_APPEARANCE: TabsScreenAppearanceIOS = {
  tabBarBackgroundColor: Colors.YellowDark100,
  tabBarBlurEffect: 'none',
  tabBarShadowColor: Colors.PurpleLight100,
};

const SCROLL_ITEM_COUNT = 5;

function Tab1Screen() {
  const { routeKey, setRouteOptions } = useTabsNavigationContext();
  const [standardEnabled, setStandardEnabled] = useState(false);
  const [scrollEdgeEnabled, setScrollEdgeEnabled] = useState(false);

  const onToggleStandard = useCallback(
    (value: boolean) => {
      setStandardEnabled(value);
      setRouteOptions(routeKey, {
        ios: {
          ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
          standardAppearance: value ? STANDARD_APPEARANCE : undefined,
          scrollEdgeAppearance: scrollEdgeEnabled
            ? SCROLL_EDGE_APPEARANCE
            : undefined,
        },
      });
    },
    [routeKey, setRouteOptions, scrollEdgeEnabled],
  );

  const onToggleScrollEdge = useCallback(
    (value: boolean) => {
      setScrollEdgeEnabled(value);
      setRouteOptions(routeKey, {
        ios: {
          ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
          standardAppearance: standardEnabled ? STANDARD_APPEARANCE : undefined,
          scrollEdgeAppearance: value ? SCROLL_EDGE_APPEARANCE : undefined,
        },
      });
    },
    [routeKey, setRouteOptions, standardEnabled],
  );

  return (
    <View style={styles.content}>
      <Text style={styles.description}>
        No ScrollView.{'\n'}
        {'\n'}
        standardAppearance:{'\n'}
        bg <Text style={{ color: Colors.NavyDark100 }}>NavyDark100</Text>,
        shadow <Text style={{ color: Colors.RedDark100 }}>RedDark100</Text>.
        {'\n'}
        {'\n'}
        scrollEdgeAppearance:{'\n'}
        bg{' '}
        <Text style={{ color: Colors.PurpleDarkTransparent }}>
          PurpleDarkTransparent
        </Text>
        , shadow{' '}
        <Text style={{ color: Colors.PurpleLight100 }}>PurpleLight100</Text>.
        {'\n'}
      </Text>
      <SettingsSwitch
        label="standardAppearance"
        value={standardEnabled}
        onValueChange={onToggleStandard}
      />
      <SettingsSwitch
        label="scrollEdgeAppearance"
        value={scrollEdgeEnabled}
        onValueChange={onToggleScrollEdge}
      />
    </View>
  );
}

function Tab2Screen() {
  const { routeKey, setRouteOptions } = useTabsNavigationContext();
  const [standardEnabled, setStandardEnabled] = useState(true);
  const [scrollEdgeEnabled, setScrollEdgeEnabled] = useState(true);

  const onToggleStandard = useCallback(
    (value: boolean) => {
      setStandardEnabled(value);
      setRouteOptions(routeKey, {
        ios: {
          ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
          standardAppearance: value ? STANDARD_APPEARANCE : undefined,
          scrollEdgeAppearance: scrollEdgeEnabled
            ? TAB2_SCROLL_EDGE_WITH_BLUR
            : undefined,
        },
      });
    },
    [routeKey, setRouteOptions, scrollEdgeEnabled],
  );

  const onToggleScrollEdge = useCallback(
    (value: boolean) => {
      setScrollEdgeEnabled(value);
      setRouteOptions(routeKey, {
        ios: {
          ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
          standardAppearance: standardEnabled ? STANDARD_APPEARANCE : undefined,
          scrollEdgeAppearance: value ? TAB2_SCROLL_EDGE_WITH_BLUR : undefined,
        },
      });
    },
    [routeKey, setRouteOptions, standardEnabled],
  );

  return (
    <ScrollView
      style={styles.scrollView}
      contentInsetAdjustmentBehavior="automatic">
      <Text style={[styles.description, { marginTop: 20 }]}>
        ScrollView with {SCROLL_ITEM_COUNT} items - standardAppearance shows
        while scrolling mid-list, scrollEdgeAppearance shows when content edge
        aligns with the tab bar.{'\n'}
        {'\n'}
        standardAppearance:{'\n'}
        bg <Text style={{ color: Colors.NavyDark100 }}>NavyDark100</Text>,
        shadow <Text style={{ color: Colors.RedDark100 }}>RedDark100</Text> (no
        blur).{'\n'}
        {'\n'}
        scrollEdgeAppearance:{'\n'}
        bg{' '}
        <Text style={{ color: Colors.PurpleDarkTransparent }}>
          PurpleDarkTransparent
        </Text>
        , shadow{' '}
        <Text style={{ color: Colors.PurpleLight100 }}>PurpleLight100</Text>,
        {'\n'}
        blur `systemChromeMaterialDark`.{'\n'}
        {'\n'}
      </Text>
      <SettingsSwitch
        label="standardAppearance"
        value={standardEnabled}
        onValueChange={onToggleStandard}
      />
      <SettingsSwitch
        label="scrollEdgeAppearance"
        value={scrollEdgeEnabled}
        onValueChange={onToggleScrollEdge}
      />
      {Array.from({ length: SCROLL_ITEM_COUNT }, (_, i) => (
        <View key={i} style={styles.scrollItem}>
          <Text style={styles.itemText}>Item {i + 1}</Text>
        </View>
      ))}
      <Image source={require('@assets/trees.jpg')} style={styles.image} />
    </ScrollView>
  );
}

function Tab3Screen() {
  const { routeKey, setRouteOptions } = useTabsNavigationContext();
  const [blurEffect, setBlurEffect] = useState<BlurEffect>('systemDefault');

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
      style={styles.scrollView}
      contentInsetAdjustmentBehavior="automatic">
      <View style={styles.header}>
        <Text style={[styles.description, { marginTop: 20 }]}>
          ScrollView with {SCROLL_ITEM_COUNT} items - standardAppearance shows
          while scrolling mid-list, scrollEdgeAppearance shows when content edge
          aligns with the tab bar.{'\n'}
          {'\n'}
          standardAppearance:{'\n'}
          bg{' '}
          <Text style={{ color: Colors.NavyLightTransparent }}>
            NavyLightTransparent
          </Text>
          , shadow <Text style={{ color: Colors.RedDark100 }}>RedDark100</Text>.
          {'\n'}
          {'\n'}
          Use the picker below to change `standardAppearance.tabBarBlurEffect`
          at runtime - background and shadow stay constant so the blur is the
          only varying input.{'\n'}
          {'\n'}
          scrollEdgeAppearance:{'\n'}
          bg <Text style={{ color: Colors.YellowDark100 }}>YellowDark100</Text>,
          shadow{' '}
          <Text style={{ color: Colors.PurpleLight100 }}>PurpleLight100</Text>,
          {'\n'}
          blur `none` (background renders exactly as the configured color).
        </Text>
      </View>
      <SettingsPicker<BlurEffect>
        label="tabBarBlurEffect"
        value={blurEffect}
        onValueChange={onBlurChange}
        items={BLUR_EFFECT_OPTIONS}
      />
      {Array.from({ length: SCROLL_ITEM_COUNT }, (_, i) => (
        <View key={i} style={styles.scrollItem}>
          <Text style={styles.itemText}>Item {i + 1}</Text>
        </View>
      ))}
      <Image source={require('@assets/trees.jpg')} style={styles.image} />
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
        scrollEdgeAppearance: TAB2_SCROLL_EDGE_WITH_BLUR,
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
        standardAppearance: {
          ...TAB3_BASE_STANDARD_APPEARANCE,
          tabBarBlurEffect: 'systemDefault',
        },
        scrollEdgeAppearance: TAB3_SCROLL_EDGE_APPEARANCE,
      },
    },
  },
];

function TestTabsGeneralAppearanceNoLiquidGlass() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.GreenDark80 }}>
      <TabsContainer
        routeConfigs={ROUTE_CONFIGS}
        nativeContainerStyle={{ backgroundColor: 'transparent' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    width: '100%',
    paddingHorizontal: 24,
    gap: 1,
  },
  header: {
    padding: 16,
  },
  description: {
    marginTop: 80,
    fontSize: 13,
    color: Colors.LightOffNavy,
    alignContent: 'center',
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
  image: {
    flex: 1,
    width: '80%',
    height: 350,
    alignSelf: 'center',
  },
});

export default createScenario(TestTabsGeneralAppearanceNoLiquidGlass, scenarioDescription);
