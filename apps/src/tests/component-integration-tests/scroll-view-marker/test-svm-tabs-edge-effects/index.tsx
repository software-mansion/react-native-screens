import { createScenario } from '@apps/tests/shared/helpers';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { scenarioDescription } from './scenario-description';
import {
  DEFAULT_TAB_ROUTE_OPTIONS,
  TabRouteConfig,
  TabsContainer,
  useTabsNavigationContext,
} from '@apps/shared/gamma/containers/tabs';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { Colors } from '@apps/shared/styling';
import { TabsRouteInformation } from '@apps/tests/single-feature-tests/tabs/test-tabs-appearance-defined-by-selected-tab';
import { Rectangle } from '@apps/shared/Rectangle';
import { ScrollContent } from '@apps/tests/single-feature-tests/tabs/test-tabs-override-scroll-view-content-inset-ios';
import { ScrollViewMarker } from 'react-native-screens/experimental';
import { ScrollEdgeEffect } from 'react-native-screens';

export function App() {
  return <TabsNavigation />;
}

const TABS_ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Home',
    Component: TabContents,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Home',
    },
  },
  {
    name: 'Second',
    Component: TabContents,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Second',
    },
  },
];

export function TabContents() {
  const edgeEffectStyle: ScrollEdgeEffect =
    useTabsNavigationContext().routeKey === 'Home' ? 'hard' : 'soft';

  return (
    <View style={[{ backgroundColor: Colors.BlueLight20 }, styles.fillParent]}>
      <ScrollViewMarker
        style={styles.fillParent}
        scrollEdgeEffects={{ top: 'hidden', bottom: edgeEffectStyle }}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.fillParent}>
          <ScrollViewContents />
        </ScrollView>
      </ScrollViewMarker>
    </View>
  );
}

export function TabsNavigation() {
  return <TabsContainer routeConfigs={TABS_ROUTE_CONFIGS} />;
}

export function ScrollViewContents(props: { elementCount?: number }) {
  const elementCount = props.elementCount ?? 48;
  return (
    <>
      {Array.from({ length: elementCount }).map((_, index) => {
        return (
          <View key={index.toString()} style={[{ width: '100%' }]}>
            <Rectangle
              key={index.toString()}
              color={Colors.RedDark100}
              width={'100%'}
              height={128}
            />
            <View style={[{ width: '100%', height: 12 }]} />
          </View>
        );
      })}
    </>
  );
}

export function HeuristicBeakingView() {
  return (
    <View
      style={{ width: '100%', height: 64, backgroundColor: Colors.RedLight60 }}>
      <Text>
        Purpose of this view is to break the ScrollViewFinding heuristic
      </Text>
    </View>
  );
}

export default createScenario(App, scenarioDescription);

const styles = StyleSheet.create({
  fillParent: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
