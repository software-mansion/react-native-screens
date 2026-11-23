import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  FullScreenModalOverContent,
  FullScreenModalReplacingContent,
} from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';

type Variant = 'Replacing' | 'Over';

// Long enough to open a modal first, short enough to keep the step quick.
const TIMER_DELAY_MS = 2000;

// Modal visibility and the event log live above the stack, so the log survives
// pushes and pops and `isOpen` outlives the screen hosting the modal. The
// modals themselves are rendered inside the screen that opened them (the
// host), so popping that screen removes them.
interface LifecycleStateContextValue {
  hostName: string | null;
  isReplacingOpen: boolean;
  isOverOpen: boolean;
  openModal: (variant: Variant, hostName: string) => void;
  setIsReplacingOpen: (value: boolean) => void;
  setIsOverOpen: (value: boolean) => void;
  logs: string[];
  addLog: (entry: string) => void;
  clearLogs: () => void;
}

const LifecycleStateContext = createContext<LifecycleStateContextValue | null>(
  null,
);

function useLifecycleStateContext(): LifecycleStateContextValue {
  const context = useContext(LifecycleStateContext);
  if (context === null) {
    throw new Error('LifecycleStateContext used outside of its provider');
  }
  return context;
}

function TestFullScreenModalStackLifecycle() {
  const [hostName, setHostName] = useState<string | null>(null);
  const [isReplacingOpen, setIsReplacingOpen] = useState(false);
  const [isOverOpen, setIsOverOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = useCallback((entry: string) => {
    setLogs(prev => [...prev, entry]);
  }, []);
  const clearLogs = useCallback(() => setLogs([]), []);
  const openModal = useCallback((variant: Variant, name: string) => {
    setHostName(name);
    if (variant === 'Replacing') {
      setIsReplacingOpen(true);
    } else {
      setIsOverOpen(true);
    }
  }, []);

  const state = useMemo<LifecycleStateContextValue>(
    () => ({
      hostName,
      isReplacingOpen,
      isOverOpen,
      openModal,
      setIsReplacingOpen,
      setIsOverOpen,
      logs,
      addLog,
      clearLogs,
    }),
    [hostName, isReplacingOpen, isOverOpen, openModal, logs, addLog, clearLogs],
  );

  const screenCallbacks = (screenName: string) => ({
    onWillAppear: () => addLog(`${screenName}: onWillAppear`),
    onDidAppear: () => addLog(`${screenName}: onDidAppear`),
    onWillDisappear: () => addLog(`${screenName}: onWillDisappear`),
    onDidDisappear: () => addLog(`${screenName}: onDidDisappear`),
  });

  return (
    <LifecycleStateContext.Provider value={state}>
      <StackContainer
        routeConfigs={[
          {
            name: 'Home',
            element: <StackScreenContent name="Home" />,
            options: {
              ...screenCallbacks('Home'),
              headerConfig: { title: 'Home' },
            },
          },
          {
            name: 'A',
            element: <StackScreenContent name="A" />,
            options: {
              ...screenCallbacks('A'),
              headerConfig: { title: 'A' },
            },
          },
          {
            name: 'B',
            element: <StackScreenContent name="B" />,
            options: {
              ...screenCallbacks('B'),
              headerConfig: { title: 'B' },
            },
          },
          {
            name: 'Nested',
            element: <NestedStackScreen />,
            options: {
              ...screenCallbacks('Nested'),
              headerConfig: { title: 'Nested' },
            },
          },
        ]}
      />
    </LifecycleStateContext.Provider>
  );
}

function NestedStackScreen() {
  const { addLog } = useLifecycleStateContext();

  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'NestedHome',
          element: <StackScreenContent name="NestedHome" isNested />,
          options: {
            onWillAppear: () => addLog('NestedHome: onWillAppear'),
            onDidAppear: () => addLog('NestedHome: onDidAppear'),
            onWillDisappear: () => addLog('NestedHome: onWillDisappear'),
            onDidDisappear: () => addLog('NestedHome: onDidDisappear'),
            headerConfig: { title: 'NestedHome' },
          },
        },
      ]}
    />
  );
}

