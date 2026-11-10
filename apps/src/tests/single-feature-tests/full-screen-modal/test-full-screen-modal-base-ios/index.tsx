import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  FormSheet,
  FullScreenModalOverContent,
  FullScreenModalReplacingContent,
} from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

type Variant = 'Replacing' | 'Over';

// Short enough for the reopen request to land while the dismissal animation
// is still running.
const REOPEN_DELAY_MS = 100;

const CUSTOM_BACKGROUND_COLOR = 'gold';

function TestFullScreenModalBase() {
  const [isReplacingOpen, setIsReplacingOpen] = useState(false);
  const [isOverOpen, setIsOverOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [hasCustomBackground, setHasCustomBackground] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = useCallback((entry: string) => {
    setLogs(prev => [...prev, entry]);
  }, []);
  const clearLogs = useCallback(() => setLogs([]), []);

  const reopenTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (reopenTimeout.current !== null) {
        clearTimeout(reopenTimeout.current);
      }
    },
    [],
  );
  const closeThenReopen = (setIsOpen: (value: boolean) => void) => {
    setIsOpen(false);
    reopenTimeout.current = setTimeout(() => setIsOpen(true), REOPEN_DELAY_MS);
  };

  const nativeContainerStyle = hasCustomBackground
    ? { backgroundColor: CUSTOM_BACKGROUND_COLOR }
    : undefined;

  const eventHandlers = (
    variant: Variant,
    setIsOpen: (value: boolean) => void,
  ) => ({
    onWillAppear: () => addLog(`${variant}: onWillAppear`),
    onDidAppear: () => addLog(`${variant}: onDidAppear`),
    onWillDisappear: () => addLog(`${variant}: onWillDisappear`),
    onDidDisappear: () => addLog(`${variant}: onDidDisappear`),
    onDismiss: () => addLog(`${variant}: onDismiss`),
    onNativeDismiss: () => {
      addLog(`${variant}: onNativeDismiss`);
      setIsOpen(false);
    },
    onPresentationRejected: () => {
      addLog(`${variant}: onPresentationRejected`);
      setIsOpen(false);
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Presenter screen</Text>
      <View style={styles.row}>
        <Button
          title="Open replacing"
          color={Colors.primary}
          onPress={() => setIsReplacingOpen(true)}
          testID="open-replacing-button"
        />
        <Button
          title="Open over"
          color={Colors.primary}
          onPress={() => setIsOverOpen(true)}
          testID="open-over-button"
        />
      </View>
      <Button
        title="Toggle custom background"
        color={Colors.primary}
        onPress={() => setHasCustomBackground(value => !value)}
        testID="toggle-custom-background-button"
      />
      <Text style={styles.label}>
        Custom background: {hasCustomBackground ? 'on' : 'off'}
      </Text>
      <Button
        title="Open sheet"
        color={Colors.primary}
        onPress={() => setIsSheetOpen(true)}
        testID="open-sheet-button"
      />
      <EventLog logs={logs} onClear={clearLogs} />

      <FormSheet
        isOpen={isSheetOpen}
        onNativeDismiss={() => setIsSheetOpen(false)}>
        <View style={styles.sheetContent}>
          <Button
            title="Close sheet, open replacing"
            color={Colors.primary}
            onPress={() => {
              setIsSheetOpen(false);
              setIsReplacingOpen(true);
            }}
            testID="close-sheet-open-replacing-button"
          />
        </View>
      </FormSheet>

      <FullScreenModalReplacingContent
        isOpen={isReplacingOpen}
        nativeContainerStyle={nativeContainerStyle}
        {...eventHandlers('Replacing', setIsReplacingOpen)}>
        <ModalContent
          variant="Replacing"
          onClose={() => setIsReplacingOpen(false)}
          onCloseThenReopen={() => closeThenReopen(setIsReplacingOpen)}
          logs={logs}
          onClearLogs={clearLogs}
        />
      </FullScreenModalReplacingContent>

      <FullScreenModalOverContent
        isOpen={isOverOpen}
        nativeContainerStyle={nativeContainerStyle}
        {...eventHandlers('Over', setIsOverOpen)}>
        <ModalContent
          variant="Over"
          onClose={() => setIsOverOpen(false)}
          onCloseThenReopen={() => closeThenReopen(setIsOverOpen)}
          logs={logs}
          onClearLogs={clearLogs}
        />
      </FullScreenModalOverContent>
    </View>
  );
}

interface ModalContentProps {
  variant: Variant;
  onClose: () => void;
  onCloseThenReopen: () => void;
  logs: string[];
  onClearLogs: () => void;
}

function ModalContent({
  variant,
  onClose,
  onCloseThenReopen,
  logs,
  onClearLogs,
}: ModalContentProps) {
  const [counter, setCounter] = useState(0);
  const idPrefix = variant.toLowerCase();

  return (
    <View style={styles.modalContainer}>
      <View style={styles.card}>
        <Text style={styles.title} testID={`${idPrefix}-title`}>
          {variant} modal
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
            title="Close"
            color={Colors.primary}
            onPress={onClose}
            testID={`${idPrefix}-close-button`}
          />
        </View>
        <Button
          title="Close, then reopen"
          color={Colors.primary}
          onPress={onCloseThenReopen}
          testID={`${idPrefix}-close-then-reopen-button`}
        />
        <EventLog logs={logs} onClear={onClearLogs} />
      </View>
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
  sheetContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // The card sits at the bottom and leaves the presenter's buttons uncovered,
  // so they stay visible (and must stay inert) under the over-content variant.
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
  },
  card: {
    height: '55%',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: Colors.background,
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

export default createScenario(TestFullScreenModalBase, scenarioDescription);
