import React, { useState } from 'react';
import {
  Button,
  type LayoutChangeEvent,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FormSheet } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

const DETENT_PRESETS: number[][] = [
  [0.5],
  [1.0],
  [0.3, 0.6],
  [0.5, 1.0],
  [0.3, 0.6, 1.0],
  [0.25, 0.5, 0.75],
  [0.3, 0.55, 0.8],
  [0.5, 0.65, 0.8],
  [0.2, 0.9, 1.0],
];

const formatDetent = (detent: number) =>
  Number.isInteger(detent) ? detent.toFixed(1) : String(detent);

const formatDetents = (detents: number[]) =>
  `[${detents.map(formatDetent).join(', ')}]`;

function TestFormSheetFractionalDetents() {
  const [isOpen, setIsOpen] = useState(false);
  const [presetIndex, setPresetIndex] = useState(0);
  const [hostHeight, setHostHeight] = useState(0);

  const detents = DETENT_PRESETS[presetIndex];

  const selectPreset = (index: number) => {
    setPresetIndex(index);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleHostLayout = (event: LayoutChangeEvent) => {
    setHostHeight(event.nativeEvent.layout.height);
  };

  return (
    <View style={styles.container} onLayout={handleHostLayout}>
      {Platform.OS === 'android' && hostHeight > 0 && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {detents.map(detent => (
            <View
              key={detent}
              style={[styles.guide, { top: hostHeight * (1 - detent) }]}>
              <Text style={styles.guideLabel}>{formatDetent(detent)}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.topSection}>
        <Text style={styles.title}>Fractional Detents</Text>
        <Text style={styles.subtitle}>Detents: {formatDetents(detents)}</Text>
        <View style={styles.buttonGroup}>
          {DETENT_PRESETS.map((preset, index) => (
            <Button
              key={formatDetents(preset)}
              title={formatDetents(preset)}
              color={index === presetIndex ? Colors.primary : undefined}
              onPress={() => selectPreset(index)}
            />
          ))}
        </View>

        <View style={styles.spacing} />
        <Button
          title="Open FormSheet"
          color={Colors.primary}
          onPress={handleOpen}
        />
      </View>

      <FormSheet
        isOpen={isOpen}
        onNativeDismiss={() => setIsOpen(false)}
        detents={detents}
        preferredCornerRadius={0}
        nativeContainerStyle={{ backgroundColor: '#ffffff80' }}>
        <View style={styles.sheetContent}>
          <View style={styles.header} />
          <View style={styles.footer} />
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
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.text,
  },
  subtitle: {
    marginBottom: 12,
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  guide: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.primary,
  },
  guideLabel: {
    position: 'absolute',
    right: 8,
    bottom: 2,
    fontSize: 12,
    color: Colors.primary,
  },
  sheetContent: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 24,
    justifyContent: Platform.OS === 'ios' ? 'center' : 'flex-start',
    alignItems: 'center',
  },
  spacing: {
    height: 24,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: Colors.RedDark100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: Colors.RedDark100,
  },
});

export default createScenario(
  TestFormSheetFractionalDetents,
  scenarioDescription,
);
