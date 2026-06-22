import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FormSheet } from 'react-native-screens/experimental';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

export function TestFormSheetDismissEvents() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (eventName: string) => {
    const timestamp = new Date().toISOString().substring(11, 23);
    setLogs(prev => [...prev, `[${timestamp}] ${eventName}`]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FormSheet Dismiss Test</Text>

      <View style={styles.row}>
        <Button
          title="Open FormSheet"
          color={Colors.primary}
          onPress={() => setIsOpen(true)}
        />
        <Button
          title="Clear Logs"
          color={Colors.primary}
          onPress={() => setLogs([])}
        />
      </View>

      <View style={styles.logsContainer}>
        <Text style={styles.logsHeader}>Event Logs:</Text>
        <ScrollView style={styles.scrollView}>
          {logs.map((log, index) => (
            <Text key={index} style={styles.logText}>
              {log}
            </Text>
          ))}
          {logs.length === 0 && (
            <Text style={styles.emptyLogText}>No events recorded yet.</Text>
          )}
        </ScrollView>
      </View>

      <FormSheet
        isOpen={isOpen}
        onNativeDismiss={() => {
          setIsOpen(false);
          addLog('onNativeDismiss');
        }}
        onDismiss={() => addLog('onDismiss')}
        detents={[0.6, 1.0]}>
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>FormSheet Content</Text>
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
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: Colors.offBackground,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  logsContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  logsHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  logText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
    fontFamily: 'Courier',
  },
  emptyLogText: {
    fontSize: 14,
    color: 'gray',
    fontStyle: 'italic',
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
  spacing: {
    height: 32,
  },
});

export default createScenario(TestFormSheetDismissEvents, scenarioDescription);
