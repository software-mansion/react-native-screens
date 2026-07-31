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
      <Text style={styles.label}>Custom drawable tab icons</Text>
      <Text style={styles.hint}>
        OG SWM: size unaltered showcases the visual shrink due to its aspect
        ratio.
      </Text>
      <Text style={styles.hint}>
        Sized SWM: a wide logo sized to 44dp via `drawableIconSize`.
      </Text>
      <Text style={styles.hint}>
        Multicolor Tint: a VectorDrawable that keeps its own colors when focused
        (`tinted: false`) and is template(system)-tinted otherwise.
      </Text>
      <Text style={styles.hint}>
        Sys (unaltered): a built-in star. Size unaltered defaults to 24dp.
      </Text>
      <Text style={styles.hint}>
        The active indicator is bar-wide via `tabBarItemActiveIndicatorWidth` /
        `Height`. And shared throughout all icons
      </Text>
    </View>
  );
}

const INDICATOR = {
  tabBarItemActiveIndicatorWidth: 80,
  tabBarItemActiveIndicatorHeight: 40,
};

const ROUTES: TabRouteConfig[] = [
  {
    name: 'OG_SWM',
    Component: TabScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'OG SWM',
      android: {
        icon: { type: 'drawableResource', name: 'swm_logo' },
        standardAppearance: INDICATOR,
      },
    },
  },
  {
    name: 'SIZED_SWM',
    Component: TabScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Sized SWM',
      android: {
        drawableIconSize: 44,
        icon: { type: 'drawableResource', name: 'swm_logo' },
        standardAppearance: INDICATOR,
      },
    },
  },
  {
    name: 'Multicolor',
    Component: TabScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Multicolor Tint',
      android: {
        drawableIconSize: 30,
        icon: {
          type: 'drawableResource',
          name: 'person_walking',
          tinted: true,
        },
        selectedIcon: {
          type: 'drawableResource',
          name: 'person_walking',
          tinted: false,
        },
        standardAppearance: INDICATOR,
      },
    },
  },
  {
    name: 'System',
    Component: TabScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Sys (unaltered)',
      android: {
        icon: { type: 'drawableResource', name: 'star_big_off' },
        selectedIcon: { type: 'drawableResource', name: 'star_big_on' },
        standardAppearance: INDICATOR,
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
