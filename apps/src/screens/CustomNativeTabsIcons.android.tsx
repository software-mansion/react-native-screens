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
        Sized SWM: a wide logo sized to 44dp via `iconSize`.
      </Text>
      <Text style={styles.hint}>
        Multicolor Tint: a VectorDrawable that keeps its own colors when
        selected (`tinting: 'original'`) and is template(system)-tinted
        otherwise.
      </Text>
      <Text style={styles.hint}>
        Sys (unaltered): a built-in star. Size unaltered defaults to 24dp.
      </Text>
      <Text style={styles.hint}>
        Image Tint: an `imageSource` icon, tinted by default and keeping its own
        colors when selected (`tinting: 'original'`).
      </Text>
      <Text style={styles.hint}>
        Each tab&apos;s active indicator wraps its own icon; set
        `activeIndicatorWidth` / `activeIndicatorHeight` on a tab to size it.
      </Text>
    </View>
  );
}

const ROUTES: TabRouteConfig[] = [
  {
    name: 'OG_SWM',
    element: <TabScreen />,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'OG SWM',
      android: {
        icon: { type: 'drawableResource', name: 'swm_logo' },
      },
    },
  },
  {
    name: 'SIZED_SWM',
    element: <TabScreen />,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Sized SWM',
      android: {
        iconSize: 44,
        icon: { type: 'drawableResource', name: 'swm_logo' },
      },
    },
  },
  {
    name: 'Multicolor',
    element: <TabScreen />,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Multicolor Tint',
      android: {
        iconSize: 30,
        icon: {
          type: 'drawableResource',
          name: 'person_walking',
          tinting: 'tinted',
        },
        selectedIcon: {
          type: 'drawableResource',
          name: 'person_walking',
          tinting: 'original',
        },
      },
    },
  },
  {
    name: 'System',
    element: <TabScreen />,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Sys (unaltered)',
      android: {
        icon: { type: 'drawableResource', name: 'star_big_off' },
        selectedIcon: { type: 'drawableResource', name: 'star_big_on' },
      },
    },
  },
  {
    name: 'IMAGE_TINT',
    element: <TabScreen />,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Image Tint',
      android: {
        icon: {
          type: 'imageSource',
          imageSource: require('@assets/variableIcons/icon.png'),
        },
        selectedIcon: {
          type: 'imageSource',
          imageSource: require('@assets/variableIcons/icon.png'),
          tinting: 'original',
        },
      },
    },
  },
];

export default function CustomNativeTabsIcons() {
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
