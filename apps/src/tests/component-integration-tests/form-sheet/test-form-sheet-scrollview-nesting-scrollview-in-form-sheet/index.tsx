import React, { useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { FormSheet } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

function TestFormSheetScrollView() {
  const [isOpen, setIsOpen] = useState(false);
  const [nestedScrollEnabled, setNestedScrollEnabled] = useState(true);
  const [detentIndex, setDetentIndex] = useState<number | null>(null);

  const handleOpen = () => {
    setDetentIndex(0);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ScrollView In Sheet Test</Text>

      <View style={styles.controls}>
        <Text style={styles.statusText}>
          nestedScrollEnabled (Android): {nestedScrollEnabled ? 'ON' : 'OFF'}
        </Text>
        <Switch
          value={nestedScrollEnabled}
          onValueChange={setNestedScrollEnabled}
          trackColor={{ true: Colors.GreenLight100, false: Colors.RedLight100 }}
        />
      </View>

      <Text style={styles.statusText}>
        Detent: {detentIndex === null ? '-' : detentIndex}
      </Text>

      <View style={styles.spacing} />

      <Button
        title="Open FormSheet"
        color={Colors.primary}
        onPress={handleOpen}
      />

      <FormSheet
        isOpen={isOpen}
        onNativeDismiss={handleClose}
        detents={[0.5, 1.0]}
        onDetentChanged={e => setDetentIndex(e.nativeEvent.index)}>
        <View style={styles.sheetContainer}>
          <View style={styles.dragHeader}>
            <View style={styles.dragHandle} />
            <Text style={styles.sheetTitle}>Drag Here</Text>
          </View>

          <ScrollView
            nestedScrollEnabled={nestedScrollEnabled}
            contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sheetTitle}>Scrollable Content</Text>
            <Text style={styles.instruction}>
              Swipe on the list. The sheet should expand, collapse and dismiss
              like a native sheet with a scroll view inside.
            </Text>

            {Array.from({ length: 50 }).map((_, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listText}>List Item {index + 1}</Text>
              </View>
            ))}

            <View style={styles.spacing} />
            <Button
              title="Dismiss from JS"
              color={Colors.primary}
              onPress={handleClose}
            />
          </ScrollView>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.text,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 16,
    marginRight: 12,
    color: Colors.text,
  },
  sheetContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background,
  },
  dragHeader: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.NavyLight20,
    backgroundColor: Colors.background,
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.NavyLight40,
    marginBottom: 12,
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.text,
  },
  instruction: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.NavyLight60,
    marginBottom: 24,
  },
  listItem: {
    width: '100%',
    padding: 16,
    marginBottom: 8,
    backgroundColor: Colors.NavyLight10,
    borderRadius: 8,
    alignItems: 'center',
  },
  listText: {
    fontSize: 16,
    color: Colors.NavyDark140,
  },
  spacing: {
    height: 32,
  },
});

export default createScenario(TestFormSheetScrollView, scenarioDescription);
