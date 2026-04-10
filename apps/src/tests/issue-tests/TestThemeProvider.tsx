import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from '@apps/shared';
import { ThemeProvider } from '@apps/shared/styling/theme-provider/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TestThemeProvider() {
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.section}>
        <ThemedText style={styles.heading}>Without ThemeProvider</ThemedText>
        <ThemedText>This text uses the theme from parent NavigationContainer.</ThemedText>
      </ThemedView>

      <ThemeProvider theme="dark">
        <ThemedView style={styles.section}>
          <ThemedText style={styles.heading}>With ThemeProvider (dark)</ThemedText>
          <ThemedText>This text should use dark theme colors (light text, dark background).</ThemedText>
        </ThemedView>
      </ThemeProvider>

      <ThemeProvider theme="light">
        <ThemedView style={styles.section}>
          <ThemedText style={styles.heading}>With ThemeProvider (light)</ThemedText>
          <ThemedText>This text should use light theme colors explicitly.</ThemedText>
        </ThemedView>
      </ThemeProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  section: {
    padding: 16,
    borderRadius: 8,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
