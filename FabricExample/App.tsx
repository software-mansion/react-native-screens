import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { FormSheet, SafeAreaView } from 'react-native-screens/experimental';

export default function TestFormSheet() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={{ top: true, bottom: true }}>
      <Text style={styles.title}>FormSheet Test</Text>
      <Button title="Open FormSheet" onPress={() => setIsOpen(true)} />
      <FormSheet
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        detents={[0.6, 1.0]}>
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>FormSheet content</Text>
          <View style={styles.spacing} />
          <Button title="Dismiss from JS" onPress={() => setIsOpen(false)} />
        </View>
      </FormSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f000',
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
