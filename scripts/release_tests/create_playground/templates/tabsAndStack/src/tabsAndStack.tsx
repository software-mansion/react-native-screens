import React, { useCallback, useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  type NativeSyntheticEvent,
} from 'react-native';
import {
  enableScreens,
  Stack,
  Tabs,
  type TabSelectedEvent,
} from 'react-native-screens';

import { SafeAreaView } from 'react-native-screens/experimental';

enableScreens();

type TabState = {
  selectedScreenKey: string;
  provenance: number;
};

type StackRoute = {
  key: string;
  title: string;
  activityMode: 'attached' | 'detached';
};

export default function TabsAndStack() {
  const [tabState, setTabState] = useState<TabState>({
    selectedScreenKey: 'home',
    provenance: 0,
  });

  return (
    <Tabs.Host
      navStateRequest={{
        selectedScreenKey: tabState.selectedScreenKey,
        baseProvenance: tabState.provenance,
      }}
      onTabSelected={(e: NativeSyntheticEvent<TabSelectedEvent>) => {
        setTabState({
          selectedScreenKey: e.nativeEvent.selectedScreenKey,
          provenance: e.nativeEvent.provenance,
        });
      }}>
      <Tabs.Screen screenKey="home" title="Home">
        <HomeTab />
      </Tabs.Screen>

      <Tabs.Screen screenKey="profile" title="Profile">
        <Centered bg="#E8F5E9" label="Profile tab" />
      </Tabs.Screen>

      <Tabs.Screen screenKey="stack" title="Stack">
        <StackTab />
      </Tabs.Screen>
    </Tabs.Host>
  );
}

function HomeTab() {
  return <Centered bg="#E3F2FD" label="Home tab" />;
}

function StackTab() {
  const [routes, setRoutes] = useState<StackRoute[]>([
    { key: 'root', title: 'Stack root', activityMode: 'attached' },
  ]);

  const push = useCallback(() => {
    const n = routes.filter(r => r.activityMode === 'attached').length;
    setRoutes(prev => [
      ...prev,
      {
        key: `details-${Date.now()}`,
        title: `Details #${n}`,
        activityMode: 'attached',
      },
    ]);
  }, [routes]);

  const popTop = useCallback(() => {
    setRoutes(prev => {
      const topIndex = prev.map(r => r.activityMode).lastIndexOf('attached');
      if (topIndex <= 0) {
        return prev;
      }
      const next = [...prev];
      next[topIndex] = { ...next[topIndex], activityMode: 'detached' };
      return next;
    });
  }, []);

  const removeRoute = useCallback((screenKey: string) => {
    setRoutes(prev => prev.filter(r => r.key !== screenKey));
  }, []);

  return (
    <Stack.Host>
      {routes.map(route => (
        <Stack.Screen
          key={route.key}
          screenKey={route.key}
          activityMode={route.activityMode}
          onDismiss={removeRoute}
          onNativeDismiss={removeRoute}>
          <View style={[styles.center, styles.stackScreen]}>
            <Text style={styles.title}>{route.title}</Text>
            <Button title="Push" onPress={push} />
            {route.key !== 'root' && <Button title="Pop" onPress={popTop} />}
          </View>
          <Stack.HeaderConfig title={route.title} />
        </Stack.Screen>
      ))}
    </Stack.Host>
  );
}

function Centered({ bg, label }: { bg: string; label: string }) {
  return (
    <SafeAreaView style={[styles.center, { backgroundColor: bg }]}>
      <Text style={styles.title}>{label}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  stackScreen: {
    backgroundColor: '#FFF3E0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
});
