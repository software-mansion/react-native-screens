import { SettingsSwitch } from '@apps/shared/SettingsSwitch';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  useTabsHostConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/containers/tabs';
import { Colors } from '@apps/shared/styling';

function ConfigScreen() {
  const { hostConfig, updateHostConfig } = useTabsHostConfig();
  const [bottomPressCount, setBottomPressCount] = React.useState(0);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} testID="tab-bar-hidden-scrollview">
        <Text style={styles.hint}>
          Change flag value by clicking on button.
        </Text>
        <SettingsSwitch
          style={styles.settingsSwitch}
          label="tabBarHidden"
          value={hostConfig.tabBarHidden ?? false}
          onValueChange={value => updateHostConfig({ tabBarHidden: value })}
          testID="tab-bar-hidden-switch"
        />
        <Text style={styles.hint} testID="tab-bar-hidden-press-count">
          {`Bottom presses: ${bottomPressCount}`}
        </Text>
      </ScrollView>
      {/* Anchored to the bottom of the screen so that it sits in the strip the
          tab bar frees up when hidden. See issue #4132. */}
      <Pressable
        style={styles.bottomPressable}
        testID="tab-bar-hidden-bottom-pressable"
        onPress={() => setBottomPressCount(count => count + 1)}>
        <Text>Bottom Pressable</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 40,
  },
  hint: {
    textAlign: 'center',
  },
  settingsSwitch: {
    marginTop: 20,
    marginBottom: 15,
  },
  bottomPressable: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.GreenLight60,
  },
});

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Tab1',
    element: <ConfigScreen />,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      tabBarItemTestID: 'tab-bar-item-1-id',
      tabBarItemAccessibilityLabel: 'First Tab Item',
      title: 'Tab1',
      // Opt out of the SafeAreaView wrapper Android tab screens get by default,
      // so that the content runs edge to edge and the bottom Pressable really
      // sits in the strip the tab bar occupies, whatever the inset resolves to.
      safeAreaConfiguration: { edges: { bottom: false } },
    },
  },
];

function TestTabsTabBarHidden() {
  return <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />;
}

export default createScenario(TestTabsTabBarHidden, scenarioDescription);
