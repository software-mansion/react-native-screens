import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';
import { Colors } from '@apps/shared/styling';

function ColorTab() {
  return (
    <View style={styles.screen}>
      {Platform.OS === 'ios' ? (
        <>
          <Text style={styles.label}>Tint Override</Text>
          <Text style={styles.hint}>
            Host `tabBarTintColor`:{' '}
            <Text style={{ color: Colors.GreenDark100 }}>GreenDark100</Text>
            {'\n'}
            This tab&apos;s `tabBarItemTitleFontColor`:{' '}
            <Text style={{ color: Colors.RedLight100 }}>RedLight100</Text>
            {'\n'}
            {'\n'}
            When selected: title text should appear{' '}
            <Text style={{ color: Colors.RedLight100 }}>RED</Text>
            {'\n'} and icon should appear{' '}
            <Text style={{ color: Colors.GreenDark100 }}>GREEN</Text>. For iOS
            18 and lower, the title color for unselected tabs is{' '}
            <Text style={{ color: Colors.BlueDark100 }}>BLUE</Text>
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.label}>Title Color</Text>
          <Text style={styles.hint}>
            `selected.tabBarItemTitleFontColor`:{' '}
            <Text style={{ color: Colors.RedLight100 }}>RedLight100</Text>
            {'\n'}
            `normal.tabBarItemTitleFontColor`:{' '}
            <Text style={{ color: Colors.BlueDark100 }}>BlueDark100</Text>
            {'\n'}
            `focused.tabBarItemTitleFontColor`:{' '}
            <Text style={{ color: Colors.YellowDark100 }}>YellowDark100</Text>
            {'\n'}
            {'\n'}
            When this tab is selected its title should render in{' '}
            <Text style={{ color: Colors.RedLight100 }}>RED</Text>; in the
            unselected (normal) state it should render in{' '}
            <Text style={{ color: Colors.BlueDark100 }}>BLUE</Text>; and while
            keyboard-focused it should render in{' '}
            <Text style={{ color: Colors.YellowDark100 }}>YELLOW</Text>.
          </Text>
        </>
      )}
    </View>
  );
}

function FontTab() {
  return (
    <View style={styles.screen}>
      {Platform.OS === 'ios' ? (
        <>
          <Text style={styles.label}>Font and Position</Text>
          <Text style={styles.hint}>
            Host `tabBarTintColor`:{' '}
            <Text style={{ color: Colors.GreenDark100 }}>GreenDark100</Text>
            {'\n'}
            `tabBarItemTitleFontFamily`: &quot;Georgia&quot;{'\n'}
            `tabBarItemTitleFontSize`: &quot;18&quot;{'\n'}
            `tabBarItemTitleFontStyle`: &quot;italic&quot;{'\n'}
            `tabBarItemTitleFontWeight`: &quot;700&quot;{'\n'}
            `tabBarItemTitlePositionAdjustment`:{'\n'}
            vertical: -6, horizontal: 0{'\n'}
            {'\n'}
            {'\n'}
            When selected: title text should be visibly shifted upward relative
            to a default-positioned label in{' '}
            <Text style={{ color: Colors.GreenDark100 }}>GREEN</Text>
            {'\n'} <Text style={{ fontWeight: '700' }}>bold</Text>{' '}
            <Text style={{ fontStyle: 'italic' }}>italic</Text>{' '}
            <Text style={{ fontFamily: 'Georgia' }}>Georgia</Text> at{' '}
            <Text style={{ fontSize: 18 }}>18 pt</Text>.
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.label}>Font</Text>
          <Text style={styles.hint}>
            `tabBarItemTitleFontFamily`: &quot;monospace&quot;{'\n'}
            `tabBarItemTitleSmallLabelFontSize`: 8{'\n'}
            `tabBarItemTitleLargeLabelFontSize`: 18{'\n'}
            `tabBarItemTitleFontStyle`: &quot;italic&quot;{'\n'}
            `tabBarItemTitleFontWeight`: &quot;700&quot;{'\n'}
            {'\n'}
            {'\n'}
            Title should render in{' '}
            <Text style={{ fontWeight: '700' }}>bold</Text>{' '}
            <Text style={{ fontStyle: 'italic' }}>italic</Text>{' '}
            <Text style={{ fontFamily: 'monospace' }}>monospace</Text>.
            Unselected tabs use the{' '}
            <Text style={{ fontStyle: 'italic' }}>italic </Text>
            <Text style={{ fontSize: 8 }}>small label size (8sp)</Text>; the
            selected tab scales up to the{' '}
            <Text style={{ fontSize: 18 }}>large label size (18sp)</Text>.
          </Text>
        </>
      )}
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
        truncated by the system tab bar with an ellipsis rather than wrapping or
        overflowing.
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
    },
  },
  {
    name: 'Color',
    Component: ColorTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Color',
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
            normal: {
              tabBarItemTitleFontColor: Colors.BlueDark100,
            },
          },
        },
      },
      android: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.android,
        standardAppearance: {
          selected: {
            tabBarItemTitleFontColor: Colors.RedLight100,
          },
          normal: {
            tabBarItemTitleFontColor: Colors.BlueDark100,
          },
          focused: {
            tabBarItemTitleFontColor: Colors.YellowDark100,
          },
        },
      },
    },
  },
  {
    name: 'FontConfig',
    Component: FontTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Font',
      ios: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
        standardAppearance: {
          stacked: {
            selected: {
              tabBarItemTitleFontFamily: 'Georgia',
              tabBarItemTitleFontSize: 18,
              tabBarItemTitleFontStyle: 'italic',
              tabBarItemTitleFontWeight: '700',
              tabBarItemTitlePositionAdjustment: {
                vertical: -6,
                horizontal: 0,
              },
            },
          },
        },
      },
      android: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.android,
        standardAppearance: {
          tabBarItemTitleFontFamily: 'monospace',
          tabBarItemTitleSmallLabelFontSize: 8,
          tabBarItemTitleLargeLabelFontSize: 18,
          tabBarItemTitleFontStyle: 'italic',
          tabBarItemTitleFontWeight: '700',
        },
      },
    },
  },
];

function TestTabsItemTitle() {
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
  platformHeader: {
    fontWeight: '700',
    color: Colors.LightOffNavy,
  },
});

export default createScenario(TestTabsItemTitle, scenarioDescription);
