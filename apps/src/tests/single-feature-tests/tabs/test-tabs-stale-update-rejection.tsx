import React from 'react';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import { Button, Text, View } from 'react-native';
import { Tabs, type TabsHostNavState } from 'react-native-screens';
import { CenteredLayoutView } from '../../../shared/CenteredLayoutView';
import { ToastProvider, useToast } from '../../../shared/';
import { Colors } from '@apps/shared/styling';

const scenarioDescription: ScenarioDescription = {
  name: 'Stale update rejection',
  key: 'test-tabs-stale-update-rejection',
  details: 'Test stale update rejection mechanism',
  platforms: ['android', 'ios'],
};

const DEFAULT_ICON = {
  icon: {
    type: 'imageSource' as const,
    imageSource: require('@assets/variableIcons/icon.png'),
  },
};

const TAB_KEYS = ['First', 'Second', 'Third', 'Fourth'];

type TabsContext = {
  selectTab: (key: string) => void;
  rejectStaleNavStateUpdates: boolean;
  toggleRejectStale: () => void;
};

const TabsCtx = React.createContext<TabsContext>({
  selectTab: () => {},
  rejectStaleNavStateUpdates: true,
  toggleRejectStale: () => {},
});

function ContentView({ screenKey }: { screenKey: string }) {
  const { rejectStaleNavStateUpdates, toggleRejectStale } =
    React.useContext(TabsCtx);

  console.log(`ContentView - render for key ${screenKey}`);

  const [heavyRenderEnabled, setHeavyRenderEnabled] = React.useState(false);

  return (
    <CenteredLayoutView>
      <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
        {screenKey}
      </Text>
      <Text style={{ textAlign: 'center' }}>
        heavyRender: {JSON.stringify(heavyRenderEnabled)}
      </Text>
      <Text style={{ textAlign: 'center' }}>
        rejectStaleNavStateUpdates: {JSON.stringify(rejectStaleNavStateUpdates)}
      </Text>
      <HeavyRenderHierarchy enabled={heavyRenderEnabled} timeMs={3000} />
      <TabsNavigationButtons />
      <Button
        title="Toggle heavyRender"
        onPress={() => setHeavyRenderEnabled(prev => !prev)}
      />
      <Button
        title="Toggle rejectStaleNavStateUpdates"
        onPress={toggleRejectStale}
      />
    </CenteredLayoutView>
  );
}

function TabsNavigationButtons() {
  const { selectTab } = React.useContext(TabsCtx);

  return (
    <View>
      {TAB_KEYS.map(key => (
        <Button
          key={key}
          title={`Select ${key}`}
          onPress={() => selectTab(key)}
        />
      ))}
    </View>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AppContents />
    </ToastProvider>
  );
}

function AppContents() {
  const toast = useToast();

  const [navState, setNavState] = React.useState<TabsHostNavState>({
    selectedScreenKey: 'First',
    provenance: 0,
  });

  const [rejectStaleNavStateUpdates, setRejectStale] = React.useState(true);

  const selectTab = React.useCallback((key: string) => {
    setNavState(prev => ({
      selectedScreenKey: key,
      provenance: prev.provenance,
    }));
  }, []);

  const toggleRejectStale = React.useCallback(() => {
    setRejectStale(prev => !prev);
  }, []);

  const ctx = React.useMemo<TabsContext>(
    () => ({ selectTab, rejectStaleNavStateUpdates, toggleRejectStale }),
    [selectTab, rejectStaleNavStateUpdates, toggleRejectStale],
  );

  return (
    <TabsCtx value={ctx}>
      <Tabs.Host
        navState={navState}
        rejectStaleNavStateUpdates={rejectStaleNavStateUpdates}
        onTabSelected={event => {
          React.startTransition(() => {
            setNavState({
              selectedScreenKey: event.nativeEvent.selectedScreenKey,
              provenance: event.nativeEvent.provenance,
            });
          });
        }}
        onTabSelectionRejected={event => {
          const message = `onTabSelectionRejected: ${JSON.stringify(
            event.nativeEvent,
            undefined,
            2,
          )}`;
          console.warn(message);
          toast.push({
            message: message,
            backgroundColor: Colors.GreenLight60,
          });
        }}>
        {TAB_KEYS.map(key => (
          <Tabs.Screen
            key={key}
            screenKey={key}
            title={key}
            ios={DEFAULT_ICON}
            android={DEFAULT_ICON}>
            <ContentView screenKey={key} />
          </Tabs.Screen>
        ))}
      </Tabs.Host>
    </TabsCtx>
  );
}

function HeavyRenderHierarchy({
  enabled,
  timeMs = 5000,
}: {
  enabled: boolean;
  timeMs: number;
}) {
  if (enabled) {
    console.log('HeavyRenderHierarchy computation BEGIN');
    blockThread(timeMs);
    console.log('HeavyRenderHierarchy computation END');
  }
  return (
    <View>
      <Text>HeavyRenderHierarchy</Text>
    </View>
  );
}

function blockThread(ms: number) {
  const end = Date.now() + ms;
  while (Date.now() < end) {}
}

export default createScenario(App, scenarioDescription);
