import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Button,
  findNodeHandle,
  NativeModules,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ScrollViewMarker,
  type StackHeaderConfigProps,
} from 'react-native-screens';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import LongText from '@apps/shared/LongText';
import { Colors } from '@apps/shared/styling';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

export type ProbeSnapshot = {
  sequence: number;
  delegatesCreated: number;
  attached: number;
  detached: number;
  layouts: number;
  touchStarts: number;
  nonTouchStarts: number;
  touchStops: number;
  nonTouchStops: number;
  touchPre: number;
  nonTouchPre: number;
  touchPost: number;
  nonTouchPost: number;
  preFlings: number;
  flings: number;
  delegateConsumedPreY: number;
  delegateConsumedPostY: number;
  lastScreenClass: string;
  lastScreenId: number;
  lastTargetClass: string;
  lastTargetId: number;
  lastTargetScrollY: number;
  lifecycleTrace: string[];
};

type ProbeModule = {
  configure(enabled: boolean, consumeRemaining: boolean): Promise<void>;
  setFactoryInstalled(installed: boolean): Promise<void>;
  dispatchInterleavedLifecycle(reactTag: number): Promise<void>;
  reset(): Promise<void>;
  snapshot(): Promise<ProbeSnapshot>;
};

type ProbeMode = 'disabled' | 'observe' | 'consume';
type ProbeScreenLabel = 'Home' | 'Details' | 'Nested';

const probe = NativeModules.NestedScrollInteropTest as ProbeModule;

const HEADER_CONFIG: StackHeaderConfigProps = {
  title: 'Nested scroll interop',
  android: {
    type: 'large',
    scrollFlagScroll: true,
    scrollFlagExitUntilCollapsed: true,
    scrollFlagEnterAlways: true,
  },
};

const OUTER_NESTED_HEADER_CONFIG: StackHeaderConfigProps = {
  ...HEADER_CONFIG,
  title: 'Outer nested header',
};

function TestStackNestedScrollInteropAndroid() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const prepare = async () => {
      await probe.setFactoryInstalled(true);
      await probe.configure(true, false);
      await probe.reset();
      if (mounted) {
        setReady(true);
      }
    };

    void prepare();

    return () => {
      mounted = false;
      void probe.configure(false, false);
      void probe.setFactoryInstalled(true);
    };
  }, []);

  if (!ready) {
    return <Text testID="nested-scroll-probe-boot">Preparing probe</Text>;
  }

  return (
    <StackContainer
      routeConfigs={[
        { name: 'Home', element: <ProbeScreen label="Home" /> },
        { name: 'Details', element: <ProbeScreen label="Details" /> },
        { name: 'Nested', element: <NestedProbeStack /> },
      ]}
    />
  );
}

function NestedProbeStack() {
  const { routeKey, setRouteOptions } = useStackNavigationContext();

  useEffect(() => {
    setRouteOptions(routeKey, { headerConfig: OUTER_NESTED_HEADER_CONFIG });
  }, [routeKey, setRouteOptions]);

  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Inner',
          element: <ProbeScreen label="Nested" headerEnabled={false} />,
        },
      ]}
    />
  );
}

