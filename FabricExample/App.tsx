import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {
  ModalFormSheet,
  SafeAreaView,
} from 'react-native-screens/experimental';

export default function TestModalFormSheet() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={{ top: true, bottom: true }}>
      <Text style={styles.title}>ModalFormSheet Test</Text>
      <Button title="Open ModalFormSheet" onPress={() => setIsOpen(true)} />
      <ModalFormSheet isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>ModalFormSheet content</Text>
          <View style={styles.spacing} />
          <Button title="Dismiss from JS" onPress={() => setIsOpen(false)} />
        </View>
      </ModalFormSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sheetContent: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
  },
  spacing: {
    height: 32,
  },
});
