import React from 'react';
import type { Scenario } from '@apps/tests/shared/helpers';
import { Button, Text, View, type NativeSyntheticEvent } from 'react-native';
import {
  Tabs,
  type TabsHostNavState,
  type MoreTabSelectedEvent,
} from 'react-native-screens';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { ToastProvider, useToast } from '@apps/shared/';
import { Colors } from '@apps/shared/styling';

const SCENARIO: Scenario = {
  name: 'More navigation controller',
  key: 'test-tabs-more-navigation-controller',
  details:
    'Test navigation and interactions with "More Navigation Controller"',
  platforms: ['ios'],
  AppComponent: App,
};

export default SCENARIO;

const DEFAULT_ICON = {
  icon: {
    type: 'imageSource' as const,
    imageSource: require('@assets/variableIcons/icon.png'),
  },
};

const TAB_KEYS = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'];

const SelectTabContext = React.createContext<(key: string) => void>(() => {});

function ContentView({ screenKey }: { screenKey: string }) {
  return (
    <CenteredLayoutView>
      <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
        {screenKey}
      </Text>
      <TabsNavigationButtons />
    </CenteredLayoutView>
  );
}

function TabsNavigationButtons() {
  const selectTab = React.useContext(SelectTabContext);

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

  const selectTab = React.useCallback((key: string) => {
    setNavState(prev => ({
      selectedScreenKey: key,
      provenance: prev.provenance,
    }));
  }, []);

  return (
    <SelectTabContext value={selectTab}>
      <Tabs.Host
        navState={navState}
        onTabSelected={event => {
          React.startTransition(() => {
            setNavState({
              selectedScreenKey: event.nativeEvent.selectedScreenKey,
              provenance: event.nativeEvent.provenance,
            });
          });
        }}
        ios={{
          onMoreTabSelected: (
            event: NativeSyntheticEvent<MoreTabSelectedEvent>,
          ) => {
            const message = `onMoreTabSelected: ${JSON.stringify(event.nativeEvent, undefined, 2)}`;
            console.warn(message);
            toast.push({ message, backgroundColor: Colors.GreenLight60 });
          },
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
    </SelectTabContext>
  );
}
