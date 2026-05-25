import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { FormSheet, type FormSheetProps } from 'react-native-screens/experimental';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

type InitialDetentProp = FormSheetProps['initialDetentIndex'];

export function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState<InitialDetentProp>(0);
  const [dummyState, setDummyState] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.title}>Main Screen</Text>
        <Text style={styles.counterText}>
          Selected Initial Detent: {String(initialIndex)}
        </Text>

        <View style={styles.buttonGroup}>
          <Button
            title="Set Initial to 0 (0.3)"
            onPress={() => setInitialIndex(0)}
          />
          <Button
            title="Set Initial to 1 (0.6)"
            onPress={() => setInitialIndex(1)}
          />
          <Button
            title="Set Initial to 'last' (1.0)"
            onPress={() => setInitialIndex('last')}
          />
        </View>

        <View style={styles.spacing} />
        <Button
          title="Open FormSheet"
          color={Colors.primary}
          onPress={() => setIsOpen(true)}
        />
      </View>

      <FormSheet
        isOpen={isOpen}
        onNativeDismiss={() => setIsOpen(false)}
        initialDetentIndex={initialIndex}
        detents={[0.3, 0.6, 1.0]}>
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>
            Opened at Initial Index: {String(initialIndex)}
          </Text>

          <View style={styles.spacing} />

          <Button
            title={`Force Re-render (${dummyState})`}
            onPress={() => setDummyState(s => s + 1)}
          />

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
    backgroundColor: Colors.offBackground,
  },
  topSection: {
    paddingTop: 80,
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.text,
  },
  counterText: {
    marginBottom: 12,
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  sheetContent: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.text,
  },
  buttonGroup: {
    gap: 12,
    alignItems: 'center',
  },
  spacing: {
    height: 32,
  },
});

export default createScenario(App, scenarioDescription);
