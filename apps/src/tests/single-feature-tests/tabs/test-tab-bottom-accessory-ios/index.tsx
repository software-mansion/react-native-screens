import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import LongText from '@apps/shared/LongText';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  useTabsHostConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';

const scenarioDescription: ScenarioDescription = {
  name: 'Bottom Accessory (iOS)',
  key: 'test-tab-bottom-accessory-ios',
  details:
    'Test bottomAccessory factory rendering for regular and inline environments on iOS 26+.',
  platforms: ['ios'],
};

function ShortViewUL() {
  return (
    <View style={[styles.shortView, { alignItems: 'flex-start', justifyContent: 'flex-start' }]}>
      <Text style={styles.shortViewText}>Upper Left</Text>
    </View>
  );
}

function ShortViewC() {
  return (
    <View style={[styles.shortView, { alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={styles.shortViewText}>Center</Text>
    </View>
  );
}

function ShortViewLR() {
  return (
    <View style={[styles.shortView, { alignItems: 'flex-end', justifyContent: 'flex-end' }]}>
      <Text style={styles.shortViewText}>Lower Right</Text>
    </View>
  );
}

function LongView() {
  return (
    <View style={styles.fullView}>
      <LongText />
    </View>
  );
}

function RGBView() {
  return (
    <View style={styles.fullView}>
      <View style={[styles.rgbStrip, { backgroundColor: '#ff4d4d' }]} />
      <View style={[styles.rgbStrip, { backgroundColor: '#4dff4d' }]} />
      <View style={[styles.rgbStrip, { backgroundColor: '#4d4dff' }]} />
    </View>
  );
}

const ACCESSORY_VARIANTS: { id: number; Content: React.ComponentType }[] = [
  { id: 0, Content: ShortViewUL },
  { id: 1, Content: ShortViewC },
  { id: 2, Content: ShortViewLR },
  { id: 3, Content: LongView },
  { id: 4, Content: RGBView },
];

export function ConfigScreen() {
  const [selected, setSelected] = useState(0);
  const { updateHostConfig } = useTabsHostConfig();

  useEffect(() => {
    const { Content } = ACCESSORY_VARIANTS[selected];
    updateHostConfig({
      ios: { bottomAccessory: () => <Content /> },
    });
  }, [selected, updateHostConfig]);

  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      <Text style={styles.sectionHeader}>Bottom Accessory Content</Text>
      {ACCESSORY_VARIANTS.map(({ id, Content }) => (
        <Pressable
          key={id}
          onPress={() => setSelected(id)}
          style={[
            styles.card,
            selected === id ? styles.selectedCard : styles.unselectedCard,
          ]}>
          <Content />
        </Pressable>
      ))}
    </ScrollView>
  );
}

export function ScrollTab() {
  const { updateHostConfig } = useTabsHostConfig();

  useEffect(() => {
    updateHostConfig({ ios: { tabBarMinimizeBehavior: 'onScrollDown' } });
  }, [updateHostConfig]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentInsetAdjustmentBehavior="automatic"
      testID="scroll-tab">
      {Array.from({ length: 40 }, (_, i) => (
        <View key={i} style={styles.scrollItem}>
          <Text style={styles.scrollItemText}>
            Row {i + 1} — scroll to trigger inline environment
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Config',
    Component: ConfigScreen,
    options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'Config' },
  },
  {
    name: 'Scroll',
    Component: ScrollTab,
    options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'Scroll' },
  },
];

export function App() {
  return <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#888',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  card: {
    height: 60,
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
  },
  selectedCard: {
    borderColor: '#007AFF',
  },
  unselectedCard: {
    borderColor: '#ddd',
  },
  scrollItem: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  scrollItemText: {
    fontSize: 14,
    color: '#333',
  },
  shortView: {
    flex: 1,
  },
  shortViewText: {
    backgroundColor: '#4dff4d',
  },
  fullView: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  rgbStrip: {
    flex: 1,
  },
});

export default createScenario(App, scenarioDescription);
