/** Standalone native regression fixture; intentionally uses Screens directly. */
import React, { useEffect, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  ScreenStack,
  ScreenStackItem,
  useTransitionProgress,
} from 'react-native-screens';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type Scenario =
  | 'release'
  | 'early-release'
  | 'timeout'
  | 'remove'
  | 'unmount-stack'
  | 'none'
  | 'zero-duration'
  | 'slide'
  | 'default';
type Sample = { time: number; progress: number };
type Result = {
  scenario: Scenario;
  duration: number;
  layoutAt: number | null;
  releasedAt: number | null;
  appearedAt: number | null;
  maxProgressBeforeRelease: number;
  samples: Sample[];
  pass: boolean;
};
type ProbeControls = { run: (scenario: Scenario) => Promise<Result> };

const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

function ProgressObserver({
  onProgress,
}: {
  onProgress: (value: number) => void;
}) {
  const { progress } = useTransitionProgress();
  useEffect(() => {
    const id = progress.addListener(({ value }) => onProgress(value));
    return () => progress.removeListener(id);
  }, [progress, onProgress]);
  return null;
}

const scenarios: Scenario[] = [
  'release',
  'early-release',
  'timeout',
  'remove',
  'unmount-stack',
  'release',
  'none',
  'zero-duration',
  'slide',
  'default',
];

export default function DeferredTransitionStart() {
  const controls = useRef<ProbeControls | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stackMounted, setStackMounted] = useState(true);
  const [target, setTarget] = useState<{
    key: string;
    deferred: boolean;
    animation: 'fade' | 'none' | 'default';
    duration: number;
  } | null>(null);
  const report = useRef<Result | null>(null);
  const start = useRef(0);
  const running = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    const probe: ProbeControls = {
      async run(scenario) {
        if (running.current)
          throw new Error('A native probe is already running');
        running.current = true;
        try {
          setTarget(null);
          setStackMounted(true);
          await delay(650);
          if (!mounted.current) throw new Error('Native probe was unmounted');
          const result: Result = {
            scenario,
            duration: scenario === 'zero-duration' ? 0 : 300,
            layoutAt: null,
            releasedAt: null,
            appearedAt: null,
            maxProgressBeforeRelease: 0,
            samples: [],
            pass: false,
          };
          report.current = result;
          start.current = Date.now();
          setTarget({
            key: String(start.current),
            deferred: scenario !== 'default',
            animation:
              scenario === 'none'
                ? 'none'
                : scenario === 'slide'
                ? 'default'
                : 'fade',
            duration: result.duration,
          });
          if (scenario === 'release' || scenario === 'early-release') {
            await delay(scenario === 'early-release' ? 0 : 650);
            if (!mounted.current) throw new Error('Native probe was unmounted');
            result.releasedAt = Date.now() - start.current;
            setTarget(current => current && { ...current, deferred: false });
          } else if (scenario === 'remove' || scenario === 'unmount-stack') {
            await delay(200);
            if (!mounted.current) throw new Error('Native probe was unmounted');
            result.releasedAt = Date.now() - start.current;
            if (scenario === 'unmount-stack') setStackMounted(false);
            else setTarget(null);
          }
          await delay(scenario === 'timeout' ? 1700 : 850);
          if (!mounted.current) throw new Error('Native probe was unmounted');
          const boundary =
            result.releasedAt ?? (scenario === 'timeout' ? 850 : 0);
          result.maxProgressBeforeRelease = Math.max(
            0,
            ...result.samples
              .filter(s => s.time < boundary)
              .map(s => s.progress),
          );
          const held = result.maxProgressBeforeRelease < 0.001;
          const laidOut =
            result.layoutAt !== null &&
            result.layoutAt < (result.releasedAt ?? 850);
          result.pass =
            scenario === 'remove' || scenario === 'unmount-stack'
              ? held && laidOut
              : scenario === 'none' ||
                scenario === 'default' ||
                scenario === 'slide' ||
                scenario === 'zero-duration' ||
                scenario === 'early-release'
              ? result.appearedAt !== null && result.appearedAt < 800
              : held &&
                laidOut &&
                result.appearedAt !== null &&
                result.appearedAt > boundary;
          console.info('[ScreensDeferredProbe]', JSON.stringify(result));
          return result;
        } finally {
          running.current = false;
        }
      },
    };
    controls.current = probe;
    return () => {
      mounted.current = false;
      controls.current = null;
    };
  }, []);
  const run = async () => {
    if (busy || !controls.current) return;
    const probe = controls.current;
    setBusy(true);
    setError(null);
    setResults([]);
    try {
      for (const scenario of scenarios) {
        const result = await probe.run(scenario);
        if (!mounted.current) return;
        setResults(previous => [...previous, result]);
      }
    } catch (e) {
      if (mounted.current) setError(String(e));
    } finally {
      if (mounted.current) setBusy(false);
    }
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.fill}>
        <Text style={styles.instructions}>
          300 ms fade; hold for 650 ms before release.
        </Text>
        {stackMounted ? (
          <ScreenStack style={styles.fill}>
            <ScreenStackItem
              screenId="probe-source"
              activityState={2}
              stackAnimation="fade"
              transitionDuration={300}
              headerConfig={{ hidden: true }}
              contentStyle={styles.source}>
              <View style={styles.content}>
                <Text style={styles.text}>Deferred transition source</Text>
              </View>
            </ScreenStackItem>
            {target && (
              <ScreenStackItem
                key={target.key}
                screenId="probe-target"
                activityState={2}
                stackPresentation="push"
                stackAnimation={target.animation}
                transitionDuration={target.duration}
                transitionStartDeferred={target.deferred}
                headerConfig={{ hidden: true }}
                contentStyle={styles.target}
                onAppear={() => {
                  if (report.current)
                    report.current.appearedAt = Date.now() - start.current;
                }}>
                <ProgressObserver
                  onProgress={progress => {
                    if (!report.current || !mounted.current) return;
                    report.current.samples.push({
                      time: Date.now() - start.current,
                      progress,
                    });
                  }}
                />
                <View
                  style={styles.content}
                  onLayout={() => {
                    if (report.current)
                      report.current.layoutAt = Date.now() - start.current;
                  }}>
                  <Text style={styles.text}>
                    Deferred transition destination
                  </Text>
                </View>
              </ScreenStackItem>
            )}
          </ScreenStack>
        ) : (
          <View style={styles.fill} />
        )}
        <View style={styles.controls}>
          <Button
            title={busy ? 'Running…' : 'Run native checks'}
            disabled={busy}
            onPress={run}
            testID="deferred-fade-run"
          />
          <Text testID="deferred-fade-result">
            {error ??
              `${results.filter(result => result.pass).length}/${
                scenarios.length
              } passed`}
          </Text>
          <ScrollView style={styles.results}>
            {results.map((result, index) => (
              <Text key={index}>
                {result.pass ? 'PASS' : 'FAIL'} {result.scenario}: layout{' '}
                {result.layoutAt ?? '—'} ms, release {result.releasedAt ?? '—'}{' '}
                ms, appear {result.appearedAt ?? '—'} ms, held progress{' '}
                {result.maxProgressBeforeRelease.toFixed(4)}
              </Text>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  controls: { padding: 12, paddingBottom: 28, backgroundColor: '#fff' },
  instructions: { padding: 12, backgroundColor: '#fff', color: '#111' },
  results: { maxHeight: 160 },
  source: { backgroundColor: '#642637' },
  target: { backgroundColor: '#193f79' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { color: '#fff', fontSize: 22 },
});
