import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { FormSheet } from 'react-native-screens/experimental';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

export function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDismiss = () => {
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FormSheet Test</Text>
      <Button
        title="Open FormSheet"
        color={Colors.primary}
        onPress={() => setIsOpen(true)}
      />
      <FormSheet
        isOpen={isOpen}
        onNativeDismiss={handleDismiss}
        detents="fitToContents">
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>FormSheet content</Text>

          <Text style={styles.description}>
            This sheet dynamically wraps its content. Press the button below to
            change the height.
          </Text>

          <View style={styles.spacing} />

          <Button
            title={isExpanded ? 'Collapse Content' : 'Expand Content'}
            color={Colors.primary}
            onPress={() => setIsExpanded(!isExpanded)}
          />

          {isExpanded && (
            <View style={styles.extraContentBox}>
              <Text style={styles.extraText}>
                Here is some extra content! The FormSheet should seamlessly
                animate to accommodate this new height without any glitches.
              </Text>
            </View>
          )}

          <View style={styles.spacing} />

          <Button
            title="Dismiss from JS"
            color={Colors.primary}
            onPress={handleDismiss}
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
  sheetContent: {
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
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.text,
    paddingHorizontal: 16,
  },
  extraContentBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: Colors.offBackground,
    borderRadius: 8,
    width: '100%',
  },
  extraText: {
    fontSize: 15,
    color: Colors.text,
    textAlign: 'center',
  },
  spacing: {
    height: 24,
  },
});

export default createScenario(App, scenarioDescription);