function ProbeScreen({
  label,
  headerEnabled = true,
}: {
  label: ProbeScreenLabel;
  headerEnabled?: boolean;
}) {
  const { routeKey, setRouteOptions, push, pop } = useStackNavigationContext();
  const scrollRef = useRef<ScrollView>(null);
  const [snapshot, setSnapshot] = useState<ProbeSnapshot | null>(null);
  const [mode, setMode] = useState<ProbeMode>('observe');
  const [factoryInstalled, setFactoryInstalled] = useState(true);
  const [interleaveStatus, setInterleaveStatus] = useState('idle');
  const prefix = `nested-scroll-probe-${label.toLowerCase()}`;

  useEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig: headerEnabled ? HEADER_CONFIG : undefined,
    });
  }, [headerEnabled, routeKey, setRouteOptions]);

  const configure = useCallback(async (nextMode: ProbeMode) => {
    const enabled = nextMode !== 'disabled';
    await probe.configure(enabled, nextMode === 'consume');
    await probe.reset();
    setMode(nextMode);
    setSnapshot(null);
    setInterleaveStatus('idle');
  }, []);

  const configureFactory = useCallback(async (installed: boolean) => {
    await probe.setFactoryInstalled(installed);
    await probe.reset();
    setFactoryInstalled(installed);
    setSnapshot(null);
    setInterleaveStatus('idle');
  }, []);

  const reset = useCallback(async () => {
    await probe.reset();
    setSnapshot(null);
    setInterleaveStatus('idle');
  }, []);

  const refreshSnapshot = useCallback(async () => {
    setSnapshot(null);
    setSnapshot(await probe.snapshot());
  }, []);

  const dispatchInterleavedLifecycle = useCallback(async () => {
    const reactTag = findNodeHandle(scrollRef.current);
    if (reactTag == null) {
      setInterleaveStatus('missing-target');
      return;
    }

    try {
      await probe.dispatchInterleavedLifecycle(reactTag);
      setInterleaveStatus('done');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setInterleaveStatus(`error:${message}`);
    }
  }, []);

  const snapshotText = useMemo(
    () => (snapshot == null ? 'none' : JSON.stringify(snapshot)),
    [snapshot],
  );

  return (
    <View testID={`${prefix}-screen`} style={styles.screen}>
      <View style={styles.probePanel}>
        <Text testID={`${prefix}-route`}>{label}</Text>
        <Text testID={`${prefix}-mode`}>{mode}</Text>
        <Text testID={`${prefix}-factory`}>
          {factoryInstalled ? 'installed' : 'absent'}
        </Text>
        <Text testID={`${prefix}-interleave-status`}>{interleaveStatus}</Text>
        <View style={styles.buttonRow}>
          <Button
            testID={`${prefix}-observe`}
            title="Observe"
            onPress={() => void configure('observe')}
          />
          <Button
            testID={`${prefix}-consume`}
            title="Consume remaining"
            onPress={() => void configure('consume')}
          />
          <Button
            testID={`${prefix}-disable`}
            title="Disable"
            onPress={() => void configure('disabled')}
          />
          <Button
            testID={`${prefix}-reset`}
            title="Reset"
            onPress={() => void reset()}
          />
          <Button
            testID={`${prefix}-snapshot-button`}
            title="Snapshot"
            onPress={() => void refreshSnapshot()}
          />
        </View>
        {label === 'Home' ? (
          <>
            <View style={styles.buttonRow}>
              <Button
                testID={`${prefix}-remove-factory`}
                title="Remove factory"
                onPress={() => void configureFactory(false)}
              />
              <Button
                testID={`${prefix}-install-factory`}
                title="Install factory"
                onPress={() => void configureFactory(true)}
              />
              <Button
                testID={`${prefix}-interleave`}
                title="Interleave types"
                onPress={() => void dispatchInterleavedLifecycle()}
              />
            </View>
            <View style={styles.buttonRow}>
              <Button
                testID={`${prefix}-push`}
                title="Push details"
                onPress={() => push('Details')}
              />
              <Button
                testID={`${prefix}-push-nested`}
                title="Push nested stack"
                onPress={() => push('Nested')}
              />
            </View>
          </>
        ) : null}
        {label === 'Details' ? (
          <View style={styles.buttonRow}>
            <Button
              testID={`${prefix}-pop`}
              title="Pop details"
              onPress={() => pop(routeKey)}
            />
          </View>
        ) : null}
        <Text
          testID={`${prefix}-snapshot`}
          numberOfLines={1}
          style={styles.snapshot}>
          {snapshotText}
        </Text>
      </View>

      <ScrollViewMarker style={styles.scrollViewMarker}>
        <ScrollView
          ref={scrollRef}
          testID={`${prefix}-scrollview`}
          nestedScrollEnabled
          style={styles.scroll}
          contentContainerStyle={styles.content}>
          <Text testID={`${prefix}-top`} style={styles.heading}>
            {label} content top
          </Text>
          <LongText size="xl" />
          <Text testID={`${prefix}-bottom`}>{label} content bottom</Text>
        </ScrollView>
      </ScrollViewMarker>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  probePanel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
    backgroundColor: Colors.cardBackground,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  snapshot: {
    fontSize: 10,
  },
  scrollViewMarker: {
    flex: 1,
  },
  scroll: {
    backgroundColor: Colors.cardBackground,
  },
  content: {
    padding: 16,
    gap: 8,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default createScenario(
  TestStackNestedScrollInteropAndroid,
  scenarioDescription,
);
