import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FormSheet } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

const ROW_COUNT = 40;

function SheetContent({ onClose }: { onClose: () => void }) {
  return (
    <View style={styles.sheetContainer}>
      <View style={styles.dragHeader}>
        <View style={styles.dragHandle} />
        <Text style={styles.headerText}>Drag here</Text>
      </View>

      <ScrollView
        nestedScrollEnabled
        contentContainerStyle={styles.scrollContent}>
        <Text style={styles.listTitle}>Top of the list</Text>
        <Button title="Close" color={Colors.primary} onPress={onClose} />
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <Text key={index} style={styles.row}>
            Row {index + 1}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

function TestFormSheetScrollStopsAtTop() {
  const [isSingleDetentOpen, setIsSingleDetentOpen] = useState(false);
  const [isTwoDetentsOpen, setIsTwoDetentsOpen] = useState(false);

  const openSingleDetent = () => {
    setIsSingleDetentOpen(true);
  };

  const closeSingleDetent = () => {
    setIsSingleDetentOpen(false);
  };

  const openTwoDetents = () => {
    setIsTwoDetentsOpen(true);
  };

  const closeTwoDetents = () => {
    setIsTwoDetentsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scroll Stops At Top</Text>
      <Text style={styles.instruction}>
        In the sheet, scroll the list down a little, then drag it back down in
        one gesture, past its top, without lifting the finger. The list should
        stop at its top and the sheet should stay in place. A drag that starts
        with the list at its top should move the sheet.
      </Text>

      <View style={styles.buttonGroup}>
        <Button
          title="Open sheet (detents: [1])"
          color={Colors.primary}
          onPress={openSingleDetent}
        />
        <Button
          title="Open sheet (detents: [0.5, 1])"
          color={Colors.primary}
          onPress={openTwoDetents}
        />
      </View>

      <FormSheet
        isOpen={isSingleDetentOpen}
        onNativeDismiss={closeSingleDetent}
        detents={[1]}>
        <SheetContent onClose={closeSingleDetent} />
      </FormSheet>

      <FormSheet
        isOpen={isTwoDetentsOpen}
        onNativeDismiss={closeTwoDetents}
        detents={[0.5, 1]}
        initialDetentIndex="last">
        <SheetContent onClose={closeTwoDetents} />
      </FormSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offBackground,
    padding: 16,
    paddingTop: 80,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 15,
    color: Colors.text,
  },
  buttonGroup: {
    gap: 8,
  },
  sheetContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.cardBackground,
  },
  dragHeader: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.NavyLight20,
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.NavyLight40,
    marginBottom: 12,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  scrollContent: {
    padding: 16,
  },
  listTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    paddingVertical: 12,
    color: Colors.text,
  },
  row: {
    paddingVertical: 14,
    color: Colors.text,
  },
});

export default createScenario(
  TestFormSheetScrollStopsAtTop,
  scenarioDescription,
);
