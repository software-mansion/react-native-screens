import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';
import { Colors } from '@apps/shared/styling';

// Badge colors, reused so the on-screen legend matches the native rendering.
const BADGE = {
  red: Colors.RedLight100,
  green: Colors.GreenDark100,
  blue: Colors.BlueDark100,
  purple: Colors.PurpleDark100,
  yellow: Colors.YellowDark100,
  white: Colors.White,
  navy: Colors.NavyLight100,
};

function Tab1Screen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>standardAppearance</Text>
      <Text style={styles.hint}>
        {Platform.OS === 'ios' ? (
          <>
            `badgeValue`: "1"{'\n'}
            `standardAppearance` badge background color, distinct per layout so
            rotation reveals the active size class:{'\n'}
            {'\n'}
            stacked (portrait){'\n'}
            {'  '}normal: <Text style={{ color: BADGE.red }}>RED</Text>, selected:{' '}
            <Text style={{ color: BADGE.green }}>GREEN</Text>
            {'\n'}{'\n'}
            inline (landscape, regular){'\n'}
            {'  '}normal: <Text style={{ color: BADGE.blue }}>BLUE</Text>, selected:{' '}
            <Text style={{ color: BADGE.purple }}>PURPLE</Text>
            {'\n'}{'\n'}
            compactInline (landscape, compact){'\n'}
            {'  '}normal: <Text style={{ color: BADGE.yellow }}>YELLOW</Text>,
            selected: <Text style={{ color: BADGE.green }}>GREEN</Text>
            {'\n'}
            {'\n'}
            Android: badge background{' '}
            <Text style={{ color: BADGE.red }}>RED</Text> + badge text{' '}
            <Text style={{ color: BADGE.white }}>WHITE</Text> (not per layout).
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
              Title should render in <Text style={{ fontWeight: '700' }}>bold</Text> <Text style={{ fontStyle: 'italic' }}>italic</Text> <Text style={{ fontFamily: 'monospace' }}>monospace</Text>. Unselected tabs use the <Text style={{ fontStyle: 'italic' }}>italic </Text>
              <Text style={{ fontSize: 8 }}>small label size (8sp)</Text>; the selected tab scales up to the <Text style={{ fontSize: 18 }}>large label
                size (18sp)</Text>.
            </Text>
          </>
        )}
      </Text>
    </View>
  );
}

