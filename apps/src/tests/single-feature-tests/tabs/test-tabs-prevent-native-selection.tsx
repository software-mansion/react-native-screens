import React from 'react';
import type { Scenario } from '../../shared/helpers';
import { Button, Text, View } from 'react-native';
import { Tabs, type TabsHostNavState } from 'react-native-screens';
import { CenteredLayoutView } from '../../../shared/CenteredLayoutView';
import { ToastProvider, useToast } from '../../../shared/';
import { Colors } from '@apps/shared/styling';

const SCENARIO: Scenario = {
  name: 'Prevent native selection',
  key: 'test-tabs-prevent-native-selection',
  details: 'Test preventNativeSelection prop on TabsScreen',
  platforms: ['android', 'ios'],
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

type TabsContext = {
  selectTab: (key: string) => void;
  preventNativeSelection: Record<string, boolean>;
  togglePreventNativeSelection: (key: string) => void;
};

const TabsCtx = React.createContext<TabsContext>({
  selectTab: () => {},
  preventNativeSelection: {},
  togglePreventNativeSelection: () => {},
});

function ContentView({ screenKey }: { screenKey: string }) {
  const { preventNativeSelection, togglePreventNativeSelection } =
    React.useContext(TabsCtx);

  const prevented = preventNativeSelection[screenKey] ?? false;

  return (
    <CenteredLayoutView>
      <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
        {screenKey}
      </Text>
      <Text style={{ textAlign: 'center' }}>
        preventNativeSelection: {JSON.stringify(prevented)}
      </Text>
      <Button
        title="Toggle preventNativeSelection"
        onPress={() => togglePreventNativeSelection(screenKey)}
      />
      <TabsNavigationButtons />
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

  const [preventNativeSelection, setPreventNativeSelection] = React.useState<
    Record<string, boolean>
  >({});

  const selectTab = React.useCallback((key: string) => {
    setNavState(prev => ({
      selectedScreenKey: key,
      provenance: prev.provenance,
    }));
  }, []);

  const togglePreventNativeSelection = React.useCallback((key: string) => {
    setPreventNativeSelection(prev => ({
      ...prev,
      [key]: !(prev[key] ?? false),
    }));
  }, []);

  const ctx = React.useMemo<TabsContext>(
    () => ({ selectTab, preventNativeSelection, togglePreventNativeSelection }),
    [selectTab, preventNativeSelection, togglePreventNativeSelection],
  );

  return (
    <TabsCtx value={ctx}>
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
        onTabSelectionPrevented={event => {
          const message = `onTabSelectionPrevented: ${event.nativeEvent.preventedScreenKey}`;
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
            preventNativeSelection={preventNativeSelection[key] ?? false}
            ios={DEFAULT_ICON}
            android={DEFAULT_ICON}>
            <ContentView screenKey={key} />
          </Tabs.Screen>
        ))}
      </Tabs.Host>
    </TabsCtx>
  );
}
