import React, { createContext, useContext, useMemo, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  ContainedModalProvider,
  ContainedModalOverContent,
} from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';

// Modal visibility and the event log live above the stack so they survive
// pushing a screen over the suspended modal.
interface EventsStateContextValue {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  isSecondOpen: boolean;
  setIsSecondOpen: (value: boolean) => void;
  logs: string[];
  addLog: (eventName: string) => void;
  clearLogs: () => void;
}

const EventsStateContext = createContext<EventsStateContextValue | null>(null);

function useEventsStateContext(): EventsStateContextValue {
  const context = useContext(EventsStateContext);
  if (context === null) {
    throw new Error('EventsStateContext used outside of its provider');
  }
  return context;
}

function TestContainedModalLifecycleEvents() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSecondOpen, setIsSecondOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const state = useMemo<EventsStateContextValue>(
    () => ({
      isOpen,
      setIsOpen,
      isSecondOpen,
      setIsSecondOpen,
      logs,
      addLog: (eventName: string) => {
        const timestamp = new Date().toISOString().substring(11, 23);
        setLogs(prev => [...prev, `[${timestamp}] ${eventName}`]);
      },
      clearLogs: () => setLogs([]),
    }),
    [isOpen, isSecondOpen, logs],
  );

  return (
    <EventsStateContext.Provider value={state}>
      <StackContainer
        routeConfigs={[
          {
            name: 'Events',
            element: <EventsScreen />,
            options: { headerConfig: { title: 'Lifecycle Events' } },
          },
          {
            name: 'Over',
            element: <OverScreen />,
            options: { headerConfig: { title: 'Over' } },
          },
        ]}
      />
    </EventsStateContext.Provider>
  );
}

function EventsScreen() {
  const navigation = useStackNavigationContext();
  const {
    isOpen,
    setIsOpen,
    isSecondOpen,
    setIsSecondOpen,
    logs,
    addLog,
    clearLogs,
  } = useEventsStateContext();

  return (
    <View style={styles.container} testID="contained-modal-events-view">
      <View style={styles.row}>
        <Button
          title="Open modal"
          color={Colors.primary}
          onPress={() => setIsOpen(true)}
          testID="open-contained-modal-button"
        />
        <Button
          title="Open second modal"
          color={Colors.primary}
          onPress={() => setIsSecondOpen(true)}
          testID="open-second-contained-modal-button"
        />
      </View>
      <View style={styles.row}>
        <Button
          title="Push screen over"
          color={Colors.primary}
          onPress={() => navigation.push('Over')}
          testID="push-screen-over-button"
        />
        <Button
          title="Clear Logs"
          color={Colors.primary}
          onPress={clearLogs}
          testID="clear-logs-button"
        />
      </View>

      <ContainedModalProvider containerId="events" style={styles.provider}>
        <View style={styles.providerContent}>
          <Text style={styles.providerLabel}>Provider area</Text>
        </View>
        <ContainedModalOverContent
          isOpen={isOpen}
          targetContainerId="events"
          onPresentationRejected={() => {
            addLog('onPresentationRejected');
            setIsOpen(false);
          }}
          onWillAppear={() => addLog('onWillAppear')}
          onDidAppear={() => addLog('onDidAppear')}
          onWillDisappear={() => addLog('onWillDisappear')}
          onDidDisappear={() => addLog('onDidDisappear')}>
          <View style={styles.modalContent}>
            <Button
              title="Dismiss from JS"
              color={Colors.primary}
              onPress={() => setIsOpen(false)}
              testID="dismiss-contained-modal-button"
            />
          </View>
        </ContainedModalOverContent>
        {/* Second modal targeting the SAME provider: opening it while the
            first is presented must be rejected (one open modal per
            provider), surfaced via onPresentationRejected. */}
        <ContainedModalOverContent
          isOpen={isSecondOpen}
          targetContainerId="events"
          onPresentationRejected={() => {
            addLog('onPresentationRejected (second modal)');
            setIsSecondOpen(false);
          }}
          onWillAppear={() => addLog('onWillAppear (second modal)')}
          onDidAppear={() => addLog('onDidAppear (second modal)')}
          onWillDisappear={() => addLog('onWillDisappear (second modal)')}
          onDidDisappear={() => addLog('onDidDisappear (second modal)')}>
          <View style={styles.secondModalContent}>
            <Button
              title="Dismiss second modal"
              color={Colors.primary}
              onPress={() => setIsSecondOpen(false)}
              testID="dismiss-second-contained-modal-button"
            />
          </View>
        </ContainedModalOverContent>
      </ContainedModalProvider>

      <View style={styles.logsContainer} testID="event-logs-container">
        <Text style={styles.logsHeader}>Event Logs:</Text>
        <ScrollView style={styles.scrollView}>
          {logs.map((log, index) => (
            <Text
              key={index}
              style={styles.logText}
              testID="event-logs-container-text">
              {log}
            </Text>
          ))}
          {logs.length === 0 && (
            <Text
              style={styles.emptyLogText}
              testID="empty-event-logs-container-text">
              No events recorded yet.
            </Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

function OverScreen() {
  const navigation = useStackNavigationContext();
  const { isOpen } = useEventsStateContext();

  return (
    <View style={styles.overScreen}>
      <Text style={styles.overText}>
        The modal underneath is suspended. Modal isOpen: {String(isOpen)}
      </Text>
      <Button
        title="Pop"
        color={Colors.primary}
        onPress={() => navigation.pop(navigation.routeKey)}
        testID="pop-screen-over-button"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Clears the translucent native stack header, which the screen content
    // extends under (same offset as the comprehensive scenario).
    paddingTop: 120,
    alignItems: 'center',
    backgroundColor: Colors.offBackground,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 16,
  },
  // Visible background + fixed size, so the modal covering exactly the
  // provider region is visually verifiable.
  provider: {
    width: '85%',
    height: 180,
    backgroundColor: '#cde3ff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  providerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(40, 40, 60, 0.6)',
  },
  secondModalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(120, 20, 20, 0.7)',
  },
  overScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
  },
  overText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.text,
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
});

export default createScenario(
  TestContainedModalLifecycleEvents,
  scenarioDescription,
);
