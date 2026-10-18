import React, { useEffect, useState } from 'react';
import { Button, Text, View, type NativeSyntheticEvent } from 'react-native';
import {
  Tabs,
  type TabSelectedEvent,
  type TabsHostNavStateRequest,
} from 'react-native-screens';

const DELAYED_MOUNT_MS = 1500;

const TABS = ['home', 'cards', 'settings'] as const;

type TabKey = (typeof TABS)[number];

const INITIAL_TEST_IDS: Record<TabKey, string> = {
  home: 'tab-home',
  cards: 'tab-cards',
  settings: 'tab-settings',
};

type Phase = 'gate' | 'loading' | 'tabs';

export default function Test4748() {
  const [phase, setPhase] = useState<Phase>('gate');
  const [testIDs, setTestIDs] =
    useState<Record<TabKey, string>>(INITIAL_TEST_IDS);
  const [navStateRequest, setNavStateRequest] =
    useState<TabsHostNavStateRequest>({
      selectedScreenKey: 'home',
      baseProvenance: 0,
    });

  useEffect(() => {
    if (phase !== 'loading') {
      return;
    }
    const timeout = setTimeout(() => setPhase('tabs'), DELAYED_MOUNT_MS);
    return () => clearTimeout(timeout);
  }, [phase]);

  if (phase === 'gate') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Mount tabs now"
          testID="mount-immediate"
          onPress={() => setPhase('tabs')}
        />
        <Button
          title="Mount tabs after loading"
          testID="mount-delayed"
          onPress={() => setPhase('loading')}
        />
      </View>
    );
  }

  if (phase === 'loading') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text testID="loading-label">loading</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Tabs.Host
        navStateRequest={navStateRequest}
        onTabSelected={(event: NativeSyntheticEvent<TabSelectedEvent>) =>
          setNavStateRequest({
            selectedScreenKey: event.nativeEvent.selectedScreenKey,
            baseProvenance: event.nativeEvent.provenance,
          })
        }>
        {TABS.map(key => (
          <Tabs.Screen
            key={key}
            screenKey={key}
            title={key}
            tabBarItemTestID={testIDs[key]}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text testID={`content-${key}`}>{key} screen</Text>
              <Button
                title="Rename cards id"
                testID="rename-cards-id"
                onPress={() =>
                  setTestIDs(current => ({
                    ...current,
                    cards: 'tab-cards-next',
                  }))
                }
              />
              <Button
                title="Clear cards id"
                testID="clear-cards-id"
                onPress={() =>
                  setTestIDs(current => ({ ...current, cards: '' }))
                }
              />
              <Button
                title="Reset"
                testID="reset-mount"
                onPress={() => {
                  setTestIDs(INITIAL_TEST_IDS);
                  setNavStateRequest({
                    selectedScreenKey: 'home',
                    baseProvenance: 0,
                  });
                  setPhase('gate');
                }}
              />
            </View>
          </Tabs.Screen>
        ))}
      </Tabs.Host>
    </View>
  );
}
