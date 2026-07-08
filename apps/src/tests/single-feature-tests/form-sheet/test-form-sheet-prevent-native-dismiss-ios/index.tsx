import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Switch, Text, View } from 'react-native';
import { FormSheet } from 'react-native-screens/experimental';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

const scenarioDescription: ScenarioDescription = {
  name: 'PreventNativeDismiss',
  key: 'test-form-sheet-prevent-native-dismiss-ios',
  details:
    'Allows testing the preventNativeDismiss property and firing the onNativeDismissPrevented event.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};

function TestFormSheetPreventNativeDismiss() {
  const [isOpen, setIsOpen] = useState(false);
  const [preventDismiss, setPreventDismiss] = useState(true);

  const handleDismissPrevented = () => {
    Alert.alert(
      'Dismissal Prevented',
      'Native dismissal is currently disabled. Please use the button to close the sheet.',
      [{ text: 'OK', style: 'cancel' }],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PreventNativeDismiss Test</Text>

      <View style={styles.controls}>
        <Text style={styles.statusText}>
          Prevent Native Dismiss: {preventDismiss ? 'ON' : 'OFF'}
        </Text>
        <Switch
          value={preventDismiss}
          onValueChange={setPreventDismiss}
          trackColor={{ true: Colors.GreenLight100, false: Colors.RedLight100 }}
        />
      </View>

      <View style={styles.spacing} />

      <Button
        title="Open FormSheet"
        color={Colors.primary}
        onPress={() => setIsOpen(true)}
      />

      <FormSheet
        isOpen={isOpen}
        onNativeDismiss={() => setIsOpen(false)}
        onNativeDismissPrevented={handleDismissPrevented}
        detents={[0.5, 1.0]}
        preventNativeDismiss={preventDismiss}>
        <View style={styles.sheetContainer}>
          <Text style={styles.sheetTitle}>FormSheet Content</Text>
          <Text style={styles.instruction}>
            {preventDismiss
              ? 'Try swiping down or tapping the backdrop to dismiss. It should show an Alert.'
              : 'Swipe down or tap the backdrop to dismiss. It should close without showing an Alert.'}
          </Text>

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
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  statusText: {
    fontSize: 16,
    marginRight: 12,
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
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    color: Colors.text,
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

export default createScenario(
  TestFormSheetPreventNativeDismiss,
  scenarioDescription,
);
