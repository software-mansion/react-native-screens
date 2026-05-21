import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { FormSheet, type FormSheetProps } from 'react-native-screens/experimental';
import scenarioDescription from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

type FormSheetCornerRadiusProp = NonNullable<
  FormSheetProps['preferredCornerRadius']
>;

export function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [radius, setRadius] = useState<FormSheetCornerRadiusProp>('systemDefault');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Corner Radius Test</Text>
      <Text style={{ marginBottom: 12, color: Colors.text }}>
        Current Radius: {radius}
      </Text>
      <Button
        title="Open FormSheet"
        color={Colors.primary}
        onPress={() => setIsOpen(true)}
      />
      <FormSheet
        isOpen={isOpen}
        onNativeDismiss={() => setIsOpen(false)}
        preferredCornerRadius={radius}
        detents={[0.6, 1.0]}>
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Current Radius: {radius}</Text>
          <View style={styles.spacing} />
          <View style={styles.buttonGroup}>
            <Button title="System default" onPress={() => setRadius('systemDefault')} />
            <Button title="Sharp (0)" onPress={() => setRadius(0)} />
            <Button title="Small (10)" onPress={() => setRadius(10)} />
            <Button title="Large (50)" onPress={() => setRadius(50)} />
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.offBackground,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
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
  buttonGroup: {
    gap: 12,
    alignItems: 'center',
  },
  spacing: {
    height: 32,
  },
});

export default createScenario(App, scenarioDescription);
