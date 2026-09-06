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
  ScreenStack,
  ScreenStackItem,
  Tabs,
  type TabSelectedEvent,
} from 'react-native-screens';

enableScreens();

type TabState = {
  selectedScreenKey: string;
  provenance: number;
};

type StackRoute = {
  key: string;
  title: string;
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
    { key: 'root', title: 'Stack root' },
  ]);

  const push = useCallback(() => {
    setRoutes(prev => [
      ...prev,
      {
        key: `details-${Date.now()}`,
        title: `Details #${prev.length}`,
      },
    ]);
  }, []);

  const popTop = useCallback(() => {
    setRoutes(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const removeRoute = useCallback((screenKey: string) => {
    setRoutes(prev => prev.filter(r => r.key !== screenKey));
  }, []);

  return (
    <ScreenStack style={styles.flex}>
      {routes.map(route => (
        <ScreenStackItem
          key={route.key}
          screenId={route.key}
          activityState={2}
          headerConfig={{ title: route.title }}
          onDismissed={() => removeRoute(route.key)}>
          <View style={[styles.center, styles.stackScreen]}>
            <Text style={styles.title}>{route.title}</Text>
            <Button title="Push" onPress={push} />
            {route.key !== 'root' && <Button title="Pop" onPress={popTop} />}
          </View>
        </ScreenStackItem>
      ))}
    </ScreenStack>
  );
}

function Centered({ bg, label }: { bg: string; label: string }) {
  return (
    <View style={[styles.center, { backgroundColor: bg }]}>
      <Text style={styles.title}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
