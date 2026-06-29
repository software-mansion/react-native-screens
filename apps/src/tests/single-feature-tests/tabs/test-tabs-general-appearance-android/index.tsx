import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  TabsContainer,
  useTabsNavigationContext,
  DEFAULT_TAB_ROUTE_OPTIONS,
  type TabRouteConfig,
} from '@apps/shared/gamma/containers/tabs';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';
import { Colors } from '@apps/shared/styling';
import { SettingsPicker } from '@apps/shared';
import type { TabsScreenAppearanceAndroid } from 'react-native-screens';

type LabelVisibilityMode = NonNullable<
  TabsScreenAppearanceAndroid['tabBarItemLabelVisibilityMode']
>;

const LABEL_VISIBILITY_OPTIONS: LabelVisibilityMode[] = [
  'auto',
  'selected',
  'labeled',
  'unlabeled',
];

function DefaultTab() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Default configuration</Text>
      <Text style={styles.hint}>
        Tab bar renders in the system default configuration.
      </Text>
    </View>
  );
}

function LabelTab() {
  const { routeKey, setRouteOptions } = useTabsNavigationContext();
  const [labelVisibility, setLabelVisibility] =
    useState<LabelVisibilityMode>('auto');

  const onLabelVisibilityChange = useCallback(
    (value: LabelVisibilityMode) => {
      setLabelVisibility(value);
      setRouteOptions(routeKey, {
        android: {
          ...DEFAULT_TAB_ROUTE_OPTIONS.android,
          standardAppearance: {
            tabBarItemLabelVisibilityMode: value,
          },
        },
      });
    },
    [routeKey, setRouteOptions],
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Label Visibility Mode</Text>
      <Text style={styles.hint}>
        Only `tabBarItemLabelVisibilityMode` is defined.{'\n'} Labels follow the
        toggled value.
      </Text>
      <SettingsPicker<LabelVisibilityMode>
        testID="general-appearance-android-label-visibility-picker"
        label="tabBarItemLabelVisibilityMode"
        value={labelVisibility}
        onValueChange={onLabelVisibilityChange}
        items={LABEL_VISIBILITY_OPTIONS}
      />
    </View>
  );
}

function RippleTab() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Ripple Effect</Text>
      <Text style={styles.hint}>
        `tabBarItemLabelVisibilityMode`: 'labeled'
        {'\n'}`tabBarBackgroundColor`:{' '}
        <Text style={{ color: Colors.NavyDark100 }}>NavyDark100</Text>
        {'\n'}`tabBarItemRippleColor`:{' '}
        <Text style={{ color: Colors.YellowDark100 }}>YellowDark100</Text>
        {'\n'}`tabBarItemActiveIndicatorEnabled`: `false`
        {'\n'}`tabBarItemActiveIndicatorColor`:{' '}
        <Text style={{ color: Colors.GreenLight100 }}>GreenLight100</Text>
        {'\n'}
      </Text>
    </View>
  );
}

function IndicatorTab() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Active Indicator Enabled</Text>
      <Text style={styles.hint}>
        `tabBarItemLabelVisibilityMode`: 'labeled'
        {'\n'}`tabBarBackgroundColor`:{' '}
        <Text style={{ color: Colors.PurpleDark100 }}>PurpleDark100</Text>
        {'\n'}`tabBarItemRippleColor`:{' '}
        <Text style={{ color: Colors.YellowDark100 }}>YellowDark100</Text>
        {'\n'}`tabBarItemActiveIndicatorEnabled`: `true`
        {'\n'}`tabBarItemActiveIndicatorColor`:{' '}
        <Text style={{ color: Colors.GreenLight100 }}>GreenLight100</Text>
        {'\n'}
      </Text>
    </View>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Default',
    Component: DefaultTab,
    options: {
      title: 'Default',
      tabBarItemTestID: 'general-appearance-android-tab-default',
      android: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.android,
      },
    },
  },
  {
    name: 'Label',
    Component: LabelTab,
    options: {
      title: 'Label',
      tabBarItemTestID: 'general-appearance-android-tab-label',
      android: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.android,
        standardAppearance: {
          tabBarItemLabelVisibilityMode: 'auto',
        },
      },
    },
  },
  {
    name: 'Ripple',
    Component: RippleTab,
    options: {
      title: 'Ripple',
      tabBarItemTestID: 'general-appearance-android-tab-ripple',
      android: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.android,
        standardAppearance: {
          tabBarBackgroundColor: Colors.NavyDark100,
          tabBarItemRippleColor: Colors.YellowDark100,
          tabBarItemActiveIndicatorEnabled: false,
          tabBarItemActiveIndicatorColor: Colors.GreenLight100,
          tabBarItemLabelVisibilityMode: 'labeled',
        },
      },
    },
  },
  {
    name: 'Indicator',
    Component: IndicatorTab,
    options: {
      title: 'Indicator',
      tabBarItemTestID: 'general-appearance-android-tab-indicator',
      android: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.android,
        standardAppearance: {
          tabBarBackgroundColor: Colors.PurpleDark100,
          tabBarItemRippleColor: Colors.YellowDark100,
          tabBarItemActiveIndicatorEnabled: true,
          tabBarItemActiveIndicatorColor: Colors.GreenLight100,
          tabBarItemLabelVisibilityMode: 'labeled',
        },
      },
    },
  },
];

function TestTabsGeneralAppearance() {
  return <TabsContainer routeConfigs={ROUTE_CONFIGS} />;
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

export default createScenario(TestTabsGeneralAppearance, scenarioDescription);
