import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { FormSheet } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

function SheetContent({
  fitToContents,
  onDismiss,
}: {
  fitToContents: boolean;
  onDismiss: () => void;
}) {
  return (
    <View
      style={[
        styles.sheetContent,
        fitToContents ? styles.sheetContentWrap : styles.sheetContentFill,
      ]}>
      <Text style={styles.sheetTitle}>FormSheet content</Text>
      <Text style={styles.description}>
        Focus the inputs to check how the sheet reacts to the keyboard.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Top input"
        placeholderTextColor={Colors.cardBorder}
      />
      <View style={fitToContents ? styles.spacing : styles.spacer} />
      <TextInput
        style={styles.input}
        placeholder="Bottom input"
        placeholderTextColor={Colors.cardBorder}
      />
      <Button
        title="Dismiss from JS"
        color={Colors.primary}
        onPress={onDismiss}
      />
    </View>
  );
}

function TestFormSheetKeyboard() {
  const [isDetentsSheetOpen, setIsDetentsSheetOpen] = useState(false);
  const [isFitToContentsSheetOpen, setIsFitToContentsSheetOpen] =
    useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FormSheet Test</Text>
      <Button
        title="Open FormSheet (detents)"
        color={Colors.primary}
        onPress={() => setIsDetentsSheetOpen(true)}
      />
      <View style={styles.spacing} />
      <Button
        title="Open FormSheet (fitToContents)"
        color={Colors.primary}
        onPress={() => setIsFitToContentsSheetOpen(true)}
      />
      <FormSheet
        isOpen={isDetentsSheetOpen}
        onNativeDismiss={() => setIsDetentsSheetOpen(false)}
        detents={[0.6, 1.0]}>
        <SheetContent
          fitToContents={false}
          onDismiss={() => setIsDetentsSheetOpen(false)}
        />
      </FormSheet>
      <FormSheet
        isOpen={isFitToContentsSheetOpen}
        onNativeDismiss={() => setIsFitToContentsSheetOpen(false)}
        detents="fitToContents">
        <SheetContent
          fitToContents
          onDismiss={() => setIsFitToContentsSheetOpen(false)}
        />
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
  },
  sheetContentFill: {
    flex: 1,
  },
  sheetContentWrap: {
    paddingBottom: 48,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.text,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.text,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    color: Colors.text,
    backgroundColor: Colors.cardBackground,
  },
  spacer: {
    flex: 1,
  },
  spacing: {
    height: 32,
  },
});

export default createScenario(TestFormSheetKeyboard, scenarioDescription);
