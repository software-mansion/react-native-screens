import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import type { TabsScreenAnimation } from 'react-native-screens';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
  useTabsNavigationContext,
} from '@apps/shared/containers/tabs';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

const TAB_NAMES = [
  'First',
  'Second',
  'Third',
  'Fourth',
  'Fifth',
  'Sixth',
] as const;

// Each tab renders its card at a different vertical position, so that two tabs
// visible at once (during a cross-fade) are easy to spot.
const CARD_POSITIONS = ['flex-start', 'center', 'flex-end'] as const;

function ContentView({ index }: { index: number }) {
  const { routeKey, routeOptions, setRouteOptions, selectTab } =
    useTabsNavigationContext();
  const animation: TabsScreenAnimation = routeOptions.animation ?? 'default';

  return (
    <View
      style={[
        styles.content,
        { justifyContent: CARD_POSITIONS[index % CARD_POSITIONS.length] },
      ]}>
      <View style={styles.card}>
        <Text style={styles.title}>{routeKey}</Text>
        <Text testID={`${routeKey}-animation`}>animation: {animation}</Text>
        <Button
          title={`Set animation: ${animation === 'none' ? 'default' : 'none'}`}
          onPress={() =>
            setRouteOptions(routeKey, {
              animation: animation === 'none' ? 'default' : 'none',
            })
          }
        />
        <View style={styles.selectButtons}>
          {TAB_NAMES.filter(name => name !== routeKey).map(name => (
            <Button key={name} title={name} onPress={() => selectTab(name)} />
          ))}
        </View>
      </View>
    </View>
  );
}

// `Third` keeps the system transition so that both behaviors can be compared
// side by side.
const ROUTE_CONFIGS: TabRouteConfig[] = TAB_NAMES.map((name, index) => ({
  name,
  element: <ContentView index={index} />,
  options: {
    ...DEFAULT_TAB_ROUTE_OPTIONS,
    title: name,
    animation: name === 'Third' ? 'default' : 'none',
    style: { backgroundColor: 'transparent' },
  },
}));

function TestTabsScreenAnimation() {
  return (
    <View style={styles.sharedBackground}>
      {/* Rendered behind the tabs host, visible through the transparent tab screens. */}
      <View style={styles.stripe} />
      <View style={StyleSheet.absoluteFill}>
        <TabsContainerWithHostConfigContext
          routeConfigs={ROUTE_CONFIGS}
          nativeContainerStyle={styles.transparent}
        />
      </View>
    </View>
  );
}

export default createScenario(TestTabsScreenAnimation, scenarioDescription);

const styles = StyleSheet.create({
  sharedBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#ffd8a8',
  },
  stripe: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    height: '20%',
    backgroundColor: '#ffa94d',
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 120,
    paddingHorizontal: 24,
  },
  card: {
    alignItems: 'center',
    gap: 4,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  selectButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
