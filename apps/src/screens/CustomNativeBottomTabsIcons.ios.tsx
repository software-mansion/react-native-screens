import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  TabsContainer,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/containers/tabs';
import { Colors } from '@apps/shared/styling';

function TabScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Custom asset-catalog tab icons</Text>
      <Text style={styles.hint}>
        SWM Symbol: a custom symbol (`nano.swm` symbolset). It is not a built-in
        SF Symbol, so it resolves via the custom-symbol fallback. Being a
        template, it follows the system/host tint.
      </Text>
      <Text style={styles.hint}>
        SWM Tinted: the same custom symbol, tinted RED when selected via
        `standardAppearance`.
      </Text>
      <Text style={styles.hint}>
        Walker: a multicolor imageset (`nanomc.walker`) rendered in its own
        colors — it ignores tinting.
      </Text>
      <Text style={styles.hint}>
        System: a built-in SF Symbol star with a filled selected variant.
      </Text>
    </View>
  );
}

const ROUTES: TabRouteConfig[] = [
  {
    name: 'SWM_SYMBOL',
    Component: TabScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'SWM Symbol',
      ios: {
        icon: { type: 'sfSymbol', name: 'nano.swm' },
      },
    },
  },
  {
    name: 'SWM_TINTED',
    Component: TabScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'SWM Tinted',
      ios: {
        icon: { type: 'sfSymbol', name: 'nano.swm' },
        standardAppearance: {
          stacked: {
            selected: {
              tabBarItemIconColor: Colors.RedLight100,
            },
          },
        },
      },
    },
  },
  {
    name: 'WALKER',
    Component: TabScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Walker',
      ios: {
        icon: { type: 'xcasset', name: 'nanomc.walker' },
      },
    },
  },
  {
    name: 'System',
    Component: TabScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'System',
      ios: {
        icon: { type: 'sfSymbol', name: 'star' },
        selectedIcon: { type: 'sfSymbol', name: 'star.fill' },
      },
    },
  },
];

export default function CustomNativeBottomTabsIcons() {
  return <TabsContainer routeConfigs={ROUTES} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  hint: {
    fontSize: 13,
    color: Colors.LightOffNavy,
    textAlign: 'center',
    lineHeight: 20,
  },
});
