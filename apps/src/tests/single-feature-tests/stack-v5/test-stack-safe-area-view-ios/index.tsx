import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
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
    <SafeAreaView edges={{ top: true, bottom: true }} style={styles.safeArea}>
      <RectanglesPair upperStyle={styles.red} lowerStyle={styles.green} />
      <RectanglesPair upperStyle={styles.blue} lowerStyle={styles.magenta} />
    </SafeAreaView>
  );
}

function RectanglesPair({
  upperStyle,
  lowerStyle,
}: {
  upperStyle: ViewStyle;
  lowerStyle: ViewStyle;
}) {
  return (
    <View>
      <View style={[styles.rectangle, upperStyle]} />
      <View style={[styles.rectangle, lowerStyle]} />
    </View>
  );
}

function TestStackSafeAreaViewIOS() {
  return <StackContainer routeConfigs={ROUTE_CONFIGS} />;
}

export default createScenario(TestStackSafeAreaViewIOS, scenarioDescription);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  rectangle: {
    height: 60,
  },
  green: {
    backgroundColor: Colors.GreenDark100,
  },
  red: {
    backgroundColor: Colors.RedLight100,
  },
  blue: {
    backgroundColor: Colors.BlueDark100,
  },
  magenta: {
    backgroundColor: 'magenta',
  },
});
