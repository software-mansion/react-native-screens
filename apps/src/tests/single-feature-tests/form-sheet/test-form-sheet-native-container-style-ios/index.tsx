import React, { useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ColorValue,
} from 'react-native';
import { FormSheet } from 'react-native-screens/experimental';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

export function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [nativeColor, setNativeColor] = useState<ColorValue>(
    Colors.NavyLight100,
  );

  const handleDismiss = () => {
    setIsOpen(false);
  };

  const colorOptions: { name: string; value: ColorValue }[] = [
    { name: 'NAVY', value: Colors.NavyLight100 },
    { name: 'TRANSPARENT', value: 'transparent' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Native Container Style</Text>

      <View style={styles.controlsContainer}>
        <Text style={styles.controlsLabel}>
          Select Native Background Color:
        </Text>
        <View style={styles.buttonRow}>
          {colorOptions.map(option => (
            <TouchableOpacity
              key={option.name}
              style={[
                styles.optionButton,
                nativeColor === option.value && styles.optionButtonActive,
              ]}
              onPress={() => setNativeColor(option.value)}>
              <Text
                style={[
                  styles.optionText,
                  nativeColor === option.value && styles.optionTextActive,
                ]}>
                {option.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.spacing} />

      <Button
        title="Open FormSheet"
        color={Colors.primary}
        onPress={() => setIsOpen(true)}
      />

      <FormSheet
        isOpen={isOpen}
        onNativeDismiss={handleDismiss}
        detents="fitToContents"
        nativeContainerStyle={{ backgroundColor: nativeColor }}>
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Native Container</Text>

          <Text style={styles.description}>
            This sheet dynamically wraps its content, but the background color
            is applied directly to the underlying native UIView.
          </Text>

          <View style={styles.spacing} />

          <Button
            title={isExpanded ? 'Collapse Content' : 'Expand Content'}
            color={Colors.White}
            onPress={() => setIsExpanded(!isExpanded)}
          />

          {isExpanded && (
            <View style={styles.extraContentBox}>
              <Text style={styles.extraText}>
                Notice how the native background seamlessly fills the entire
                sheet, including the un-collapsible bottom safe area, without
                relying on Yoga layouts.
              </Text>
            </View>
          )}

          <View style={styles.spacing} />

          <Button
            title="Dismiss from JS"
            color={Colors.White}
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
  controlsContainer: {
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
  },
  controlsLabel: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  optionButtonActive: {
    backgroundColor: Colors.primary,
  },
  optionText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  optionTextActive: {
    color: Colors.White,
  },
  sheetContent: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.White,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.White,
    paddingHorizontal: 16,
  },
  extraContentBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: Colors.WhiteTransparentDark,
    borderRadius: 8,
    width: '100%',
  },
  extraText: {
    fontSize: 15,
    color: Colors.Black,
    textAlign: 'center',
  },
  spacing: {
    height: 24,
  },
});

export default createScenario(App, scenarioDescription);
