import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import scenarioDescription from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  useTabsHostConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';
import { Colors } from '@apps/shared/styling';


function TintOverrideTab() {
  const { updateHostConfig } = useTabsHostConfig();
  useEffect(() => {
    updateHostConfig({
      ios: { tabBarTintColor: Colors.GreenDark100 },
    });
  }, [updateHostConfig]);

  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Tint Override</Text>
      <Text style={styles.hint}>
        Host `tabBarTintColor`:{" "}
        <Text style={{ color: Colors.GreenDark100 }}>GreenDark100</Text>{'\n'}
        This tab&apos;s `tabBarItemTitleFontColor`:{" "}
        <Text style={{ color: Colors.RedLight100 }}>RedLight100</Text>{'\n'}
        {'\n'}
        When selected: title text should appear <Text style={{ color: Colors.RedLight100 }}>RED</Text>{'\n'} and icon should appear <Text style={{ color: Colors.GreenDark100 }}>GREEN</Text>{'\n'}
        {'\n'}
        Confirms `tabBarItemTitleFontColor` overrides `tabBarTintColor` for the
        label but not the icon, which should still be tinted by the host config.
      </Text>
    </View>
  );
}

function FontTab() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Font and Position</Text>
      <Text style={styles.hint}>
        Host `tabBarTintColor`:{" "}
        <Text style={{ color: Colors.GreenDark100 }}>GreenDark100</Text>{'\n'}
        `tabBarItemTitleFontFamily`: &quot;Georgia&quot;{'\n'}
        `tabBarItemTitleFontSize`: &quot;12&quot;{'\n'}
        `tabBarItemTitleFontStyle`: &quot;italic&quot;{'\n'}
        `tabBarItemTitleFontWeight`: &quot;700&quot;{'\n'}
        `tabBarItemTitlePositionAdjustment`:{'\n'}
        vertical: -6, horizontal: 0{'\n'}
        {'\n'}
        {'\n'}
        When selected: title text should be visibly shifted upward relative to a
        default-positioned label in <Text style={{ color: Colors.GreenDark100 }}>GREEN</Text>{'\n'}bold italic Georgia at 12 pt. For iOS 18 and lower, the title color for unselected tabs is <Text style={{ color: Colors.BlueDark100 }}>BLUE</Text>
      </Text>
    </View>
  );
}

function LongTitleTab() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Long Title</Text>
      <Text style={styles.hint}>
        Tab title: &quot;A Very Long Tab Title That Should Truncate&quot;{'\n'}
        {'\n'}
        Demonstrates that `options.title` with an overly wide string is
        truncated by the system tab bar with an ellipsis rather than wrapping
        or overflowing.
      </Text>
    </View>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'LongTitle',
    Component: LongTitleTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'A Very Long Tab Title That Should Truncate',
      tabBarItemTestID: 'tab-long-title',
      tabBarItemAccessibilityLabel: 'Long Title tab',
    },
  },
  {
    name: 'TintOverride',
    Component: TintOverrideTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Color',
      tabBarItemTestID: 'tab-color',
      tabBarItemAccessibilityLabel: 'Color tab',
      ios: {
        icon: {
          type: 'sfSymbol',
          name: 'house.fill',
        },
        standardAppearance: {
          stacked: {
            selected: {
              tabBarItemTitleFontColor: Colors.RedLight100,
            },
          },
        },
      },
    },
  },
  {
    name: 'Font and Position',
    Component: FontTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Font and Position',
      tabBarItemTestID: 'tab-font',
      tabBarItemAccessibilityLabel: 'Font and Position tab',
      ios: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
        standardAppearance: {
          stacked: {
            selected: {
              tabBarItemTitleFontFamily: 'Georgia',
              tabBarItemTitleFontSize: 12,
              tabBarItemTitleFontStyle: 'italic',
              tabBarItemTitleFontWeight: '700',
              tabBarItemTitlePositionAdjustment: { vertical: -6, horizontal: 0 },
            },
            normal: {
              tabBarItemTitleFontColor: Colors.BlueDark100,
            },
          },
        },
      },
    },
  },
];

export function App() {
  return <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />;
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
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default createScenario(App, scenarioDescription);
