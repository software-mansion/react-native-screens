import React, { useCallback, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  FullScreenModalOverContent,
  FullScreenModalReplacingContent,
} from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

type Variant = 'Replacing' | 'Over';
type Level = 'Lower' | 'Upper';

const VARIANT_COMPONENTS = {
  Replacing: FullScreenModalReplacingContent,
  Over: FullScreenModalOverContent,
} as const;

function TestFullScreenModalStacking() {
  const [lowerVariant, setLowerVariant] = useState<Variant>('Replacing');
  const [upperVariant, setUpperVariant] = useState<Variant>('Replacing');
  const [isLowerOpen, setIsLowerOpen] = useState(false);
  const [isUpperOpen, setIsUpperOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = useCallback((entry: string) => {
    setLogs(prev => [...prev, entry]);
  }, []);
  const clearLogs = useCallback(() => setLogs([]), []);

  const toggleVariant = (value: Variant): Variant =>
    value === 'Replacing' ? 'Over' : 'Replacing';

  const eventHandlers = (
    level: Level,
    setIsOpen: (value: boolean) => void,
  ) => ({
    onWillAppear: () => addLog(`${level}: onWillAppear`),
    onDidAppear: () => addLog(`${level}: onDidAppear`),
    onWillDisappear: () => addLog(`${level}: onWillDisappear`),
    onDidDisappear: () => addLog(`${level}: onDidDisappear`),
    onDismiss: () => addLog(`${level}: onDismiss`),
    onNativeDismiss: () => {
      addLog(`${level}: onNativeDismiss`);
      setIsOpen(false);
    },
  });

  const LowerModal = VARIANT_COMPONENTS[lowerVariant];
  const UpperModal = VARIANT_COMPONENTS[upperVariant];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Presenter screen</Text>
      <Button
        title={`Lower: ${lowerVariant}`}
        color={Colors.primary}
        onPress={() => setLowerVariant(toggleVariant)}
        testID="lower-variant-button"
      />
      <Button
        title={`Upper: ${upperVariant}`}
        color={Colors.primary}
        onPress={() => setUpperVariant(toggleVariant)}
        testID="upper-variant-button"
      />
      <Button
        title="Open lower"
        color={Colors.primary}
        onPress={() => setIsLowerOpen(true)}
        testID="open-lower-button"
      />
      <EventLog logs={logs} onClear={clearLogs} />

      <LowerModal
        key={`lower-${lowerVariant}`}
        isOpen={isLowerOpen}
        {...eventHandlers('Lower', setIsLowerOpen)}>
        <ModalContent
          title={`Lower (${lowerVariant})`}
          idPrefix="lower"
          backgroundColor="#ffe9a8"
          logs={logs}
          onClearLogs={clearLogs}
          onClose={() => setIsLowerOpen(false)}
          onOpenUpper={() => setIsUpperOpen(true)}>
          {/* The upper modal's element lives inside the lower modal's content,
              so it is in the window even while a replacing lower modal is open. */}
          <UpperModal
            key={`upper-${upperVariant}`}
            isOpen={isUpperOpen}
            {...eventHandlers('Upper', setIsUpperOpen)}>
            <ModalContent
              title={`Upper (${upperVariant})`}
              idPrefix="upper"
              backgroundColor="#cfe8ff"
              logs={logs}
              onClearLogs={clearLogs}
              onClose={() => setIsUpperOpen(false)}
              onCloseLower={() => setIsLowerOpen(false)}
            />
          </UpperModal>
        </ModalContent>
      </LowerModal>
    </View>
  );
}

interface ModalContentProps {
  title: string;
  idPrefix: string;
  backgroundColor: string;
  logs: string[];
  onClearLogs: () => void;
  onClose: () => void;
  onOpenUpper?: () => void;
  onCloseLower?: () => void;
  children?: React.ReactNode;
}

function ModalContent({
  title,
  idPrefix,
  backgroundColor,
  logs,
  onClearLogs,
  onClose,
  onOpenUpper,
  onCloseLower,
  children,
}: ModalContentProps) {
  const [counter, setCounter] = useState(0);

  return (
    <View style={styles.modalContainer}>
      <View style={[styles.card, { backgroundColor }]}>
        <Text style={styles.title} testID={`${idPrefix}-title`}>
          {title}
        </Text>
        <Text style={styles.label} testID={`${idPrefix}-counter`}>
          Counter: {counter}
        </Text>
        <View style={styles.row}>
          <Button
            title="Increment"
            color={Colors.primary}
            onPress={() => setCounter(value => value + 1)}
            testID={`${idPrefix}-increment-button`}
          />
          <Button
            title={onOpenUpper ? 'Close lower' : 'Close upper'}
            color={Colors.primary}
            onPress={onClose}
            testID={`${idPrefix}-close-button`}
          />
        </View>
        {onOpenUpper && (
          <Button
            title="Open upper"
            color={Colors.primary}
            onPress={onOpenUpper}
            testID="open-upper-button"
          />
        )}
        {onCloseLower && (
          <Button
            title="Close lower"
            color={Colors.primary}
            onPress={onCloseLower}
            testID="upper-close-lower-button"
          />
        )}
        <EventLog logs={logs} onClear={onClearLogs} />
      </View>
      {children}
    </View>
  );
}

function EventLog({ logs, onClear }: { logs: string[]; onClear: () => void }) {
  return (
    <View style={styles.logsContainer}>
      <View style={styles.logsHeaderRow}>
        <Text style={styles.logsHeader}>Event log:</Text>
        <Button
          title="Clear log"
          color={Colors.primary}
          onPress={onClear}
          testID="clear-log-button"
        />
      </View>
      <ScrollView style={styles.scrollView}>
        {logs.map((log, index) => (
          <Text key={index} style={styles.logText} testID="event-log-text">
            {log}
          </Text>
        ))}
        {logs.length === 0 && (
          <Text style={styles.emptyLogText}>No events recorded yet.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 120,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.offBackground,
  },
  // The card sits at the bottom and leaves the top of the screen uncovered, so
  // whatever is underneath an over-content modal stays visible there.
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
  },
  card: {
    height: '60%',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  label: {
    fontSize: 16,
    color: Colors.text,
  },
  logsContainer: {
    flex: 1,
    width: '100%',
    paddingBottom: 24,
  },
  logsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logsHeader: {
    fontSize: 16,
    fontWeight: '600',
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
});

export default createScenario(TestFullScreenModalStacking, scenarioDescription);
