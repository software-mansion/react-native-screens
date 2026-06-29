import { createScenario } from '@apps/tests/shared/helpers';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { scenarioDescription } from './scenario-description';
import {
  DEFAULT_TAB_ROUTE_OPTIONS,
  type TabRouteConfig,
  TabsContainer,
  useTabsNavigationContext,
} from '@apps/shared/gamma/containers/tabs';
import { Colors } from '@apps/shared/styling';
import { Rectangle } from '@apps/shared/Rectangle';
import { ScrollViewMarker } from 'react-native-screens/experimental';
import { type ScrollEdgeEffect } from 'react-native-screens';
import {
  StackContainer,
  type StackRouteConfig,
} from '@apps/shared/gamma/containers/stack';

export function TestStackSvmTabsSpecialEffects() {
  return <TabsNavigation />;
}

const TABS_ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Home',
    Component: TabContents,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Home',
      tabBarItemTestID: 'home-tab-item',
      tabBarItemAccessibilityLabel: 'home-tab-item-label',
    },
  },
  {
    name: 'Stack',
    Component: StackTabScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Stack',
      tabBarItemTestID: 'stack-tab-item',
      tabBarItemAccessibilityLabel: 'stack-tab-item-label',
    },
  },
];

const STACK_ROUTE_CONFIGS: StackRouteConfig[] = [
  {
    name: 'First',
    Component: StackContents,
    options: {},
  },
  {
    name: 'Second',
    Component: StackContents,
    options: {},
  },
];

function TabContents() {
  const edgeEffectStyle: ScrollEdgeEffect =
    useTabsNavigationContext().routeKey === 'Home' ? 'hard' : 'soft';

  return (
    <View style={[{ backgroundColor: Colors.BlueLight20 }, styles.fillParent]}>
      <HeuristicBreakingView />
      <ScrollViewMarker
        style={styles.fillParent}
        scrollEdgeEffects={{ top: 'hidden', bottom: edgeEffectStyle }}>
        <ScrollView
          testID={`home-scrollview`}
          contentInsetAdjustmentBehavior="automatic"
          style={styles.fillParent}>
          <ScrollViewContents />
        </ScrollView>
      </ScrollViewMarker>
    </View>
  );
}

function StackContents() {
  return (
    <View style={[{ backgroundColor: Colors.BlueLight20 }, styles.fillParent]}>
      <HeuristicBreakingView />
      <ScrollViewMarker
        style={styles.fillParent}
        scrollEdgeEffects={{ top: 'hidden', bottom: 'hard' }}>
        <ScrollView
          testID={`stack-scrollview`}
          contentInsetAdjustmentBehavior="automatic"
          style={styles.fillParent}>
          <ScrollViewContents />
        </ScrollView>
      </ScrollViewMarker>
    </View>
  );
}

function TabsNavigation() {
  return <TabsContainer routeConfigs={TABS_ROUTE_CONFIGS} />;
}

function StackTabScreen() {
  return <StackContainer routeConfigs={STACK_ROUTE_CONFIGS} />;
}

function ScrollViewContents(props: { elementCount?: number }) {
  const elementCount = props.elementCount ?? 48;
  return (
    <>
      {Array.from({ length: elementCount }).map((_, index) => {
        return (
          <View key={index.toString()} style={[{ width: '100%' }]}>
            <Rectangle
              testID={`${useTabsNavigationContext().routeKey}-item-${index + 1}`}
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

function HeuristicBreakingView() {
  return <View collapsable={false} style={{ width: '100%', height: 0 }}></View>;
}

export default createScenario(
  TestStackSvmTabsSpecialEffects,
  scenarioDescription,
);

const styles = StyleSheet.create({
  fillParent: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
