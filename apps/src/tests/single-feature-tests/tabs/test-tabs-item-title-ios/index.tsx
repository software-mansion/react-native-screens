import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  useTabsHostConfig,
  useTabsNavigationContext,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';
import { Colors } from '@apps/shared/styling';
import type { TabsScreenItemStateAppearanceIOS } from 'react-native-screens';

const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Item Title (iOS)',
  key: 'test-tabs-item-title-ios',
  details:
    'Exercises every iOS tab bar item title prop: title, font color,' +
    ' font family, size, style, weight, and position adjustment.',
  platforms: ['ios'],
};

function makeSelectedAppearance(
  state: TabsScreenItemStateAppearanceIOS,
) {
  return {
    stacked: { selected: state },
    inline: { selected: state },
    compactInline: { selected: state },
  };
}

function DefaultTab() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Default</Text>
      <Text style={styles.hint}>
        No title-styling overrides applied.{'\n'}
        Demonstrates that `options.title` alone renders a label in the tab bar
        using the system default font, color, and position.
      </Text>
    </View>
  );
}

function TintOverrideTab() {
  const { updateHostConfig } = useTabsHostConfig();
  const { isSelected } = useTabsNavigationContext();

  useEffect(() => {
    updateHostConfig({
      ios: { tabBarTintColor: isSelected ? Colors.GreenDark100 : undefined },
    });
  }, [isSelected, updateHostConfig]);

  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Tint Override</Text>
      <Text style={styles.hint}>
        Host `tabBarTintColor`: GreenDark100 ({Colors.GreenDark100}){'\n'}
        This tab&apos;s `tabBarItemTitleFontColor`: RedLight100 (
        {Colors.RedLight100}){'\n'}
        {'\n'}
        When selected: title text should appear RED; icon should appear GREEN.{'\n'}
        Confirms `tabBarItemTitleFontColor` overrides `tabBarTintColor` for the
        label while the icon still uses tintColor.
      </Text>
    </View>
  );
}

function FontTab() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Font</Text>
      <Text style={styles.hint}>
        `tabBarItemTitleFontFamily`: &quot;Georgia&quot;{'\n'}
        `tabBarItemTitleFontSize`: 16{'\n'}
        `tabBarItemTitleFontStyle`: italic{'\n'}
        `tabBarItemTitleFontWeight`: &quot;700&quot;{'\n'}
        {'\n'}
        When selected: title should render in bold italic Georgia at 16 pt.
      </Text>
    </View>
  );
}

function PositionTab() {
  const { updateHostConfig } = useTabsHostConfig();
  const { isSelected } = useTabsNavigationContext();

  useEffect(() => {
    updateHostConfig({
      ios: { tabBarTintColor: isSelected ? Colors.GreenDark100 : undefined },
    });
  }, [isSelected, updateHostConfig]);
  
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Position</Text>
      <Text style={styles.hint}>
        `tabBarItemTitlePositionAdjustment`:{'\n'}
        {'  '}vertical: -6, horizontal: 0{'\n'}
        {'\n'}
        When selected: title text should be visibly shifted upward relative to a
        default-positioned label.
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
    name: 'Default',
    Component: DefaultTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Default',
      tabBarItemTestID: 'tab-default',
      tabBarItemAccessibilityLabel: 'Default tab',
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
        ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
        standardAppearance: makeSelectedAppearance({
          tabBarItemTitleFontColor: Colors.RedLight100,
          tabBarItemTitleFontSize: 8,
        }),
      },
    },
  },
  {
    name: 'Font',
    Component: FontTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Font',
      tabBarItemTestID: 'tab-font',
      tabBarItemAccessibilityLabel: 'Font tab',
      ios: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
        standardAppearance: makeSelectedAppearance({
          tabBarItemTitleFontColor: Colors.PurpleDark40,
          tabBarItemTitleFontFamily: 'Georgia',
          tabBarItemTitleFontSize: 19,
          tabBarItemTitleFontStyle: 'italic',
          tabBarItemTitleFontWeight: '700',
        }),
      },
    },
  },
  {
    name: 'Position',
    Component: PositionTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Position',
      tabBarItemTestID: 'tab-position',
      tabBarItemAccessibilityLabel: 'Position tab',
      ios: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
        standardAppearance: makeSelectedAppearance({
          tabBarItemTitlePositionAdjustment: { vertical: -6, horizontal: 0 },
        }),
      },
    },
  },
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
