import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  TabRouteConfig,
  TabsContainer,
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

function RippleIndicatorTab() {
  const { routeKey, setRouteOptions } = useTabsNavigationContext();
  const [activeIndicatorEnabled, setActiveIndicatorEnabled] = useState(false);

  const onActiveIndicatorChange = useCallback(
    (value: boolean) => {
      setActiveIndicatorEnabled(value);
      setRouteOptions(routeKey, {
        android: {
          ...DEFAULT_TAB_ROUTE_OPTIONS.android,
          standardAppearance: {
            tabBarBackgroundColor: Colors.PurpleDark100,
            tabBarItemRippleColor: Colors.YellowDark100,
            tabBarItemActiveIndicatorEnabled: value,
            tabBarItemActiveIndicatorColor: Colors.GreenLight100,
          },
        },
      });
    },
    [routeKey, setRouteOptions],
  );
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>
        Ripple Color
      </Text>
      <Text style={styles.hint}>
        `tabBarBackgroundColor`:{' '}
        <Text style={{ color: Colors.PurpleDark100 }}>PurpleDark100</Text>
        {'\n'}
        `tabBarItemRippleColor`:{' '}
        <Text style={{ color: Colors.YellowDark100 }}>YellowDark100</Text>
        {'\n'}

        `tabBarItemActiveIndicatorColor`:{' '}
        <Text style={{ color: Colors.GreenLight100 }}>GreenLight100</Text>
        {'\n'}
      </Text>
      <SettingsSwitch
        style={{ marginTop: 20, marginBottom: 15 }}
        label="tabBarItemActiveIndicatorEnabled"
        value={activeIndicatorEnabled}
        onValueChange={onActiveIndicatorChange}
        testID="tab-bar-active-indicator-switch"
      />
    </View>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Default',
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
    name: 'Custom',
    Component: RippleIndicatorTab,
    options: {
      title: 'Custom',
      android: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.android,
        standardAppearance: {
          tabBarBackgroundColor: Colors.PurpleDark100,
          tabBarItemRippleColor: Colors.YellowDark100,
          tabBarItemActiveIndicatorEnabled: false,
          tabBarItemActiveIndicatorColor: Colors.GreenLight100,
        },
      },
    },
  },
];
export function App() {
  return (
    <TabsContainer routeConfigs={ROUTE_CONFIGS}/>
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
