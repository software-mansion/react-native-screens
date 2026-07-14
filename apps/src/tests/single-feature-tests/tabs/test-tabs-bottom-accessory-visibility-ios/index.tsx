import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { SettingsSwitch } from '@apps/shared';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  useTabsHostConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';
import { Colors } from '@apps/shared/styling';

function BottomAccessoryContent() {
  return (
    <View style={styles.accessory}>
      <Text style={styles.accessoryText}>Bottom Accessory</Text>
    </View>
  );
}

function ConfigScreen() {
  const [rendered, setRendered] = useState(true);
  const [hidden, setHidden] = useState(false);
  const { updateHostConfig } = useTabsHostConfig();

  useEffect(() => {
    updateHostConfig({
      ios: {
        bottomAccessory: rendered
          ? () => <BottomAccessoryContent />
          : undefined,
        bottomAccessoryHidden: hidden,
      },
    });
  }, [rendered, hidden, updateHostConfig]);

  return (
    <ScrollView style={styles.container}>
      <SettingsSwitch
        label="rendered"
        value={rendered}
        onValueChange={setRendered}
      />
      <SettingsSwitch label="hidden" value={hidden} onValueChange={setHidden} />
    </ScrollView>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Config',
    Component: ConfigScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Config',
    },
  },
];

function TestTabsBottomAccessoryVisibility() {
  return <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />;
}

export default createScenario(
  TestTabsBottomAccessoryVisibility,
  scenarioDescription,
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  accessory: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.NavyLightTransparent,
  },
  accessoryText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
