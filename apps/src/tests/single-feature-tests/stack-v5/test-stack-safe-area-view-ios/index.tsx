import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-screens/experimental';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  type StackRouteConfig,
} from '@apps/shared/containers/stack';
import { Colors } from '@apps/shared/styling';

const ROUTE_CONFIGS: StackRouteConfig[] = [
  {
    name: 'SafeAreaView',
    element: <SafeAreaViewScreen />,
    options: {
      headerConfig: { title: 'Safe Area View' },
    },
  },
];

function SafeAreaViewScreen() {
  return (
    <SafeAreaView
      edges={{ top: true, bottom: true, left: true, right: true }}
      style={styles.safeArea}
    />
  );
}

function TestStackSafeAreaViewIOS() {
  return <StackContainer routeConfigs={ROUTE_CONFIGS} />;
}

export default createScenario(TestStackSafeAreaViewIOS, scenarioDescription);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    borderWidth: 6,
    borderColor: Colors.RedLight100,
  },
});
