import LongText from '@apps/shared/LongText';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  useTabsHostConfig,
  useTabsNavigationContext,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';

const scenarioDescription: ScenarioDescription = {
  name: 'Bottom Accessory',
  key: 'test-tabs-bottom-accessory-layout-ios',
  details: 'Test tabs bottom accessory with various contents',
  platforms: ['ios'],
};

function ShortViewUL() {
  return (
    <View
      style={[
        styles.shortView,
        { alignItems: 'flex-start', justifyContent: 'flex-start' },
      ]}>
      <Text testID="accessory-upper-left" style={styles.shortViewText}>Upper Left</Text>
    </View>
  );
}

function ShortViewC() {
  return (
    <View
      style={[
        styles.shortView,
        { alignItems: 'center', justifyContent: 'center' },
      ]}>
      <Text testID="accessory-center" style={styles.shortViewText}>Center</Text>
    </View>
  );
}

function ShortViewLR() {
  return (
    <View
      style={[
        styles.shortView,
        { alignItems: 'flex-end', justifyContent: 'flex-end' },
      ]}>
      <Text testID="accessory-lower-right" style={styles.shortViewText}>Lower Right</Text>
    </View>
  );
}

function LongView() {
  return (
    <View style={styles.fullView} testID="accessory-long">
      <LongText />
    </View>
  );
}

function RGBView() {
  return (
    <View style={styles.fullView} testID="accessory-rgb">
      <View style={[styles.rgbStrip, { backgroundColor: '#ff4d4d' }]} testID='rgb-strip-0' />
      <View style={[styles.rgbStrip, { backgroundColor: '#4dff4d' }]} testID='rgb-strip-1' />
      <View style={[styles.rgbStrip, { backgroundColor: '#4d4dff' }]} testID='rgb-strip-2' />
    </View>
  );
}

const ACCESSORY_VARIANTS = [
  { id: 0, content: ShortViewUL, testID: 'variant-upper-left' },
  { id: 1, content: ShortViewC, testID: 'variant-center' },
  { id: 2, content: ShortViewLR, testID: 'variant-lower-right' },
  { id: 3, content: LongView, testID: 'variant-long' },
  { id: 4, content: RGBView, testID: 'variant-rgb' },
];

function ConfigScreen() {
  const [selected, setSelected] = useState(0);
  const { updateHostConfig } = useTabsHostConfig();

  useEffect(() => {
    updateHostConfig({
      ios: { bottomAccessory: ACCESSORY_VARIANTS[selected].content },
    });
  }, [selected, updateHostConfig]);

  return (
    <ScrollView testID="config-scrollview" style={styles.container}>
      {ACCESSORY_VARIANTS.map(item => (
        <Pressable
          key={item.id}
          testID={item.testID}
          accessibilityState={{ selected: selected === item.id }}
          onPress={() => setSelected(item.id)}
          style={[
            styles.card,
            selected === item.id ? styles.selectedCard : styles.unselectedCard,
          ]}>
          {item.content}
        </Pressable>
      ))}
    </ScrollView>
  );
}

function ScrollDownTab() {
  const { updateHostConfig } = useTabsHostConfig();
  const { isSelected } = useTabsNavigationContext();

  useEffect(() => {
    if (!isSelected) return;
    updateHostConfig({ ios: { tabBarMinimizeBehavior: 'onScrollDown' } });
  }, [isSelected, updateHostConfig]);

  return (
    <ScrollView
      testID="scroll-down-scrollview"
      style={{ flex: 1 }}
      contentInsetAdjustmentBehavior="automatic">
      {Array.from({ length: 40 }, (_, i) => (
        <View key={i} style={styles.scrollItem}>
          <Text
            testID={`scroll-down-item-${i+1}`}
            style={styles.scrollItemText}>
            Row {i + 1}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

function ScrollUpTab() {
  const { updateHostConfig } = useTabsHostConfig();
  const { isSelected } = useTabsNavigationContext();

  useEffect(() => {
    if (!isSelected) return;
    updateHostConfig({ ios: { tabBarMinimizeBehavior: 'onScrollUp' } });
  }, [isSelected, updateHostConfig]);

  const scrollViewRef = React.useRef<ScrollView>(null);

  return (
    <ScrollView
      ref={scrollViewRef}
      testID="scroll-up-scrollview"
      style={{ flex: 1 }}
      contentInsetAdjustmentBehavior="automatic"
      onContentSizeChange={() =>
        scrollViewRef.current?.scrollToEnd({ animated: false })
      }>
      {Array.from({ length: 40 }, (_, i) => (
        <View key={i} style={styles.scrollItem}>
          <Text
            testID={`scroll-up-item-${i+1}`}
            style={styles.scrollItemText}>
            Row {i + 1}
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
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Config',
      tabBarItemTestID: 'config-tab-item',
      tabBarItemAccessibilityLabel: 'config-tab-item-label',
    },
  },
  {
    name: 'ScrollDown',
    Component: ScrollDownTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'ScrollDown',
      tabBarItemTestID: 'scroll-down-tab-item',
      tabBarItemAccessibilityLabel: 'scroll-down-tab-item-label',
    },
  },
  {
    name: 'ScrollUp',
    Component: ScrollUpTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'ScrollUp',
      tabBarItemTestID: 'scroll-up-tab-item',
      tabBarItemAccessibilityLabel: 'scroll-up-tab-item-label',
    },
  },
];

export function App() {
  return <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />;
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    height: '100%',
    padding: 20,
  },
  card: {
    flex: 1,
    height: 60,
    marginTop: 20,
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
  rgbStrip: {
    flex: 1,
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
});

export default createScenario(App, scenarioDescription);
