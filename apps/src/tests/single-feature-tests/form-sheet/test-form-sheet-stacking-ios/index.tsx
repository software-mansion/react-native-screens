import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { FormSheet } from 'react-native-screens/experimental';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

const scenarioDescription: ScenarioDescription = {
  name: 'Stacking FormSheets',
  key: 'test-form-sheet-stacking-ios',
  details:
    'Allows testing of stacking multiple FormSheet components with different detents.',
  platforms: ['ios'],
};

export function App() {
  const [isFirstOpen, setIsFirstOpen] = useState(false);
  const [isSecondOpen, setIsSecondOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stacking FormSheets Test</Text>
      <Button
        title="Open First FormSheet"
        color={Colors.primary}
        onPress={() => setIsFirstOpen(true)}
      />

      <FormSheet
        isOpen={isFirstOpen}
        onNativeDismiss={() => setIsFirstOpen(false)}
        detents={[0.4, 1.0]}>
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>First FormSheet</Text>
          <Text style={styles.description}>Detents: [0.4, 1.0]</Text>
          <View style={styles.spacing} />

          <Button
            title="Open Second FormSheet"
            color={Colors.primary}
            onPress={() => setIsSecondOpen(true)}
          />
          <View style={styles.spacing} />
          <Button
            title="Dismiss First FormSheet"
            color={Colors.primary}
            onPress={() => setIsFirstOpen(false)}
          />

          <FormSheet
            isOpen={isSecondOpen}
            onNativeDismiss={() => setIsSecondOpen(false)}
            detents={[0.6, 0.9]}>
            <View
              style={[
                styles.sheetContent,
                { backgroundColor: Colors.offBackground },
              ]}>
              <Text style={styles.sheetTitle}>Second FormSheet</Text>
              <Text style={styles.description}>Detents: [0.6, 0.9]</Text>
              <View style={styles.spacing} />
              <Button
                title="Dismiss Second FormSheet"
                color={Colors.primary}
                onPress={() => setIsSecondOpen(false)}
              />
            </View>
          </FormSheet>
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
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.text,
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 12,
  },
  spacing: {
    height: 24,
  },
});

export default createScenario(App, scenarioDescription);
