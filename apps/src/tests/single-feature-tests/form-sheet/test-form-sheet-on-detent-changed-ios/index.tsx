import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { FormSheet } from 'react-native-screens/experimental';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

const scenarioDescription: ScenarioDescription = {
  name: 'OnDetentChanged',
  key: 'test-form-sheet-on-detent-changed-ios',
  details:
    'Allows testing the onDetentChanged event, verifying that the correct detent index is reported when swiping.',
  platforms: ['ios'],
};

export function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [detentIndex, setDetentIndex] = useState<number>(0);

  const handleOpen = () => {
    setIsOpen(true);
    setDetentIndex(0);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>onDetentChanged Test</Text>

      <Button
        title="Open FormSheet"
        color={Colors.primary}
        onPress={handleOpen}
      />

      <FormSheet
        isOpen={isOpen}
        onNativeDismiss={handleClose}
        detents={[0.4, 0.7, 1.0]}
        onDetentChanged={e => setDetentIndex(e.nativeEvent.index)}>
        <View style={styles.sheetContainer}>
          <Text style={styles.sheetTitle}>FormSheet Content</Text>

          <View style={styles.stateCard}>
            <Text style={styles.instruction}>Active Index</Text>
            <Text style={styles.hugeText}>{detentIndex}</Text>
          </View>

          <Button
            title="Dismiss from JS"
            color={Colors.primary}
            onPress={handleClose}
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
  sheetContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
    color: Colors.text,
  },
  stateCard: {
    backgroundColor: Colors.NavyLight10,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    width: '80%',
  },
  hugeText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.NavyDark140,
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.NavyLight60,
    paddingHorizontal: 20,
  },
  spacing: {
    height: 32,
  },
});

export default createScenario(App, scenarioDescription);
