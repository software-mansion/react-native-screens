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
  const [width, setWidth] = useState<number | null>(null);

  return (
    <View
      style={styles.accessory}
      onLayout={event => setWidth(event.nativeEvent.layout.width)}>
      <Text testID="bottom-accessory-width" style={styles.accessoryText}>
        Width: {width === null ? '-' : Math.round(width)}
      </Text>
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
    <ScrollView
      testID="bottom-accessory-size-scrollview"
      style={styles.container}>
      <SettingsSwitch
        testID="rendered-switch"
        label="rendered"
        value={rendered}
        onValueChange={setRendered}
      />
      <SettingsSwitch
        testID="hidden-switch"
        label="hidden"
        value={hidden}
        onValueChange={setHidden}
      />
    </ScrollView>
  );
}

function ScrollScreen() {
  return (
    <ScrollView
      testID="bottom-accessory-size-scroll-tab-scrollview"
      style={styles.scrollTab}
      contentInsetAdjustmentBehavior="automatic">
      {Array.from({ length: 40 }, (_, i) => (
        <View key={i} style={styles.row}>
          <Text>Row {i + 1}</Text>
        </View>
      ))}
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
  {
    name: 'Scroll',
    Component: ScrollScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Scroll',
    },
  },
];

function TestTabsBottomAccessorySize() {
  // The sidebar is available on iPad only in `tabSidebar` mode.
  return (
    <TabsContainerWithHostConfigContext
      routeConfigs={ROUTE_CONFIGS}
      ios={{
        tabBarControllerMode: 'tabSidebar',
        tabBarMinimizeBehavior: 'onScrollDown',
      }}
    />
  );
}

export default createScenario(TestTabsBottomAccessorySize, scenarioDescription);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollTab: {
    flex: 1,
  },
  row: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.NavyLight20,
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
