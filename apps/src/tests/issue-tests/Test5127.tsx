import React, { useCallback, useState } from 'react';
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

function Probe({ label, color }: { label: string; color: string }) {
  const [inset, setInset] = useState<number | null>(null);
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setInset(Math.round(PROBE_HEIGHT - e.nativeEvent.layout.height));
  }, []);

  return (
    <View style={styles.probeBox}>
      <SafeAreaView edges={{ bottom: true }} style={styles.probeSafeArea}>
        <View
          style={[styles.probeFill, { backgroundColor: color }]}
          onLayout={onLayout}>
          <Text style={styles.probeText}>
            {label}: bottom inset {inset ?? '…'}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

function Screen({
  tabBarHidden,
  toggleTabBar,
}: {
  tabBarHidden: boolean;
  toggleTabBar: () => void;
}) {
  const [firstKey, setFirstKey] = useState(0);
  const [secondMounted, setSecondMounted] = useState(true);

  return (
    <View style={styles.screen}>
      <Text style={styles.description}>
        Expected: both probes read the same bottom inset, equal to the tab bar
        height while it is shown and to the system inset while it is hidden,
        after every button below.
      </Text>
      <Probe key={firstKey} label="first" color="#d9534f" />
      {secondMounted && <Probe label="second" color="#428bca" />}
      <Button title="Remount first" onPress={() => setFirstKey(k => k + 1)} />
      <Button
        title={secondMounted ? 'Unmount second' : 'Mount second'}
        onPress={() => setSecondMounted(m => !m)}
      />
      <Button
        title={tabBarHidden ? 'Show tab bar' : 'Hide tab bar'}
        onPress={toggleTabBar}
      />
    </View>
  );
}

export default function Test5127() {
  const [nav, setNav] = useState<TabsHostNavStateRequest>({
    selectedScreenKey: 'probes',
    baseProvenance: 0,
  });
  const [tabBarHidden, setTabBarHidden] = useState(false);
  const toggleTabBar = useCallback(() => setTabBarHidden(h => !h), []);

  return (
    <Tabs.Host
      tabBarHidden={tabBarHidden}
      navStateRequest={nav}
      onTabSelected={e =>
        setNav({
          selectedScreenKey: e.nativeEvent.selectedScreenKey,
          baseProvenance: e.nativeEvent.provenance,
        })
      }>
      <Tabs.Screen
        screenKey="probes"
        title="Probes"
        ios={{ icon: { type: 'sfSymbol', name: 'ruler' } }}>
        <Screen tabBarHidden={tabBarHidden} toggleTabBar={toggleTabBar} />
      </Tabs.Screen>
      <Tabs.Screen
        screenKey="other"
        title="Other"
        ios={{ icon: { type: 'sfSymbol', name: 'square' } }}>
        <View style={styles.screen} />
      </Tabs.Screen>
    </Tabs.Host>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, gap: 12, backgroundColor: '#fff' },
  description: { fontSize: 14 },
  probeBox: { height: PROBE_HEIGHT, backgroundColor: '#eee' },
  probeSafeArea: { flex: 1 },
  probeFill: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  probeText: { color: '#fff', fontWeight: '600' },
});
