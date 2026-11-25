import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';
import {
  DEFAULT_TAB_ROUTE_OPTIONS,
  type TabRouteConfig,
  TabsContainer,
} from '@apps/shared/containers/tabs';
import {
  StackContainer,
  type StackRouteConfig,
} from '@apps/shared/containers/stack';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { Colors } from '@apps/shared/styling';

// The first appearance happens once per stack, so there are two stack tabs:
// two checks before the scenario has to be reopened.
const TABS_ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Home',
    element: <HomeTabScreen />,
    options: {
      title: 'Home',
      tabBarItemAccessibilityLabel: 'home-tab-item-label',
      ...DEFAULT_TAB_ROUTE_OPTIONS,
    },
  },
  {
    name: 'StackA',
    element: <StackTabScreen title="Stack A" />,
    options: {
      title: 'Stack A',
      tabBarItemAccessibilityLabel: 'stack-a-tab-item-label',
      ...DEFAULT_TAB_ROUTE_OPTIONS,
    },
  },
  {
    name: 'StackB',
    element: <StackTabScreen title="Stack B" />,
    options: {
      title: 'Stack B',
      tabBarItemAccessibilityLabel: 'stack-b-tab-item-label',
      ...DEFAULT_TAB_ROUTE_OPTIONS,
    },
  },
];

export function TestStackTabsStackInTabsStableFirstAppearance() {
  return <TabsContainer routeConfigs={TABS_ROUTE_CONFIGS} />;
}

function HomeTabScreen() {
  return (
    <CenteredLayoutView style={styles.homeTab}>
      <Text style={styles.label}>Home</Text>
      <Text style={styles.hint}>
        Select a stack tab and watch its content as it appears.
      </Text>
    </CenteredLayoutView>
  );
}

function StackTabScreen({ title }: { title: string }) {
  const routeConfigs = React.useMemo<StackRouteConfig[]>(
    () => [
      {
        name: 'Root',
        element: <StackScreenContents />,
        options: {
          headerConfig: { title },
        },
      },
    ],
    [title],
  );

  return <StackContainer routeConfigs={routeConfigs} />;
}

// The "Centered" bar sits in the middle of the frame of the screen, so it
// moves by half of the difference whenever that frame changes. The "Top edge"
// bar does not depend on the height of the frame and stays in place as the
// reference.
function StackScreenContents() {
  return (
    <View style={styles.stackScreen}>
      <View style={styles.bar}>
        <Text style={styles.barText}>Top edge</Text>
      </View>
      <View style={styles.centerArea}>
        <View style={styles.bar}>
          <Text style={styles.barText}>Centered</Text>
        </View>
      </View>
    </View>
  );
}

export default createScenario(
  TestStackTabsStackInTabsStableFirstAppearance,
  scenarioDescription,
);

const styles = StyleSheet.create({
  homeTab: {
    backgroundColor: Colors.NavyLight10,
    gap: 12,
    padding: 24,
  },
  stackScreen: {
    flex: 1,
    backgroundColor: Colors.BlueLight20,
  },
  centerArea: {
    flex: 1,
    justifyContent: 'center',
  },
  bar: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: Colors.NavyLight80,
  },
  barText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
  },
  hint: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
});
