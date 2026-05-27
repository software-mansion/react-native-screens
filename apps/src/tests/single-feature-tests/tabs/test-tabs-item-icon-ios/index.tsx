import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';
import { Colors } from '@apps/shared/styling';

function TintTab() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Template Source (Host Tint)</Text>
      <Text style={styles.hint}>
        Host `tabBarTintColor`:{' '}
        <Text style={{ color: Colors.GreenDark100 }}>GreenDark100</Text>{'\n'}
        `icon`: templateSource icon.png{'\n'}
        `selectedIcon`: templateSource icon_fill.png{'\n'}
        `tabBarItemIconColor` is NOT set.{'\n'}
        {'\n'}
        Selected: filled template image, tinted{' '}
        <Text style={{ color: Colors.GreenDark100 }}>GREEN</Text>.{'\n'}
        Unselected: Titles and icons render in the system theme color. For the last tab, the icon retains the black color from its source image.      </Text>
    </View>
  );
}

function OverrideTab() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>SF Symbol (Tint Color Override)</Text>
      <Text style={styles.hint}>
        Host `tabBarTintColor`:{' '}
        <Text style={{ color: Colors.GreenDark100 }}>GreenDark100</Text>{'\n'}
        `selected.tabBarItemIconColor`:{' '}
        <Text style={{ color: Colors.RedLight100 }}>RedLight100</Text>{'\n'}
        `icon`: SF Symbol &quot;star&quot;{'\n'}
        `selectedIcon`: SF Symbol &quot;star.fill&quot;{'\n'}
        {'\n'}
        Selected: filled star, tinted{' '}
        <Text style={{ color: Colors.RedLight100 }}>RED</Text>{'\n'} title on iOS18: <Text style={{ color: Colors.GreenDark100 }}>GREEN</Text> on iOS26: <Text style={{ color: Colors.RedLight100 }}>RED</Text>{'\n'}
        Unselected: Titles and icons render in the system theme color. For the last tab, the icon retains the black color from its source image.      </Text>
    </View>
  );
}

function XcassetTab() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Xcasset (Host Tint)</Text>
      <Text style={styles.hint}>
        Host `tabBarTintColor`:{' '}
        <Text style={{ color: Colors.GreenDark100 }}>GreenDark100</Text>{'\n'}
        `icon`: Xcasset custom-icon{'\n'}
        `selectedIcon`: Xcasset custom-icon-fill{'\n'}
        `tabBarItemIconColor` is NOT set.{'\n'}
        {'\n'}
        Selected: filled template image, tinted{' '}
        <Text style={{ color: Colors.GreenDark100 }}>GREEN</Text>.{'\n'}
        Unselected: Titles and icons render in the system theme color. For the last tab, the icon retains the black color from its source image.      </Text>
    </View>
  );
}

function ImageTab() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Image Source (Non-Tintable)</Text>
      <Text style={styles.hint}>
        Host `tabBarTintColor`:{' '}
        <Text style={{ color: Colors.GreenDark100 }}>GreenDark100</Text>{'\n'}
        `normal.tabBarItemIconColor`:{' '}
        <Text style={{ color: Colors.BlueDark100 }}>BlueDark100</Text>{'\n'}
        `icon`: imageSource icon.png{'\n'}
        `selectedIcon`: imageSource icon_fill.png{'\n'}
        {'\n'}
        `imageSource` icons render in their original colors and are NOT
        affected by `tabBarTintColor` or `tabBarItemIconColor`.{'\n'}
        {'\n'}
        Selected: filled image in its black color{'\n'}(the host{' '}
        <Text style={{ color: Colors.GreenDark100 }}>green</Text> tint is
        ignored).{'\n'}
        Unselected iOS18: outline icons in <Text style={{ color: Colors.BlueDark100 }}>BLUE</Text> color.{'\n'}
        Unselected iOS26: icons in system theme color.
      </Text>
    </View>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Tint',
    Component: TintTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tint',
      ios: {
        icon: {
          type: 'templateSource',
          templateSource: require('@assets/variableIcons/icon.png'),
        },
        selectedIcon: {
          type: 'templateSource',
          templateSource: require('@assets/variableIcons/icon_fill.png'),
        },
      },
    },
  },
  {
    name: 'Override',
    Component: OverrideTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Override',
      ios: {
        icon: {
          type: 'sfSymbol',
          name: 'star',
        },
        selectedIcon: {
          type: 'sfSymbol',
          name: 'star.fill',
        },
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
    name: 'XcassetIcon',
    Component: XcassetTab,
    options: {
      title: 'Xcasset',
      ios: {
        icon: {
          type: 'xcasset',
          name: 'custom-icon',
        },
        selectedIcon: {
          type: 'xcasset',
          name: 'custom-icon-fill',
        },
      },
    },
  },
  {
    name: 'Image',
    Component: ImageTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Image',
      ios: {
        icon: {
          type: 'imageSource',
          imageSource: require('@assets/variableIcons/icon.png'),
        },
        selectedIcon: {
          type: 'imageSource',
          imageSource: require('@assets/variableIcons/icon_fill.png'),
        },
        standardAppearance: {
          stacked: {
            normal: {
              tabBarItemIconColor: Colors.BlueDark100,
            },
          },
        },
      },
    },
  },
];

export function App() {
  return (
    <TabsContainerWithHostConfigContext
      routeConfigs={ROUTE_CONFIGS}
      ios={{ tabBarTintColor: Colors.GreenDark100 }}
    />
  );
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

export default createScenario(App, scenarioDescription);
