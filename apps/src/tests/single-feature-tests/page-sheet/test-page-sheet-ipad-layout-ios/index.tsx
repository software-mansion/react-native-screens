import React, { useState } from 'react';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import { FormSheet, PageSheet } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

const DETENTS = [0.5, 1.0];

type SheetKind = 'pageSheet' | 'formSheet';

function SheetContent({
  kind,
  onDismiss,
}: {
  kind: SheetKind;
  onDismiss: () => void;
}) {
  const label = kind === 'pageSheet' ? 'PageSheet' : 'FormSheet';
  return (
    <View style={styles.sheetContent}>
      <Text style={styles.sheetTitle} testID={`${kind}-content`}>
        {label} content
      </Text>
      <Text style={styles.description}>
        {kind === 'pageSheet'
          ? 'iPad: wide, bottom-anchored card. The host screen is dimmed only.'
          : 'iPad: centered floating panel of a fixed size. The host screen is dimmed only.'}
      </Text>
      <View style={styles.spacing} />
      <Button
        title={`Dismiss ${label}`}
        color={Colors.primary}
        onPress={onDismiss}
        testID={`dismiss-${kind}-button`}
      />
    </View>
  );
}

function TestPageSheetIPadLayout() {
  const [isPageSheetOpen, setIsPageSheetOpen] = useState(false);
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PageSheet vs FormSheet</Text>
      <Text style={styles.hint}>
        {Platform.isPad
          ? 'Open both and compare the card layout and the host screen behind them.'
          : 'On iPhone both sheets look and behave the same.'}
      </Text>
      <View style={styles.spacing} />
      <Button
        title="Open PageSheet"
        color={Colors.primary}
        onPress={() => setIsPageSheetOpen(true)}
        testID="open-pagesheet-button"
      />
      <View style={styles.spacing} />
      <Button
        title="Open FormSheet"
        color={Colors.primary}
        onPress={() => setIsFormSheetOpen(true)}
        testID="open-formsheet-button"
      />
      <PageSheet
        isOpen={isPageSheetOpen}
        onNativeDismiss={() => setIsPageSheetOpen(false)}
        detents={DETENTS}
        prefersGrabberVisible>
        <SheetContent
          kind="pageSheet"
          onDismiss={() => setIsPageSheetOpen(false)}
        />
      </PageSheet>
      <FormSheet
        isOpen={isFormSheetOpen}
        onNativeDismiss={() => setIsFormSheetOpen(false)}
        detents={DETENTS}
        prefersGrabberVisible>
        <SheetContent
          kind="formSheet"
          onDismiss={() => setIsFormSheetOpen(false)}
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
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.text,
  },
  hint: {
    fontSize: 15,
    textAlign: 'center',
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
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.text,
    paddingHorizontal: 16,
  },
  spacing: {
    height: 24,
  },
});

export default createScenario(TestPageSheetIPadLayout, scenarioDescription);
