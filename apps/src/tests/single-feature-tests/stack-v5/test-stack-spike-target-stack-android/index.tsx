// SPIKE (labs #2127 / #2128). Throwaway: drives the prototype target-stack
// props of `Stack.Host` directly. Every screen is rendered all the time with
// `activityMode: 'detached'`, and the stack is whatever the last request says.
import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

const KEYS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const;
type HeldBackMode = 'none' | 'cancel-post' | 'cancel-delay';

const COLORS = [
  Colors.YellowLight100,
  Colors.BlueLight100,
  Colors.RedLight100,
  Colors.GreenLight100,
  Colors.PurpleLight100,
];

type SpikeContextValue = {
  stack: string[];
  log: string[];
  heldBackMode: HeldBackMode;
  setHeldBackMode: (mode: HeldBackMode) => void;
  request: (label: string, compute: (stack: string[]) => string[]) => void;
  requestLater: (label: string, compute: (stack: string[]) => string[]) => void;
};

const SpikeContext = React.createContext<SpikeContextValue | null>(null);

function useSpike() {
  const value = React.useContext(SpikeContext);
  if (!value) {
    throw new Error('useSpike outside of the spike stack');
  }
  return value;
}

function unused(stack: string[], count = 1): string[] {
  return KEYS.filter(key => !stack.includes(key)).slice(0, count);
}

function TestStackSpikeTargetStackAndroid() {
  // `stack` is what JS believes native holds: the last request, minus screens
  // native reported as dismissed while they were still in it (native pops).
  const [stack, setStack] = React.useState<string[]>(['A']);
  const [requestId, setRequestId] = React.useState(1);
  const [requestedStack, setRequestedStack] = React.useState<string[]>(['A']);
  const [heldBackMode, setHeldBackMode] =
    React.useState<HeldBackMode>('cancel-post');
  const [log, setLog] = React.useState<string[]>([]);
  const stackRef = React.useRef(stack);
  stackRef.current = stack;

  const appendLog = React.useCallback((line: string) => {
    const time = new Date().toISOString().slice(17, 23);
    console.log(`[spike] ${line}`);
    setLog(prev => [`${time} ${line}`, ...prev].slice(0, 12));
  }, []);

  const request = React.useCallback(
    (label: string, compute: (current: string[]) => string[]) => {
      const target = compute(stackRef.current);
      appendLog(`req ${label}: [${stackRef.current}] -> [${target}]`);
      setRequestedStack(target);
      setStack(target);
      setRequestId(id => id + 1);
    },
    [appendLog],
  );

  const requestLater = React.useCallback(
    (label: string, compute: (current: string[]) => string[]) => {
      appendLog(`in 3 s: ${label} (start a back swipe and hold it)`);
      setTimeout(() => request(label, compute), 3000);
    },
    [appendLog, request],
  );

  const onDismiss = React.useCallback(
    (screenKey: string) => {
      const wasInStack = stackRef.current.includes(screenKey);
      appendLog(
        `onDismiss ${screenKey}${wasInStack ? ' (still in JS stack: native pop or BUG)' : ''}`,
      );
      if (wasInStack) {
        setStack(prev => prev.filter(key => key !== screenKey));
      }
    },
    [appendLog],
  );

  const contextValue = React.useMemo<SpikeContextValue>(
    () => ({
      stack,
      log,
      heldBackMode,
      setHeldBackMode,
      request,
      requestLater,
    }),
    [stack, log, heldBackMode, request, requestLater],
  );

  return (
    <SpikeContext.Provider value={contextValue}>
      <Stack.Host
        prototypeRequestId={requestId}
        prototypeStack={requestedStack}
        prototypeHeldBackMode={heldBackMode}>
        {KEYS.map((key, index) => (
          <Stack.Screen
            key={key}
            screenKey={key}
            activityMode="detached"
            onDismiss={onDismiss}
            onNativeDismiss={onDismiss}>
            <Stack.HeaderConfig title={`Screen ${key}`} />
            <SpikeScreen screenKey={key} color={COLORS[index % COLORS.length]} />
          </Stack.Screen>
        ))}
      </Stack.Host>
    </SpikeContext.Provider>
  );
}

