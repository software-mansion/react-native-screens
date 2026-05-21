import {
  TabsContainer,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
  useTabsNavigationContext,
} from '@apps/shared/gamma/containers/tabs';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { SettingsPicker } from '@apps/shared';
import React, { useCallback, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import scenarioDescription from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import type { TabsScreenAppearanceIOS } from 'react-native-screens';
import { Colors } from '@apps/shared/styling';

type BlurEffect = NonNullable<TabsScreenAppearanceIOS['tabBarBlurEffect']>;

const BLUR_EFFECT_OPTIONS: BlurEffect[] = [
  'none',
  'systemChromeMaterialDark',
  'systemDefault',
];

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


const SCROLL_ITEM_COUNT1 = 8;
const SCROLL_ITEM_COUNT2 = 20;

export function Tab1Screen() {
  return (
    <CenteredLayoutView testID="tab1-screen">
      <Text style={styles.description}>
        No ScrollView.{"\n"}
        No scrollEdgeAppearance defined.{"\n"}
        Tab bar background should be fully transparent.
      </Text>
      <Image source={require('@assets/trees.jpg')} style={styles.image} />
    </CenteredLayoutView>
  );
}

export function Tab2Screen() {
  return (
    <CenteredLayoutView testID="tab2-screen">
      <Text style={styles.description}>
        No ScrollView.{"\n"}
        The scrollEdgeAppearance is active. The tabBarBlurEffect is not set, so it should fall back to systemDefault.{"\n"}
        Tab bar background color should be transparent{" "}
        <Text style={{ color: Colors.PurpleDarkTransparent }}>PurpleDark140</Text> with{" "}
        <Text style={{ color: Colors.PurpleLight100 }}> PurpleLight100</Text> shadow.
      </Text>
    </CenteredLayoutView>
  );
}

export function Tab3Screen() {
  return (
    <ScrollView
      testID="tab3-scrollview"
      style={styles.scrollView}
      contentInsetAdjustmentBehavior="automatic">
      <Text style={[styles.description, { marginTop: 20 }]}>
        ScrollView active.{"\n"}
        The standardAppearance is active at the top of the page and during scrolling.{"\n"} Tab bar background color should be{" "}
        <Text style={{ color: Colors.NavyDark100 }}>NavyDark100</Text> with{" "}
        <Text style={{ color: Colors.RedDark100 }}> RedDark100</Text> shadow.
      </Text>
      <Text style={[styles.description, { marginTop: 20 }]}>
        The scrollEdgeAppearance activates once the list is scrolled all the way to the bottom and its edge aligns with the tab bar.{"\n"}.
        The tabBarBlurEffect is set to `systemChromeMaterialDark` so tab bar background color should be darker{" "}
        <Text style={{ color: Colors.PurpleDarkTransparent }}>PurpleDark140</Text> with{" "}
        <Text style={{ color: Colors.PurpleLight100 }}> PurpleLight100</Text> shadow.
      </Text>
      {Array.from({ length: SCROLL_ITEM_COUNT2 }, (_, i) => (
        <View key={i} style={styles.scrollItem} testID={`tab3-item-${i + 1}`}>
          <Text style={styles.itemText}>Item {i + 1}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

export function Tab4Screen() {
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
      testID="tab4-scrollview"
      style={styles.scrollView}
      contentInsetAdjustmentBehavior="automatic">
      <View style={styles.header} testID="tab4-header">
        <Text style={[styles.description, { marginTop: 20 }]}>
          Pick a value to update standardAppearance.tabBarBlurEffect on this
          tab at runtime. Background and shadow stay constant so
          the blur is the only varying input.
        </Text>
        <Text style={[styles.description, { marginTop: 20 }]}>
          The scrollEdgeAppearance activates once the list is scrolled all the way to the bottom.{"\n"}
          The tabBarBlurEffect is set to `none` so tab bar background color should be exactly{" "}
          <Text style={{ color: Colors.PurpleDark100 }}>PurpleDark100</Text> with{" "}
          <Text style={{ color: Colors.PurpleLight100 }}> PurpleLight100</Text> shadow.
        </Text>
      </View>
      <SettingsPicker<BlurEffect>
        testID="tab4-blur-picker"
        label="tabBarBlurEffect"
        value={blurEffect}
        onValueChange={onBlurChange}
        items={BLUR_EFFECT_OPTIONS}
      />
      {Array.from({ length: SCROLL_ITEM_COUNT1 }, (_, i) => (
        <View key={i} style={styles.scrollItem} testID={`tab4-item-${i + 1}`}>
          <Text style={styles.itemText}>Item {i + 1}</Text>
        </View>
      ))}
      <Image source={require('@assets/cat.jpg')} style={styles.image} />
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
        scrollEdgeAppearance: SCROLL_EDGE_APPEARANCE,
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
        standardAppearance: STANDARD_APPEARANCE,
        scrollEdgeAppearance: {
          ...SCROLL_EDGE_APPEARANCE,
          tabBarBlurEffect: 'systemChromeMaterialDark',
        },
      },
    },
  },
  {
    name: 'Tab4',
    Component: Tab4Screen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab4',
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
    flex: 1,
    marginTop: 80,
    fontSize: 13,
    color: '#555',
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
    flex: 3,
    width: '100%',
    height: 350
  }
});

export default createScenario(App, scenarioDescription);