function StackScreenContent({
  name,
  isNested = false,
}: {
  name: string;
  isNested?: boolean;
}) {
  const navigation = useStackNavigationContext();
  const {
    hostName,
    isReplacingOpen,
    isOverOpen,
    openModal,
    setIsReplacingOpen,
    setIsOverOpen,
    logs,
    clearLogs,
  } = useLifecycleStateContext();

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current !== null) {
        clearTimeout(timer.current);
      }
    },
    [],
  );
  const runLater = (action: () => void) => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(action, TIMER_DELAY_MS);
  };

  const popSelf = () => navigation.pop(navigation.routeKey);
  const hostsModals = hostName === name;
  const replacingCallbacks = useModalCallbacks('Replacing', setIsReplacingOpen);
  const overCallbacks = useModalCallbacks('Over', setIsOverOpen);

  return (
    <View style={[styles.screen, isNested && styles.nestedScreen]}>
      <Text style={styles.title}>Screen {name}</Text>
      <View style={styles.row}>
        <Button
          title="Open replacing"
          color={Colors.primary}
          onPress={() => openModal('Replacing', name)}
          testID={`${name}-open-replacing-button`}
        />
        <Button
          title="Open over"
          color={Colors.primary}
          onPress={() => openModal('Over', name)}
          testID={`${name}-open-over-button`}
        />
      </View>
      {!isNested && (
        <View style={styles.row}>
          <Button
            title="Push A"
            color={Colors.primary}
            onPress={() => navigation.push('A')}
            testID={`${name}-push-a-button`}
          />
          <Button
            title="Push Nested"
            color={Colors.primary}
            onPress={() => navigation.push('Nested')}
            testID={`${name}-push-nested-button`}
          />
          {name !== 'Home' && (
            <Button
              title="Pop"
              color={Colors.primary}
              onPress={popSelf}
              testID={`${name}-pop-button`}
            />
          )}
        </View>
      )}
      {name === 'A' && (
        <View style={styles.row}>
          <Button
            title="Push B in 2s"
            color={Colors.primary}
            onPress={() => runLater(() => navigation.push('B'))}
            testID="A-push-b-later-button"
          />
        </View>
      )}
      <EventLog logs={logs} onClear={clearLogs} />

      {hostsModals && (
        <>
          <FullScreenModalReplacingContent
            isOpen={isReplacingOpen}
            {...replacingCallbacks}>
            <ModalContent
              variant="Replacing"
              onClose={() => setIsReplacingOpen(false)}
            />
          </FullScreenModalReplacingContent>
          <FullScreenModalOverContent isOpen={isOverOpen} {...overCallbacks}>
            <ModalContent variant="Over" onClose={() => setIsOverOpen(false)} />
          </FullScreenModalOverContent>
        </>
      )}
    </View>
  );
}

function useModalCallbacks(
  variant: Variant,
  setIsOpen: (value: boolean) => void,
) {
  const { addLog } = useLifecycleStateContext();

  return {
    onWillAppear: () => addLog(`${variant}: onWillAppear`),
    onDidAppear: () => addLog(`${variant}: onDidAppear`),
    onWillDisappear: () => addLog(`${variant}: onWillDisappear`),
    onDidDisappear: () => addLog(`${variant}: onDidDisappear`),
    onDismiss: () => addLog(`${variant}: onDismiss`),
    onNativeDismiss: () => {
      addLog(`${variant}: onNativeDismiss`);
      setIsOpen(false);
    },
  };
}

function ModalContent({
  variant,
  onClose,
}: {
  variant: Variant;
  onClose: () => void;
}) {
  const navigation = useStackNavigationContext();
  const { logs, clearLogs } = useLifecycleStateContext();

  return (
    <View style={styles.modalContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>{variant} modal</Text>
        <View style={styles.row}>
          <Button
            title="Close"
            color={Colors.primary}
            onPress={onClose}
            testID={`${variant.toLowerCase()}-close-button`}
          />
          <Button
            title="Push B"
            color={Colors.primary}
            onPress={() => navigation.push('B')}
            testID={`${variant.toLowerCase()}-push-b-button`}
          />
          <Button
            title="Pop host"
            color={Colors.primary}
            onPress={() => navigation.pop(navigation.routeKey)}
            testID={`${variant.toLowerCase()}-pop-host-button`}
          />
        </View>
        <EventLog logs={logs} onClear={clearLogs} />
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
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    // Clears the translucent native stack header, which the screen content
    // extends under (same offset as the contained modal scenarios).
    paddingTop: 120,
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.offBackground,
  },
  // The nested stack adds its own header below the outer one.
  nestedScreen: {
    paddingTop: 170,
  },
  // The card sits at the bottom and leaves the top of the screen uncovered, so
  // the stack header stays visible under the over-content variant.
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

export default createScenario(
  TestFullScreenModalStackLifecycle,
  scenarioDescription,
);
