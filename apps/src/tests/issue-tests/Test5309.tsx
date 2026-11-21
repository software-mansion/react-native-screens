import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { Tabs, type TabsHostNavStateRequest } from 'react-native-screens';
import { SafeAreaView } from 'react-native-screens/experimental';

const PROBE_HEIGHT = 120;
const LATE_MOUNT_DELAY_MS = 1000;

function Probe({ label, color }: { label: string; color: string }) {
  const [inset, setInset] = useState<number | null>(null);
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setInset(Math.round(PROBE_HEIGHT - e.nativeEvent.layout.height));
  }, []);

  return (
    <View style={styles.probeBox}>
      <SafeAreaView edges={{ top: true }} style={styles.probeSafeArea}>
        <View
          style={[styles.probeFill, { backgroundColor: color }]}
          onLayout={onLayout}>
          <Text style={styles.probeText}>
            {label}: top inset {inset ?? '…'}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

function RemountScreen() {
  const [probeKey, setProbeKey] = useState(0);

  return (
    <View style={styles.screen}>
      <Probe key={probeKey} label={`remount #${probeKey}`} color="#d9534f" />
      <View style={styles.content}>
        <Text style={styles.description}>
          Expected: the probe reads the status bar height (not 0), on launch and
          after every remount.
        </Text>
        <Button title="Remount" onPress={() => setProbeKey(k => k + 1)} />
      </View>
    </View>
  );
}

function LateMountScreen({ opened }: { opened: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!opened) {
      return;
    }
    const timeout = setTimeout(() => setMounted(true), LATE_MOUNT_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [opened]);

  return (
    <View style={styles.screen}>
      {mounted ? (
        <Probe label="late" color="#428bca" />
      ) : (
        <View style={styles.probeBox} />
      )}
      <View style={styles.content}>
        <Text style={styles.description}>
          The probe mounts {LATE_MOUNT_DELAY_MS} ms after this tab first opens.
          Expected: it reads the status bar height (not 0).
        </Text>
      </View>
    </View>
  );
}

export default function Test5309() {
  const [nav, setNav] = useState<TabsHostNavStateRequest>({
    selectedScreenKey: 'remount',
    baseProvenance: 0,
  });
  const [lateTabOpened, setLateTabOpened] = useState(false);
  const lateTabOpenedRef = useRef(false);

  const onLateTabDidAppear = useCallback(() => {
    if (!lateTabOpenedRef.current) {
      lateTabOpenedRef.current = true;
      setLateTabOpened(true);
    }
  }, []);

  return (
    <Tabs.Host
      navStateRequest={nav}
      onTabSelected={e =>
        setNav({
          selectedScreenKey: e.nativeEvent.selectedScreenKey,
          baseProvenance: e.nativeEvent.provenance,
        })
      }>
      <Tabs.Screen
        screenKey="remount"
        title="Remount"
        ios={{ icon: { type: 'sfSymbol', name: 'arrow.clockwise' } }}>
        <RemountScreen />
      </Tabs.Screen>
      <Tabs.Screen
        screenKey="late"
        title="Late mount"
        onDidAppear={onLateTabDidAppear}
        ios={{ icon: { type: 'sfSymbol', name: 'clock' } }}>
        <LateMountScreen opened={lateTabOpened} />
      </Tabs.Screen>
    </Tabs.Host>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, gap: 12 },
  description: { fontSize: 14 },
  probeBox: { height: PROBE_HEIGHT, backgroundColor: '#eee' },
  probeSafeArea: { flex: 1 },
  probeFill: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  probeText: { color: '#fff', fontWeight: '600' },
});
