import React, { useState } from 'react';
import { Button, StyleSheet, Switch, Text, View } from 'react-native';
import { FormSheet } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

function EdgeAttachedSwitch({
  value,
  onValueChange,
  testID,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
  testID: string;
}) {
  return (
    <View style={styles.controls}>
      <Text style={styles.statusText}>
        Edge attached: {value ? 'ON' : 'OFF'}
      </Text>
      <Switch value={value} onValueChange={onValueChange} testID={testID} />
    </View>
  );
}

function TestFormSheetEdgeAttachedCompactHeight() {
  const [isOpen, setIsOpen] = useState(false);
  const [edgeAttached, setEdgeAttached] = useState(false);

  const close = () => setIsOpen(false);

  return (
    <View style={styles.container}>
      <EdgeAttachedSwitch
        value={edgeAttached}
        onValueChange={setEdgeAttached}
        testID="edge-attached-switch"
      />
      <View style={styles.spacing} />
      <Button
        title="Open FormSheet"
        color={Colors.primary}
        onPress={() => setIsOpen(true)}
        testID="open-formsheet-button"
      />
      <FormSheet
        isOpen={isOpen}
        onNativeDismiss={close}
        prefersGrabberVisible
        prefersEdgeAttachedInCompactHeight={edgeAttached}>
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>FormSheet content</Text>
          <EdgeAttachedSwitch
            value={edgeAttached}
            onValueChange={setEdgeAttached}
            testID="sheet-edge-attached-switch"
          />
          <View style={styles.spacing} />
          <Button title="Dismiss" color={Colors.primary} onPress={close} />
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
    padding: 24,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusText: {
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
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.text,
  },
  spacing: {
    height: 16,
  },
});

export default createScenario(
  TestFormSheetEdgeAttachedCompactHeight,
  scenarioDescription,
);
