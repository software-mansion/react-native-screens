import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  FormSheet,
  type FormSheetProps,
} from 'react-native-screens/experimental';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

type LargestUndimmedDetentIndexProp = NonNullable<
  FormSheetProps['largestUndimmedDetentIndex']
>;

function TestFormSheetLargestUndimmedDetentIndex() {
  const [isOpen, setIsOpen] = useState(false);
  const [undimmedIndex, setUndimmedIndex] =
    useState<LargestUndimmedDetentIndexProp>('none');
  const [bgCounter, setBgCounter] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.title}>Main Screen</Text>
        <Text style={styles.counterText}>Background clicks: {bgCounter}</Text>
        <Button
          title="Increment Background Counter"
          color={Colors.primary}
          onPress={() => setBgCounter(c => c + 1)}
        />
      </View>

      <View style={styles.centerSection}>
        <Button
          title="Open FormSheet"
          color={Colors.primary}
          onPress={() => setIsOpen(true)}
        />
      </View>

      <FormSheet
        isOpen={isOpen}
        onNativeDismiss={() => setIsOpen(false)}
        largestUndimmedDetentIndex={undimmedIndex}
        detents={[0.3, 0.6, 0.8]}>
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>
            Undimmed Index: {String(undimmedIndex)}
          </Text>
          <View style={styles.spacing} />
          <View style={styles.buttonGroup}>
            <Button
              title="Set 'none'"
              onPress={() => setUndimmedIndex('none')}
            />
            <Button
              title="Set 0 (0.3 height)"
              onPress={() => setUndimmedIndex(0)}
            />
            <Button
              title="Set 1 (0.6 height)"
              onPress={() => setUndimmedIndex(1)}
            />
            <Button
              title="Set 'last'"
              onPress={() => setUndimmedIndex('last')}
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
    backgroundColor: Colors.offBackground,
  },
  topSection: {
    paddingTop: 80,
    alignItems: 'center',
    zIndex: 1,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonGroup: {
    gap: 12,
    alignItems: 'center',
  },
  spacing: {
    height: 32,
  },
});

export default createScenario(
  TestFormSheetLargestUndimmedDetentIndex,
  scenarioDescription,
);