function SpikeScreen({ screenKey, color }: { screenKey: string; color: string }) {
  const { stack, log, heldBackMode, setHeldBackMode, request, requestLater } =
    useSpike();
  const depth = stack.length;

  return (
    <ScrollView
      style={{ backgroundColor: color }}
      contentContainerStyle={styles.content}>
      <Text style={styles.title} testID={`spike-screen-${screenKey}`}>
        Screen {screenKey}
      </Text>
      <Text testID="spike-stack">JS stack: [{stack.join(', ')}]</Text>
      <Text>Held back mode: {heldBackMode}</Text>
      <View style={styles.row}>
        {(['none', 'cancel-post', 'cancel-delay'] as const).map(mode => (
          <Button
            key={mode}
            title={mode}
            onPress={() => setHeldBackMode(mode)}
          />
        ))}
      </View>

      <Text style={styles.section}>Push / pop</Text>
      <Button
        title="Push 1"
        onPress={() => request('push', s => [...s, ...unused(s)])}
      />
      <Button
        title="Push 2"
        onPress={() => request('push 2', s => [...s, ...unused(s, 2)])}
      />
      <Button
        title="Pop"
        disabled={depth < 2}
        onPress={() => request('pop', s => s.slice(0, -1))}
      />
      <Button
        title="Pop 2"
        disabled={depth < 3}
        onPress={() => request('pop 2', s => s.slice(0, -2))}
      />
      <Button
        title="Pop to root"
        disabled={depth < 2}
        onPress={() => request('pop to root', s => s.slice(0, 1))}
      />

      <Text style={styles.section}>Replace / reset</Text>
      <Button
        title="Replace top"
        disabled={depth < 2}
        onPress={() => request('replace', s => [...s.slice(0, -1), ...unused(s)])}
      />
      <Button
        title="Replace top 2 with 1"
        disabled={depth < 3}
        onPress={() =>
          request('replace 2 with 1', s => [...s.slice(0, -2), ...unused(s)])
        }
      />
      <Button
        title="Reset to 1 new screen"
        onPress={() => request('reset 1', s => unused(s))}
      />
      <Button
        title="Reset to 2 new screens"
        onPress={() => request('reset 2', s => unused(s, 2))}
      />
      <Button
        title="Replace root only"
        disabled={depth < 2}
        onPress={() => request('replace root', s => [...unused(s), ...s.slice(1)])}
      />

      <Text style={styles.section}>Below the top</Text>
      <Button
        title="Remove screen below top"
        disabled={depth < 3}
        onPress={() =>
          request('remove below top', s => [...s.slice(0, -2), s[s.length - 1]])
        }
      />
      <Button
        title="Remove root"
        disabled={depth < 2}
        onPress={() => request('remove root', s => s.slice(1))}
      />
      <Button
        title="Keep only top"
        disabled={depth < 2}
        onPress={() => request('keep only top', s => s.slice(-1))}
      />
      <Button
        title="Insert below top"
        onPress={() =>
          request('insert below top', s => [
            ...s.slice(0, -1),
            ...unused(s),
            s[s.length - 1],
          ])
        }
      />
      <Button
        title="Insert 2 at the bottom"
        onPress={() => request('insert 2 at bottom', s => [...unused(s, 2), ...s])}
      />

      <Text style={styles.section}>Delayed (hold a back swipe meanwhile)</Text>
      <Button
        title="Push in 3 s"
        onPress={() => requestLater('push', s => [...s, ...unused(s)])}
      />
      <Button
        title="Pop in 3 s"
        disabled={depth < 2}
        onPress={() => requestLater('pop', s => s.slice(0, -1))}
      />
      <Button
        title="Replace top in 3 s"
        disabled={depth < 2}
        onPress={() =>
          requestLater('replace', s => [...s.slice(0, -1), ...unused(s)])
        }
      />
      <Button
        title="Remove below top in 3 s"
        disabled={depth < 3}
        onPress={() =>
          requestLater('remove below top', s => [
            ...s.slice(0, -2),
            s[s.length - 1],
          ])
        }
      />

      <Text style={styles.section}>Log (newest first)</Text>
      {log.map((line, index) => (
        <Text key={index} style={styles.log}>
          {line}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 12,
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  log: {
    fontFamily: 'monospace',
    fontSize: 11,
  },
});

export default createScenario(
  TestStackSpikeTargetStackAndroid,
  scenarioDescription,
);
