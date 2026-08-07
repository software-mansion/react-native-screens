import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { SettingsPicker, SettingsSwitch } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import {
  type StackHeaderConfigProps,
  type StackHeaderConfigPropsAndroid,
  type StackHeaderToolbarMenuElementAndroid,
  ScrollViewMarker,
} from 'react-native-screens';

const TINT_COLOR_OPTIONS = ['default', 'purple', 'red', 'green'] as const;
type TintColorOption = (typeof TINT_COLOR_OPTIONS)[number];

const ICON_OPTIONS = ['default', 'imageSource', 'drawableResource'] as const;
type IconOption = (typeof ICON_OPTIONS)[number];

interface Config {
  icon: IconOption;
  tintColorNormal: TintColorOption;
  tintColorPressed: TintColorOption;
  tintColorFocused: TintColorOption;
  showMenuItems: boolean;
}

const DEFAULT_CONFIG: Config = {
  icon: 'default',
  tintColorNormal: 'default',
  tintColorPressed: 'default',
  tintColorFocused: 'default',
  showMenuItems: true,
};

function resolveTintColor(
  option: TintColorOption,
): StackHeaderConfigPropsAndroid['overflowIconTintColorNormal'] {
  switch (option) {
    case 'purple':
      return Colors.PurpleLight100;
    case 'red':
      return Colors.RedLight100;
    case 'green':
      return Colors.GreenLight100;
    default:
      return undefined;
  }
}

function resolveIcon(
  option: IconOption,
): StackHeaderConfigPropsAndroid['overflowIcon'] {
  switch (option) {
    case 'imageSource':
      return {
        type: 'imageSource',
        imageSource: require('@assets/search_black.png'),
      };
    case 'drawableResource':
      return {
        type: 'drawableResource',
        name: 'sym_call_missed',
      };
    default:
      return undefined;
  }
}

// All items use showAsAction 'never' so they land in the overflow popup, keeping
// the overflow (three-dots) button visible.
const MENU_ITEMS: StackHeaderToolbarMenuElementAndroid[] = [
  { type: 'menuItem', id: 'item-1', title: 'First', showAsAction: 'never' },
  { type: 'menuItem', id: 'item-2', title: 'Second', showAsAction: 'never' },
  { type: 'menuItem', id: 'item-3', title: 'Third', showAsAction: 'never' },
];

function buildHeaderConfig(config: Config): StackHeaderConfigProps {
  return {
    title: 'Overflow Icon Test',
    android: {
      overflowIcon: resolveIcon(config.icon),
      overflowIconTintColorNormal: resolveTintColor(config.tintColorNormal),
      overflowIconTintColorPressed: resolveTintColor(config.tintColorPressed),
      overflowIconTintColorFocused: resolveTintColor(config.tintColorFocused),
      toolbarMenu: { children: config.showMenuItems ? MENU_ITEMS : [] },
    },
  };
}

function TestStackOverflowIcon() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Main',
          Component: MainScreen,
        },
      ]}
    />
  );
}

function MainScreen() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const { setRouteOptions, routeKey } = useStackNavigationContext();

  const updateConfig = useCallback(
    <K extends keyof Config>(key: K, value: Config[K]) => {
      setConfig(prev => ({ ...prev, [key]: value }));
    },
    [],
  );

  const headerConfig = useMemo(() => buildHeaderConfig(config), [config]);

  useEffect(() => {
    setRouteOptions(routeKey, { headerConfig });
  }, [headerConfig, setRouteOptions, routeKey]);

  return (
    <ScrollViewMarker style={styles.scrollViewMarker}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Overflow Icon</Text>
        <SettingsPicker<IconOption>
          label="icon"
          value={config.icon}
          onValueChange={v => updateConfig('icon', v)}
          items={[...ICON_OPTIONS]}
        />
        <SettingsPicker<TintColorOption>
          label="tintColorNormal"
          value={config.tintColorNormal}
          onValueChange={v => updateConfig('tintColorNormal', v)}
          items={[...TINT_COLOR_OPTIONS]}
        />
        <SettingsPicker<TintColorOption>
          label="tintColorPressed"
          value={config.tintColorPressed}
          onValueChange={v => updateConfig('tintColorPressed', v)}
          items={[...TINT_COLOR_OPTIONS]}
        />
        <SettingsPicker<TintColorOption>
          label="tintColorFocused"
          value={config.tintColorFocused}
          onValueChange={v => updateConfig('tintColorFocused', v)}
          items={[...TINT_COLOR_OPTIONS]}
        />
        <Text style={styles.heading}>Menu</Text>
        <SettingsSwitch
          label="showMenuItems"
          value={config.showMenuItems}
          onValueChange={v => updateConfig('showMenuItems', v)}
        />
      </ScrollView>
    </ScrollViewMarker>
  );
}

const styles = StyleSheet.create({
  scrollViewMarker: {
    flex: 1,
  },
  scroll: {
    backgroundColor: Colors.cardBackground,
  },
  content: {
    padding: 16,
    gap: 6,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
});

export default createScenario(TestStackOverflowIcon, scenarioDescription);
