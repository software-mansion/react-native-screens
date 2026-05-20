import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { TabsScreenAppearanceAndroid } from 'react-native-screens';
import { Colors } from '@apps/shared/styling';
import {
  TabsContainer,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';

type TabSpec = {
  name: string;
  title: string;
  rippleColor: string;
  indicatorColor: string;
  indicatorEnabled: boolean;
};

const TAB_SPECS: TabSpec[] = [
  {
    name: 'Tab1',
    title: 'Red',
    rippleColor: Colors.RedLight60,
    indicatorColor: Colors.RedLight40,
    indicatorEnabled: true,
  },
  {
    name: 'Tab2',
    title: 'Green',
    rippleColor: Colors.GreenLight60,
    indicatorColor: Colors.GreenLight40,
    indicatorEnabled: true,
  },
  {
    name: 'Tab3',
    title: 'Purple (no indicator)',
    rippleColor: Colors.PurpleLight60,
    indicatorColor: Colors.PurpleLight40,
    indicatorEnabled: false,
  },
];

function buildAndroidAppearance(spec: TabSpec): TabsScreenAppearanceAndroid {
  return {
    tabBarBackgroundColor: Colors.NavyLight10,
    tabBarItemRippleColor: spec.rippleColor,
    tabBarItemActiveIndicatorColor: spec.indicatorColor,
    tabBarItemActiveIndicatorEnabled: spec.indicatorEnabled,
    tabBarItemLabelVisibilityMode: 'labeled',
    normal: {
      tabBarItemIconColor: Colors.NavyLight80,
      tabBarItemTitleFontColor: Colors.NavyLight80,
    },
    selected: {
      tabBarItemIconColor: Colors.NavyLight100,
      tabBarItemTitleFontColor: Colors.NavyLight100,
    },
  };
}

function TabScreen({ spec }: { spec: TabSpec }) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      testID={`ripple-indicator-${spec.name.toLowerCase()}-scrollview`}>
      <Text style={styles.heading}>{spec.title}</Text>

      <View style={styles.row}>
        <View style={[styles.swatch, { backgroundColor: spec.rippleColor }]} />
        <View style={styles.rowText}>
          <Text style={styles.label}>tabBarItemRippleColor</Text>
          <Text style={styles.value}>{spec.rippleColor}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View
          style={[styles.swatch, { backgroundColor: spec.indicatorColor }]}
        />
        <View style={styles.rowText}>
          <Text style={styles.label}>tabBarItemActiveIndicatorColor</Text>
          <Text style={styles.value}>{spec.indicatorColor}</Text>
          {!spec.indicatorEnabled && (
            <Text style={styles.value}>
              tabBarItemActiveIndicatorEnabled = false → no pill rendered
            </Text>
          )}
        </View>
      </View>

      <Text style={styles.hint}>
        While this tab is selected, the tab bar's ripple and active indicator
        are sourced from this tab's appearance.
      </Text>
    </ScrollView>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = TAB_SPECS.map(spec => ({
  name: spec.name,
  Component: () => <TabScreen spec={spec} />,
  options: {
    ...DEFAULT_TAB_ROUTE_OPTIONS,
    title: spec.title,
    tabBarItemTestID: `ripple-indicator-tab-item-${spec.name.toLowerCase()}`,
    android: {
      ...DEFAULT_TAB_ROUTE_OPTIONS.android,
      standardAppearance: buildAndroidAppearance(spec),
    },
  },
}));

export default function App() {
  return <TabsContainer routeConfigs={ROUTE_CONFIGS} defaultRouteName="Tab3" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.NavyLight100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rowText: {
    marginLeft: 12,
    flexShrink: 1,
  },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.NavyLight40,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.NavyLight100,
  },
  value: {
    fontSize: 12,
    color: Colors.NavyLight80,
  },
  hint: {
    marginTop: 12,
    fontSize: 12,
    color: Colors.NavyLight80,
    fontStyle: 'italic',
  },
});
