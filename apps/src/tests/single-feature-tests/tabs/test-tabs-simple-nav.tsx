import React from 'react';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import { Button, Text, View } from 'react-native';
import { Tabs, type TabsHostNavState } from 'react-native-screens';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';

const scenarioDescription: ScenarioDescription = {
  name: 'Test simple navigation',
  key: 'test-tabs-simple-nav',
  details: 'Test basic navigation scenarios',
  platforms: ['android', 'ios'],
};

const DEFAULT_ICON = {
  icon: {
    type: 'imageSource' as const,
    imageSource: require('@assets/variableIcons/icon.png'),
  },
};

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
      <Button title="Select First" onPress={() => selectTab('First')} />
      <Button title="Select Second" onPress={() => selectTab('Second')} />
      <Button title="Select Third" onPress={() => selectTab('Third')} />
    </View>
  );
}

export function App() {
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
        }}>
        <Tabs.Screen
          screenKey="First"
          title="First"
          ios={DEFAULT_ICON}
          android={DEFAULT_ICON}>
          <ContentView screenKey="First" />
        </Tabs.Screen>
        <Tabs.Screen
          screenKey="Second"
          title="Second"
          ios={DEFAULT_ICON}
          android={DEFAULT_ICON}>
          <ContentView screenKey="Second" />
        </Tabs.Screen>
        <Tabs.Screen
          screenKey="Third"
          title="Third"
          ios={DEFAULT_ICON}
          android={DEFAULT_ICON}>
          <ContentView screenKey="Third" />
        </Tabs.Screen>
      </Tabs.Host>
    </SelectTabContext>
  );
}

export default createScenario(App, scenarioDescription);
