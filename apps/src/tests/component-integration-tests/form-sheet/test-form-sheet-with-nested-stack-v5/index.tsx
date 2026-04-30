import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { FormSheet } from 'react-native-screens/experimental';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import { StackContainer } from '@apps/shared/gamma/containers/stack';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { Colors } from '@apps/shared/styling';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';

const scenarioDescription: ScenarioDescription = {
  name: 'FormSheet with Nested Stack v5',
  key: 'test-formsheet-nested-stack-v5',
  details: 'Test nesting Stack v5 inside a FormSheet',
  platforms: ['ios'],
};

export function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FormSheet with nested StackV5</Text>
      <Button
        title="Open FormSheet"
        color={Colors.primary}
        onPress={() => setIsOpen(true)}
      />
      <FormSheet
        isOpen={isOpen}
        onNativeDismiss={() => setIsOpen(false)}
        detents={[0.6, 1.0]}>
        <View style={styles.sheetContent}>
          <StackSetup />
        </View>
      </FormSheet>
    </View>
  );
}

function StackSetup() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Home',
          Component: HomeScreen,
          options: {},
        },
        {
          name: 'A',
          Component: AScreen,
          options: {
            headerConfig: { title: 'A' },
          },
        },
      ]}
    />
  );
}

function HomeScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.BlueLight40 }}>
      <Text style={styles.screenText}>Home Screen</Text>
      <StackNavigationButtons isPopEnabled={false} routeNames={['A']} />
    </CenteredLayoutView>
  );
}

function AScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.YellowLight40 }}>
      <Text style={styles.screenText}>Screen A</Text>
      <StackNavigationButtons isPopEnabled={true} routeNames={['A']} />
    </CenteredLayoutView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.offBackground,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.text,
  },
  sheetContent: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenText: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default createScenario(App, scenarioDescription);
