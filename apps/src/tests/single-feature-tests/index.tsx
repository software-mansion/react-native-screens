import React from 'react';
import { ScrollView } from 'react-native';
import {
  NavigationContainer,
  NavigationIndependentTree,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabsScenarioGroup from './tabs';
import SplitScenarioGroup from './split';
import StackV5ScenarioGroup from './stack-v5';
import StackV4ScenarioGroup from './stack-v4';
import ScrollViewMarkerScenarioGroup from './scroll-view-marker';
import FormSheetScenarioGroup from './form-sheet';
import { ScenarioButton } from '@apps/tests/shared/ScenarioButton';
import ScenarioSelectionScreen from '@apps/tests/shared/ScenarioScreen';

export * from './tabs';
export * from './split';
export * from './stack-v5';
export * from './stack-v4';
export * from './scroll-view-marker';
export * from './form-sheet';

export const COMPONENT_SCENARIOS = {
  Tabs: TabsScenarioGroup,
  Split: SplitScenarioGroup,
  StackV5: StackV5ScenarioGroup,
  StackV4: StackV4ScenarioGroup,
  ScrollViewMarker: ScrollViewMarkerScenarioGroup,
  FormSheet: FormSheetScenarioGroup,
} as const;

type ScenarioName = keyof typeof COMPONENT_SCENARIOS;
type ParamsList = { [Key in ScenarioName | 'Home']: undefined };

const SCENARIO_NAMES: ScenarioName[] = [
  'Tabs',
  'Split',
  'StackV5',
  'StackV4',
  'ScrollViewMarker',
  'FormSheet',
];

export function HomeScreen() {
  const navigation = useNavigation<typeof Stack, 'Home'>('Home');

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      testID="single-feature-tests-scrollview">
      {SCENARIO_NAMES.map(key => {
        const scenarioGroup = COMPONENT_SCENARIOS[key];

        return (
          <ScenarioButton
            key={key}
            title={scenarioGroup.name}
            onPress={() => navigation.navigate(key)}
            testID={`single-feature-tests-${scenarioGroup.name}`}
            {...(scenarioGroup.details === undefined
              ? {}
              : { details: scenarioGroup.details })}
          />
        );
      })}
    </ScrollView>
  );
}

const Stack = createNativeStackNavigator<ParamsList>();

export default function App() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: true,
              headerLargeTitleEnabled: true,
              headerTitle: 'Scenarios',
            }}
          />
          {SCENARIO_NAMES.map(key => {
            const scenarioGroup = COMPONENT_SCENARIOS[key];

            return (
              <Stack.Screen name={key}>
                {() => (
                  <ScenarioSelectionScreen
                    key={key}
                    scenarioGroup={scenarioGroup}
                  />
                )}
              </Stack.Screen>
            );
          })}
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
