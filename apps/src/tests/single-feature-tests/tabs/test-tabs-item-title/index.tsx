import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-screens/experimental';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/containers/tabs';
import { Colors } from '@apps/shared/styling';

// "App area" wrappers, one per tab: start below the status bar and (on Android)
// end above the system navigation bar, keeping the tab bar in frame. Argent
// flows crop their snapshots on them — see
// .argent/skills/argent-flow-snapshot-crop/SKILL.md.
const LONG_TITLE_APP_AREA_TEST_ID = 'test-tabs-item-title-long-title-area';
const COLOR_APP_AREA_TEST_ID = 'test-tabs-item-title-color-area';
const FONT_APP_AREA_TEST_ID = 'test-tabs-item-title-font-area';

// Invisible bands covering the bottom third of each app area (the tab bar and
// a strip above it). The flow crops its snapshots on these so the tab content
// text stays out of the image — only the tab bar items are under test here.
const LONG_TITLE_TAB_BAR_BAND_TEST_ID =
  'test-tabs-item-title-long-title-tab-bar-band';
const COLOR_TAB_BAR_BAND_TEST_ID = 'test-tabs-item-title-color-tab-bar-band';
const FONT_TAB_BAR_BAND_TEST_ID = 'test-tabs-item-title-font-tab-bar-band';

function AppArea({
  testID,
  tabBarBandTestID,
  children,
}: {
  testID: string;
  tabBarBandTestID: string;
  children: React.ReactNode;
}) {
  return (
    <SafeAreaView
      edges={{ top: true, bottom: Platform.OS === 'android' }}
      insetType="system"
      style={styles.appArea}>
      <View testID={testID} style={styles.appArea} collapsable={false}>
        {children}
        <View
          testID={tabBarBandTestID}
          pointerEvents="none"
          style={styles.tabBarBand}
          collapsable={false}
        />
      </View>
    </SafeAreaView>
  );
}

function ColorTab() {
  return (
    <AppArea
      testID={COLOR_APP_AREA_TEST_ID}
      tabBarBandTestID={COLOR_TAB_BAR_BAND_TEST_ID}>
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
    </AppArea>
  );
}

function FontTab() {
  return (
    <AppArea
      testID={FONT_APP_AREA_TEST_ID}
      tabBarBandTestID={FONT_TAB_BAR_BAND_TEST_ID}>
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
              When selected: title text should be visibly shifted upward
              relative to a default-positioned label in{' '}
              <Text style={{ color: Colors.GreenDark100 }}>GREEN</Text>
              {'\n'} <Text style={{ fontWeight: '700' }}>bold</Text>{' '}
              <Text style={{ fontStyle: 'italic' }}>italic</Text>{' '}
              <Text style={{ fontFamily: 'Georgia' }}>Georgia</Text> at{' '}
              <Text style={{ fontSize: 18 }}>18 pt</Text>.
            </Text>
          </>
        ) : (
          <>
            {/* "Font Config" (not "Font") so the tab bar item titled "Font" is
              the only exact text match for e2e taps. */}
            <Text style={styles.label}>Font Config</Text>
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
    </AppArea>
  );
}

function LongTitleTab() {
  return (
    <AppArea
      testID={LONG_TITLE_APP_AREA_TEST_ID}
      tabBarBandTestID={LONG_TITLE_TAB_BAR_BAND_TEST_ID}>
      <View style={styles.screen}>
        <Text style={styles.label}>Long Title</Text>
        <Text style={styles.hint}>
          Tab title: &quot;A Very Long Tab Title That Should Truncate&quot;
          {'\n'}
          {'\n'}
          Demonstrates that `options.title` with an overly wide string is
          truncated by the system tab bar with an ellipsis rather than wrapping
          or overflowing.
        </Text>
      </View>
    </AppArea>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'LongTitle',
    element: <LongTitleTab />,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'A Very Long Tab Title That Should Truncate',
    },
  },
  {
    name: 'Color',
    element: <ColorTab />,
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
    element: <FontTab />,
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
  appArea: {
    flex: 1,
  },
  tabBarBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '33%',
  },
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
