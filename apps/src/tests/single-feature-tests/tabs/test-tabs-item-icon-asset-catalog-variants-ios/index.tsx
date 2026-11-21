import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { SettingsPicker } from '@apps/shared';
import type { TabsHostColorScheme } from 'react-native-screens';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  useTabsHostConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/containers/tabs';
import { Colors } from '@apps/shared/styling';

function ConfigScreen() {
  const { hostConfig, updateHostConfig } = useTabsHostConfig();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Asset catalog light/dark variants</Text>
      <Text style={styles.hint}>
        The "Variants" tab icon is the image set `variant-icon`:{'\n'}
        light variant: a <Text style={styles.yellow}>YELLOW</Text> disc{'\n'}
        dark variant: a <Text style={styles.purple}>PURPLE</Text> disc{'\n'}
        {'\n'}
        `icon`: imageSource uri variant-icon, `renderingMode`: original{'\n'}
        {'\n'}
        Switch the TabsHost color scheme below, or the system one (Cmd+Shift+A
        in the iOS simulator).{'\n'}
        {'\n'}
        Expected: the tab icon follows the scheme: YELLOW in light, PURPLE in
        dark.{'\n'}
        Bug (before the fix): it is always YELLOW, the dark variant is lost.
      </Text>

      <SettingsPicker<NonNullable<TabsHostColorScheme>>
        label={'colorScheme'}
        value={hostConfig.colorScheme ?? 'inherit'}
        onValueChange={value => updateHostConfig({ colorScheme: value })}
        items={['inherit', 'light', 'dark']}
      />
    </ScrollView>
  );
}

function VariantsScreen() {
  return (
    <View style={styles.centered}>
      <Text style={styles.label}>Image set variants</Text>
      <Text style={styles.hint}>
        The tab icon should be a <Text style={styles.yellow}>YELLOW</Text> disc
        in light and a <Text style={styles.purple}>PURPLE</Text> disc in dark.
      </Text>
    </View>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Config',
    element: <ConfigScreen />,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Config',
      ios: {
        icon: { type: 'sfSymbol', name: 'gearshape' },
      },
    },
  },
  {
    name: 'Variants',
    element: <VariantsScreen />,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Variants',
      ios: {
        icon: {
          type: 'imageSource',
          imageSource: { uri: 'variant-icon' },
          renderingMode: 'original',
        },
      },
    },
  },
];

function TestTabsItemIconAssetCatalogVariants() {
  return <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 12,
  },
  centered: {
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
  yellow: {
    color: '#d9a400',
    fontWeight: '600',
  },
  purple: {
    color: '#7326bf',
    fontWeight: '600',
  },
});

export default createScenario(
  TestTabsItemIconAssetCatalogVariants,
  scenarioDescription,
);
