import React, { useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { FormSheet } from 'react-native-screens/experimental';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

const scenarioDescription: ScenarioDescription = {
  name: 'Expand when scrolled to edge',
  key: 'test-form-sheet-expand-scroll-view-ios',
  details:
    'Allows testing the prefersScrollingExpandsWhenScrolledToEdge prop with nested ScrollView.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};

function TestFormSheetExpandScrollView() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldExpand, setShouldExpand] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        prefersScrollingExpandsWhenScrolledToEdge Test
      </Text>

      <View style={styles.controls}>
        <Text style={styles.statusText}>
          Expands on scroll: {shouldExpand ? 'ON' : 'OFF'}
        </Text>
        <Switch
          value={shouldExpand}
          onValueChange={setShouldExpand}
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
        detents={[0.5, 1.0]}
        prefersScrollingExpandsWhenScrolledToEdge={shouldExpand}>
        <View style={styles.sheetContainer}>
          <View style={styles.dragHeader}>
            <View style={styles.dragHandle} />
            <Text style={styles.sheetTitle}>Drag Here to Expand</Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sheetTitle}>Scrollable Content</Text>
            <Text style={styles.instruction}>
              Swipe up to see if the sheet expands.
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
              onPress={() => setIsOpen(false)}
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

export default createScenario(
  TestFormSheetExpandScrollView,
  scenarioDescription,
);
