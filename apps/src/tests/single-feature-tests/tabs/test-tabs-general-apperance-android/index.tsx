import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  TabsContainer,
  useTabsHostConfig,
  useTabsNavigationContext,
} from '@apps/shared/gamma/containers/tabs';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';
import { Colors } from '@apps/shared/styling';
import { DEFAULT_TAB_ROUTE_OPTIONS } from '@apps/shared/gamma/containers/tabs';
import { SettingsPicker, SettingsSwitch } from '@apps/shared';
import { TabsScreenAppearanceAndroid } from 'react-native-screens';

type LabelVisibilityMode = NonNullable<TabsScreenAppearanceAndroid['tabBarItemLabelVisibilityMode']>;

const LABEL_VISIBILITY_OPTIONS: LabelVisibilityMode[] = [
  'auto',
  'selected',
  'labeled',
  'unlabeled',
];

function LabelTab() {
  const { routeKey, setRouteOptions } = useTabsNavigationContext();
  const [labelVisibility, setLabelVisibility] = useState<LabelVisibilityMode>('auto');

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
      <Text style={styles.label}>
        Label Visibility Mode
      </Text>
      <Text style={styles.hint}>
        Only `tabBarItemLabelVisibilityMode` is defined.{'\n'}
        Tab bar renders in the system default configuration, except for labels, which follow the toggled value.
      </Text>
      <SettingsPicker<LabelVisibilityMode>
        label="tabBarItemLabelVisibilityMode"
        value={labelVisibility}
        onValueChange={onLabelVisibilityChange}
        items={LABEL_VISIBILITY_OPTIONS}
      />
    </View>
  );
}

function IndicatorTab() {
  const { hostConfig, updateHostConfig } = useTabsHostConfig();
 

  return (
    <View style={styles.screen}>
      <Text style={styles.label}>
        Active Indicator Enabled
      </Text>
      <Text style={styles.hint}>
        `tabBarBackgroundColor`:{' '}
        <Text style={{ color: Colors.PurpleDark100 }}>PurpleDark100</Text>
        {'\n'}
        `tabBarItemActiveIndicatorColor`:{' '}
        <Text style={{ color: Colors.PurpleDark120 }}>PurpleDark120</Text>
        {'\n'}
      </Text>
      <SettingsSwitch
              style={{ marginTop: 20, marginBottom: 15 }}
              label="tabBarItemActiveIndicatorEnabled"
              value={hostConfig.tabBarItemActiveIndicatorEnabled ?? true}
              onValueChange={value => updateHostConfig({ tabBarHidden: value })}
            />
    </View>
  );
}

function RippleTab() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>
        Ripple Color
      </Text>
      <Text style={styles.hint}>
        `tabBarBackgroundColor`:{' '}
        <Text style={{ color: Colors.NavyDark100 }}>NavyDark100</Text>
        {'\n'}
        `tabBarItemRippleColor`:{' '}
        <Text style={{ color: Colors.YellowDark100 }}>YellowDark100</Text>
        {'\n'}
        {'\n'}
        `tabBarItemActiveIndicatorEnabled`: false
        {'\n'}
        `tabBarItemActiveIndicatorColor`:{' '}
        <Text style={{ color: Colors.GreenLight100 }}>GreenLight100</Text>
        {'\n'}
      </Text>
    </View>
  );
}

export function TabsRouteInformation() {
  const navigation = useTabsNavigationContext();
  return (
    <View>
      <Text>{navigation.routeKey}</Text>
    </View>
  );
}

export function App() {
  return (
    <TabsContainer
      routeConfigs={[
        {
          name: 'Label',
          Component: LabelTab,
          options: {
            title: 'Label',
            android: {
              ...DEFAULT_TAB_ROUTE_OPTIONS.android,
              standardAppearance: {
                tabBarItemLabelVisibilityMode: 'auto',
              },
            },
          },
        },
        {
          name: 'Indicator',
          Component: IndicatorTab,
          options: {
            title: 'Indicator',
            android: {
              ...DEFAULT_TAB_ROUTE_OPTIONS.android,
              standardAppearance: {
                tabBarBackgroundColor: Colors.PurpleDark100,
                tabBarItemActiveIndicatorEnabled: true,
                tabBarItemActiveIndicatorColor: Colors.PurpleDark120,
              },
            },
          },
        },
        {
          name: 'Ripple',
          Component: RippleTab,
          options: {
            title: 'Ripple',
            android: {
              ...DEFAULT_TAB_ROUTE_OPTIONS.android,
              standardAppearance: {
                tabBarBackgroundColor: Colors.NavyDark100,
                tabBarItemRippleColor: Colors.YellowDark100,
                tabBarItemActiveIndicatorEnabled: false,
                tabBarItemActiveIndicatorColor: Colors.GreenLight100,
              },
            },
          },
        },
      ]}
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
