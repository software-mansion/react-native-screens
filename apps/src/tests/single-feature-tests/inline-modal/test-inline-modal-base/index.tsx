import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  InlineModal,
  InlineModalProvider,
  SafeAreaView,
} from 'react-native-screens/experimental';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

const scenarioDescription: ScenarioDescription = {
  name: 'Basic InlineModal',
  key: 'test-inline-modal-base',
  details:
    'Allows to test the basic functionality of the InlineModal component.',
  platforms: ['ios'],
};

export function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <InlineModalProvider>
      <SafeAreaView style={styles.container} edges={{top: true}}>
        <Text style={styles.title}>InlineModal Test</Text>
        <Text style={styles.providerText}>Full Screen Provider</Text>
        <View style={styles.spacing} />
        <Button
          title="Open Inline Modal"
          color={Colors.primary}
          onPress={() => setIsOpen(true)}
        />
        <InlineModal isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Inline Modal Content</Text>
            <View style={styles.spacing} />
            <Button
              title="Dismiss from JS"
              color={Colors.primary}
              onPress={() => setIsOpen(false)}
            />
          </View>
        </InlineModal>
      </SafeAreaView>
    </InlineModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.offBackground,
    padding: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 40,
    color: Colors.text,
  },
  providerText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.text,
  },
  modalContent: {
    flex: 1,
    backgroundColor: Colors.PurpleDarkTransparent,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  spacing: {
    height: 24,
  },
});

export default createScenario(App, scenarioDescription);
