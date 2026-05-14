import React, { useState } from 'react';
import { Button, StyleSheet, Switch, Text, View } from 'react-native';
import { FormSheet } from 'react-native-screens/experimental';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

const scenarioDescription: ScenarioDescription = {
  name: 'Grabber visibility',
  key: 'test-form-sheet-grabber-visible-ios',
  details:
    'Allows to test the `prefersGrabberVisible` prop of the FormSheet component.',
  platforms: ['ios'],
};

export function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [prefersGrabberVisible, setPrefersGrabberVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FormSheet Grabber Test</Text>
      <View style={styles.row}>
        <Text style={styles.label}>prefersGrabberVisible</Text>
        <Switch
          value={prefersGrabberVisible}
          onValueChange={setPrefersGrabberVisible}
        />
      </View>
      <Button
        title="Open FormSheet"
        color={Colors.primary}
        onPress={() => setIsOpen(true)}
      />
      <FormSheet
        isOpen={isOpen}
        onNativeDismiss={() => setIsOpen(false)}
        detents={[0.6, 1.0]}
        prefersGrabberVisible={prefersGrabberVisible}>
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>FormSheet content</Text>
          <View style={styles.row}>
            <Text style={styles.label}>prefersGrabberVisible</Text>
            <Switch
              value={prefersGrabberVisible}
              onValueChange={setPrefersGrabberVisible}
            />
          </View>
          <View style={styles.spacing} />
          <Button
            title="Dismiss from JS"
            color={Colors.primary}
            onPress={() => setIsOpen(false)}
          />
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  label: {
    fontSize: 16,
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
    marginBottom: 12,
    color: Colors.text,
  },
  spacing: {
    height: 32,
  },
});

export default createScenario(App, scenarioDescription);
