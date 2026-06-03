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
      <Text style={styles.label}>Default badge appearance</Text>
      {Platform.OS === 'ios' ? (
        <>
          <Text style={styles.hint}>
            `badgeValue`: "1"{'\n'}{'\n'}
            `standardAppearance` and `scrollEdgeAppearance` are not defined.{'\n'}{'\n'}
            Badges render with the default iOS appearance:
            badge background{' '}
            <Text style={{ color: 'red', fontWeight: 'bold' }}>RED</Text> with white text.
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.hint}>
            `badgeValue`: "1"{'\n'}{'\n'}
            Badge appearance is not defined.{'\n'}{'\n'}
            Badges render with the default system appearance:
            badge background{' '}
            <Text style={{ color: Colors.RedDark120, fontWeight: 'bold' }}>DARK RED</Text> with white text.
          </Text>
        </>
      )}
    </View >
  );
}

function Tab2Screen() {
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.screen}>
        <Text style={styles.label}>Long Badge Value</Text>
        {Platform.OS === 'ios' ? (
          <>
            <Text style={styles.hint}>
              `badgeValue`: "1234567890"{'\n'}{'\n'}
              `standardAppearance`{'\n'}
              `tabBarItemBadgeBackgroundColor`:{' '}
              <Text style={{ color: BADGE.blue, fontWeight: 'bold' }}>BLUE</Text>
              {'\n'}{'\n'}
              `scrollEdgeAppearance`{'\n'}
              `tabBarItemBadgeBackgroundColor`:{' '}
              <Text style={{ color: BADGE.yellow, fontWeight: 'bold' }}>YELLOW</Text>
              {'\n'}{'\n'}
            </Text>
            <View style={styles.spacer} />
            <Text style={styles.hint}>
              Scroll all the way down so the list edge meets the tab bar to apply
              `scrollEdgeAppearance`. Scroll back up to restore `standardAppearance`.
            </Text>
            <View style={styles.spacer} />
          </>
        ) : (
          <>
            <Text style={styles.hint}>
              `badgeValue`: "1234567890" displayed as "999+"{'\n'}{'\n'}
              `tabBarItemBadgeBackgroundColor`:{' '}
              <Text style={{ color: BADGE.blue, fontWeight: 'bold' }}>BLUE</Text>
              {'\n'}
              `tabBarItemBadgeTextColor`:{' '}
              <Text style={{ color: BADGE.yellow, fontWeight: 'bold' }}>YELLOW</Text>
            </Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}

function Tab3Screen() {
  return (
      <View style={styles.screen}>
        <Text style={styles.label}>String Badge Value</Text>
        {Platform.OS === 'ios' ? (
          <>
            <Text style={styles.hint}>
              `badgeValue`: "NEW!"{'\n'}{'\n'}
              selected: `tabBarItemBadgeBackgroundColor`:{' '}
              <Text style={{ color: BADGE.blue, fontWeight: 'bold' }}>BLUE</Text>
              {'\n'}{'\n'}
              normal: `tabBarItemBadgeBackgroundColor`:{' '}
              <Text style={{ color: BADGE.purple, fontWeight: 'bold' }}>PURPLE</Text>
              {'\n'}{'\n'}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.hint}>
              `badgeValue`: "NEW!"{'\n'}{'\n'}
              `tabBarItemBadgeBackgroundColor`:{' '}
              <Text style={{ color: BADGE.purple, fontWeight: 'bold' }}>PURPLE</Text>
              {'\n'}
              `tabBarItemBadgeTextColor`:{' '}
              <Text style={{ color: BADGE.navy, fontWeight: 'bold' }}>NAVY</Text>
            </Text>
          </>
        )}
      </View>
  );
}

function Tab4Screen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Default badge appearance</Text>
      {Platform.OS === 'ios' ? (
        <>
          <Text style={styles.hint}>
            `badgeValue`: "⚠️"{'\n'}{'\n'}
            Badge appearance is defined only for selected tab: setting background to `transparent` value.{'\n'}{'\n'}
            Unselected badges render with the default system appearance:
            badge background{' '}
            <Text style={{ color: 'red', fontWeight: 'bold' }}>RED</Text> with white text.
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.hint}>
            `badgeValue`: "⚠️"{'\n'}{'\n'}
            `tabBarItemBadgeBackgroundColor`: `transparent`
              {'\n'}
              `tabBarItemBadgeTextColor`:{' '}
              <Text style={{ color: BADGE.red, fontWeight: 'bold' }}>RED</Text>
            </Text>
        </>
      )}
    </View >
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Tab1',
    Component: Tab1Screen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab1',
      badgeValue: '1',
      ios: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
      },
      android: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.android,
        standardAppearance: {
          tabBarItemLabelVisibilityMode: 'labeled',
        },
      },
    },
  },
  {
    name: 'Tab2',
    Component: Tab2Screen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab2',
      badgeValue: '1234567890',
      ios: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
        standardAppearance: {
          stacked: { normal: { tabBarItemBadgeBackgroundColor: BADGE.blue } },
        },
        scrollEdgeAppearance: {
          stacked: { normal: { tabBarItemBadgeBackgroundColor: BADGE.yellow } },
        },
      },
      android: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.android,
        standardAppearance: {
          tabBarItemLabelVisibilityMode: 'labeled',
          tabBarItemBadgeBackgroundColor: BADGE.blue,
          tabBarItemBadgeTextColor: BADGE.yellow,
        },
      },
    },
  },
  {
    name: 'Tab3',
    Component: Tab3Screen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab3',
      badgeValue: 'NEW!',
      ios: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
        standardAppearance: {
          stacked: {
            normal: { tabBarItemBadgeBackgroundColor: BADGE.purple },
            selected: { tabBarItemBadgeBackgroundColor: BADGE.blue },
          },
        },
      },
      android: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.android,
        standardAppearance: {
          tabBarItemLabelVisibilityMode: 'labeled',
          tabBarItemBadgeBackgroundColor: BADGE.purple,
          tabBarItemBadgeTextColor: BADGE.navy,
        },
      },
    },
  },
  {
    name: 'Tab4',
    Component: Tab4Screen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab4',
      badgeValue: '⚠️',
      ios: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
        standardAppearance: {
          stacked: {
            selected: { tabBarItemBadgeBackgroundColor: 'transparent' },
          }
        },
      },
      android: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.android,
        standardAppearance: {
          tabBarItemLabelVisibilityMode: 'labeled',
          tabBarItemBadgeBackgroundColor: 'transparent',
          tabBarItemBadgeTextColor: BADGE.red,
        },
      },
    },
  },
];

export function App() {
  return <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />;
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
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
