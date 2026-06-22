import React from 'react';
import {
  Platform,
  PlatformColor,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';
import { Colors } from '@apps/shared/styling';

function Tab1Screen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Default badge appearance</Text>
      {Platform.OS === 'ios' ? (
        <Text style={styles.hint}>
          `badgeValue`: "1"{'\n'}
          {'\n'}
          `standardAppearance` and `scrollEdgeAppearance` are not defined.{'\n'}
          {'\n'}
          Badges render with the default iOS appearance:
          `tabBarItemBadgeBackgroundColor`{' '}
          <Text
            style={{ color: PlatformColor('systemRed'), fontWeight: 'bold' }}>
            RED
          </Text>{' '}
          with white text.
        </Text>
      ) : (
        <Text style={styles.hint}>
          `badgeValue`: ""{'\n'}
          An empty string badge value renders as a "small dot" using the color
          defined in `tabBarItemBadgeBackgroundColor`, or the system default if
          not set.{'\n'}
          {'\n'}
          Badge appearance is not defined.{'\n'}
          {'\n'}
          Badges render with the default system appearance: background{' '}
          <Text style={{ color: Colors.RedDark120, fontWeight: 'bold' }}>
            DARK RED
          </Text>{' '}
          with white text.
        </Text>
      )}
    </View>
  );
}

function Tab2Screen() {
  return (
    <ScrollView>
      <View style={styles.screen}>
        <Text style={styles.label}>Long Badge Value</Text>
        {Platform.OS === 'ios' ? (
          <>
            <Text style={styles.hint}>
              `badgeValue`: "1234567890"{'\n'}
              {'\n'}
              `standardAppearance`{'\n'}
              `tabBarItemBadgeBackgroundColor`:{' '}
              <Text style={{ color: Colors.BlueDark100, fontWeight: 'bold' }}>
                BLUE
              </Text>
              {'\n'}
              {'\n'}
              `scrollEdgeAppearance`{'\n'}
              `tabBarItemBadgeBackgroundColor`:{' '}
              <Text style={{ color: Colors.YellowDark100, fontWeight: 'bold' }}>
                YELLOW
              </Text>
              {'\n'}
              {'\n'}
            </Text>
            <View style={styles.spacer} />
            <Text style={styles.hint}>
              Scroll all the way down so the list edge meets the tab bar to
              apply `scrollEdgeAppearance`. Scroll back up to restore
              `standardAppearance`.
            </Text>
            <View style={styles.spacer} />
          </>
        ) : (
          <Text style={styles.hint}>
            `badgeValue`: "1234567890" displayed as "999+"{'\n'}
            {'\n'}
            `tabBarItemBadgeBackgroundColor`:{' '}
            <Text style={{ color: Colors.BlueDark100, fontWeight: 'bold' }}>
              BLUE
            </Text>
            {'\n'}
            `tabBarItemBadgeTextColor`:{' '}
            <Text style={{ color: Colors.YellowDark100, fontWeight: 'bold' }}>
              YELLOW
            </Text>
          </Text>
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
        <Text style={styles.hint}>
          `badgeValue`: "NEW!"{'\n'}
          {'\n'}
          selected: `tabBarItemBadgeBackgroundColor`:{' '}
          <Text style={{ color: Colors.BlueDark100, fontWeight: 'bold' }}>
            BLUE
          </Text>
          {'\n'}
          {'\n'}
          normal: `tabBarItemBadgeBackgroundColor`:{' '}
          <Text style={{ color: Colors.PurpleDark100, fontWeight: 'bold' }}>
            PURPLE
          </Text>
          {'\n'}
          {'\n'}
        </Text>
      ) : (
        <Text style={styles.hint}>
          `badgeValue`: "NEW!"{'\n'}
          {'\n'}
          `tabBarItemBadgeBackgroundColor`:{' '}
          <Text style={{ color: Colors.PurpleDark100, fontWeight: 'bold' }}>
            PURPLE
          </Text>
          {'\n'}
          `tabBarItemBadgeTextColor`:{' '}
          <Text style={{ color: Colors.NavyLight100, fontWeight: 'bold' }}>
            NAVY
          </Text>
        </Text>
      )}
    </View>
  );
}

function Tab4Screen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Transparent badge background</Text>
      {Platform.OS === 'ios' ? (
        <Text style={styles.hint}>
          `badgeValue`: "⚠️"{'\n'}
          {'\n'}
          Badge appearance is defined only for selected tab: setting background
          to `transparent` value.{'\n'}
          {'\n'}
          Unselected badges render with the default system appearance: badge
          background{' '}
          <Text
            style={{ color: PlatformColor('systemRed'), fontWeight: 'bold' }}>
            RED
          </Text>{' '}
          with white text.
        </Text>
      ) : (
        <Text style={styles.hint}>
          `badgeValue`: "⚠️"{'\n'}
          {'\n'}
          `tabBarItemBadgeBackgroundColor`: `transparent`
          {'\n'}
          `tabBarItemBadgeTextColor`:{' '}
          <Text style={{ color: Colors.RedLight100, fontWeight: 'bold' }}>
            RED
          </Text>
        </Text>
      )}
    </View>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Tab1',
    Component: Tab1Screen,
    options: {
      title: 'Tab1',
      badgeValue: Platform.OS === 'ios' ? '1' : '',
      tabBarItemTestID: 'tab-badge-item-1',
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
      title: 'Tab2',
      badgeValue: '1234567890',
      tabBarItemTestID: 'tab-badge-item-2',
      ios: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
        standardAppearance: {
          stacked: {
            normal: { tabBarItemBadgeBackgroundColor: Colors.BlueDark100 },
          },
        },
        scrollEdgeAppearance: {
          stacked: {
            normal: { tabBarItemBadgeBackgroundColor: Colors.YellowDark100 },
          },
        },
      },
      android: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.android,
        standardAppearance: {
          tabBarItemLabelVisibilityMode: 'labeled',
          tabBarItemBadgeBackgroundColor: Colors.BlueDark100,
          tabBarItemBadgeTextColor: Colors.YellowDark100,
        },
      },
    },
  },
  {
    name: 'Tab3',
    Component: Tab3Screen,
    options: {
      title: 'Tab3',
      badgeValue: 'NEW!',
      tabBarItemTestID: 'tab-badge-item-3',
      ios: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
        standardAppearance: {
          stacked: {
            normal: { tabBarItemBadgeBackgroundColor: Colors.PurpleDark100 },
            selected: { tabBarItemBadgeBackgroundColor: Colors.BlueDark100 },
          },
        },
      },
      android: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.android,
        standardAppearance: {
          tabBarItemLabelVisibilityMode: 'labeled',
          tabBarItemBadgeBackgroundColor: Colors.PurpleDark100,
          tabBarItemBadgeTextColor: Colors.NavyLight100,
        },
      },
    },
  },
  {
    name: 'Tab4',
    Component: Tab4Screen,
    options: {
      title: 'Tab4',
      badgeValue: '⚠️',
      tabBarItemTestID: 'tab-badge-item-4',
      ios: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
        standardAppearance: {
          stacked: {
            selected: { tabBarItemBadgeBackgroundColor: 'transparent' },
          },
        },
      },
      android: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.android,
        standardAppearance: {
          tabBarItemLabelVisibilityMode: 'labeled',
          tabBarItemBadgeBackgroundColor: 'transparent',
          tabBarItemBadgeTextColor: Colors.RedLight100,
        },
      },
    },
  },
];

export function TestTabsItemBadge() {
  return <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    margin: 24,
    padding: 24,
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
});

export default createScenario(TestTabsItemBadge, scenarioDescription);