// Tab 2 needs scrollable content so the bottom edge can align with the tab bar
// and trigger `scrollEdgeAppearance`.
function ScrollableInfoScreen() {
  return (
    <ScrollView style={styles.screen}>
      <View>
        <Text style={styles.label}>scrollEdgeAppearance</Text>
        {Platform.OS === 'ios' ? (
          <>
            <Text style={styles.hint}>
              `badgeValue`: "99"{'\n'}
              `standardAppearance` badge background:{' '}
              <Text style={{ color: BADGE.blue }}>BLUE</Text>
              {'\n'}
              `scrollEdgeAppearance` badge background:{' '}
              <Text style={{ color: BADGE.red }}>RED</Text>
              {'\n'}
              {'\n'}
              iOS only — Android has no `scrollEdgeAppearance`, so it falls back to
              its `standardAppearance` badge background{' '}
              <Text style={{ color: BADGE.green }}>GREEN</Text> + text{' '}
              <Text style={{ color: BADGE.navy }}>NAVY</Text>.
            </Text>
            <View style={styles.spacer} />
            <View style={styles.spacer} />
            <Text style={styles.hint}>
              Scroll all the way down so the list edge meets the tab bar to apply
              `scrollEdgeAppearance`. Scroll back up to restore `standardAppearance`.
            </Text>

          </>
        ) : (
          <>
            <View style={styles.screen}>
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
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  // Tab 1 — standardAppearance, badge background color per layout & state.
  {
    name: 'Standard',
    Component: Tab1Screen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Standard',
      badgeValue: '1',
      ios: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
        standardAppearance: {
          stacked: {
            normal: { tabBarItemBadgeBackgroundColor: BADGE.red },
            selected: { tabBarItemBadgeBackgroundColor: BADGE.green },
          },
          inline: {
            normal: { tabBarItemBadgeBackgroundColor: BADGE.blue },
            selected: { tabBarItemBadgeBackgroundColor: BADGE.purple },
          },
          compactInline: {
            normal: { tabBarItemBadgeBackgroundColor: BADGE.yellow },
            selected: { tabBarItemBadgeBackgroundColor: BADGE.green },
          },
        },
      },
      android: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.android,
        standardAppearance: {
          tabBarItemBadgeBackgroundColor: BADGE.red,
          tabBarItemBadgeTextColor: BADGE.white,
        },
      },
    },
  },
  {
    name: 'ScrollEdge',
    Component: ScrollableInfoScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'ScrollEdge',
      badgeValue: '1234567890',
      ios: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
        standardAppearance: {
          stacked: { normal: { tabBarItemBadgeBackgroundColor: BADGE.blue } },
          inline: { normal: { tabBarItemBadgeBackgroundColor: BADGE.blue } },
          compactInline: {
            normal: { tabBarItemBadgeBackgroundColor: BADGE.blue },
          },
        },
        scrollEdgeAppearance: {
          stacked: { normal: { tabBarItemBadgeBackgroundColor: BADGE.red } },
          inline: { normal: { tabBarItemBadgeBackgroundColor: BADGE.red } },
          compactInline: {
            normal: { tabBarItemBadgeBackgroundColor: BADGE.red },
          },
        },
      },
      android: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.android,
        standardAppearance: {
          tabBarItemBadgeBackgroundColor: BADGE.green,
          tabBarItemBadgeTextColor: BADGE.navy,
        },
      },
    },
  },
  // Tab 3 — per-state badge background color (normal / selected / focused / disabled).
  // {
  //   name: 'States',
  //   Component: () => (
  //     <InfoScreen
  //       title="Item states"
  //       lines={
  //         <>
  //           `badgeValue`: "NEW"{'\n'}
  //           `standardAppearance` badge background per state (iOS, applied to all
  //           layouts):{'\n'}
  //           {'\n'}
  //           {'  '}normal: <Text style={{ color: BADGE.blue }}>BLUE</Text>
  //           {'\n'}
  //           {'  '}selected: <Text style={{ color: BADGE.green }}>GREEN</Text>
  //           {'\n'}
  //           {'  '}focused: <Text style={{ color: BADGE.purple }}>PURPLE</Text>
  //           {'\n'}
  //           {'  '}disabled: <Text style={{ color: BADGE.yellow }}>YELLOW</Text>
  //           {'\n'}
  //           {'\n'}
  //           Select / unselect this tab to compare normal vs selected. Focused
  //           applies during keyboard / hardware focus.{'\n'}
  //           {'\n'}
  //           Android: badge colors are global (not per state) — background{' '}
  //           <Text style={{ color: BADGE.purple }}>PURPLE</Text> + text{' '}
  //           <Text style={{ color: BADGE.white }}>WHITE</Text>.
  //         </>
  //       }
  //     />
  //   ),
  //   options: {
  //     ...DEFAULT_TAB_ROUTE_OPTIONS,
  //     title: 'States',
  //     badgeValue: 'NEW',
  //     ios: {
  //       ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
  //       standardAppearance: {
  //         stacked: {
  //           normal: { tabBarItemBadgeBackgroundColor: BADGE.blue },
  //           selected: { tabBarItemBadgeBackgroundColor: BADGE.green },
  //           focused: { tabBarItemBadgeBackgroundColor: BADGE.purple },
  //           disabled: { tabBarItemBadgeBackgroundColor: BADGE.yellow },
  //         },
  //         inline: {
  //           normal: { tabBarItemBadgeBackgroundColor: BADGE.blue },
  //           selected: { tabBarItemBadgeBackgroundColor: BADGE.green },
  //           focused: { tabBarItemBadgeBackgroundColor: BADGE.purple },
  //           disabled: { tabBarItemBadgeBackgroundColor: BADGE.yellow },
  //         },
  //         compactInline: {
  //           normal: { tabBarItemBadgeBackgroundColor: BADGE.blue },
  //           selected: { tabBarItemBadgeBackgroundColor: BADGE.green },
  //           focused: { tabBarItemBadgeBackgroundColor: BADGE.purple },
  //           disabled: { tabBarItemBadgeBackgroundColor: BADGE.yellow },
  //         },
  //       },
  //     },
  //     android: {
  //       ...DEFAULT_TAB_ROUTE_OPTIONS.android,
  //       standardAppearance: {
  //         tabBarItemBadgeBackgroundColor: BADGE.purple,
  //         tabBarItemBadgeTextColor: BADGE.white,
  //       },
  //     },
  //   },
  // },
  // // Tab 4 — control: badgeValue with default (system) badge colors on iOS,
  // // and a strong text/background contrast on Android.
  // {
  //   name: 'Default',
  //   Component: () => (
  //     <InfoScreen
  //       title="Default colors"
  //       lines={
  //         <>
  //           `badgeValue`: "42"{'\n'}
  //           No `tabBarItemBadgeBackgroundColor` override on iOS — the badge uses
  //           the default system (red) background. Control for the other tabs.
  //           {'\n'}
  //           {'\n'}
  //           Android: high-contrast badge — background{' '}
  //           <Text style={{ color: BADGE.yellow }}>YELLOW</Text> + text{' '}
  //           <Text style={{ color: BADGE.navy }}>NAVY</Text>, to verify
  //           `tabBarItemBadgeTextColor` is honored.
  //         </>
  //       }
  //     />
  //   ),
  //   options: {
  //     ...DEFAULT_TAB_ROUTE_OPTIONS,
  //     title: 'Default',
  //     badgeValue: '42',
  //     android: {
  //       ...DEFAULT_TAB_ROUTE_OPTIONS.android,
  //       standardAppearance: {
  //         tabBarItemBadgeBackgroundColor: BADGE.yellow,
  //         tabBarItemBadgeTextColor: BADGE.navy,
  //       },
  //     },
  //   },
  // },
];

export function App() {
  return <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    margin: 24,
    padding: 24,
    gap: 12,

  },
  scrollContent: {
    paddingBottom: 24,
    gap: 12,
  },
  spacer: {
    height: 220,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 24,
    alignSelf: 'center',
  },
  hint: {
    fontSize: 13,
    color: Colors.LightOffNavy,
    lineHeight: 20,
    textAlign: 'center',
  },
  platformHeader: {
    fontWeight: '700',
    color: Colors.LightOffNavy,
  },
});

export default createScenario(App, scenarioDescription);
