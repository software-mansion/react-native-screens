import React, { useState } from 'react';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import { PageSheet } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

function TestPageSheetBase() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title} testID="pagesheet-base-title">
        PageSheet Test
      </Text>
      <Button
        title="Open PageSheet"
        color={Colors.primary}
        onPress={() => setIsOpen(true)}
        testID="open-pagesheet-button"
      />
      <PageSheet
        isOpen={isOpen}
        onNativeDismiss={() => setIsOpen(false)}
        detents={[0.6, 1.0]}>
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle} testID="pagesheet-base-content">
            PageSheet content
          </Text>
          <View style={styles.spacing} />
          <Button
            title="Dismiss from JS"
            color={Colors.primary}
            onPress={() => setIsOpen(false)}
            testID="dismiss-pagesheet-button"
          />
        </View>
      </PageSheet>
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
    justifyContent: Platform.OS === 'ios' ? 'center' : 'flex-start',
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

export default createScenario(TestPageSheetBase, scenarioDescription);
