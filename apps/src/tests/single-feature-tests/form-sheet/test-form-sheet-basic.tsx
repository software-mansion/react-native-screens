import React, { useState } from 'react';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import { Button, StyleSheet, Text, View } from 'react-native';
import { FormSheet } from 'react-native-screens/experimental';

const scenarioDescription: ScenarioDescription = {
  name: 'Basic functionality',
  key: 'test-formsheet-base',
  details: 'Allows to test the basic functionality of FormSheet component. ',
  platforms: ['ios'],
};

export function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FormSheet Test</Text>
      <Button title="Open FormSheet" onPress={() => setIsOpen(true)} />
      <FormSheet
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        detents={[0.6, 1.0]}>
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>FormSheet content</Text>
          <View style={styles.spacing} />
          <Button title="Dismiss from JS" onPress={() => setIsOpen(false)} />
        </View>
      </FormSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f000',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sheetContent: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
  },
  spacing: {
    height: 32,
  },
});

export default createScenario(App, scenarioDescription);
