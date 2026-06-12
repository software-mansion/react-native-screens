import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { ComposeBottomSheet } from 'react-native-screens/experimental';
import { Colors } from '@apps/shared/styling';

export function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ComposeBottomSheet Test</Text>
      <Button
        title="Open Compose Sheet"
        color={Colors.primary}
        onPress={() => setIsOpen(true)}
      />
      <ComposeBottomSheet isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Jetpack Compose Content</Text>
          <Text style={styles.description}>
            RN content rendered inside Jetpack Compose
          </Text>
          <View style={styles.spacing} />
          <Button
            title="Dismiss from JS"
            color={Colors.primary}
            onPress={() => setIsOpen(false)}
          />
        </View>
      </ComposeBottomSheet>
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
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
    marginTop: 8,
  },
  spacing: {
    height: 32,
  },
});

export default App;
