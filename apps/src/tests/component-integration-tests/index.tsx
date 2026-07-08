import React from 'react';
import { ScrollView } from 'react-native';
import {
  NavigationContainer,
  NavigationIndependentTree,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScenarioButton } from '@apps/tests/shared/ScenarioButton';

import OrientationScenarioGroup from './orientation';
import ScrollViewScenarioGroup from './scroll-view';
import FormSheetScenarioGroup from './form-sheet';
import TabsInStackV5ScenarioGroup from './tabs-stack-v5';
import SvmScenarioGroup from './scroll-view-marker';
import ScenarioSelectionScreen from '@apps/tests/shared/ScenarioScreen';

export * from './orientation';
export * from './scroll-view';
export * from './form-sheet';
export * from './tabs-stack-v5';
export * from './scroll-view-marker';

export const COMPONENT_SCENARIOS = {
  Orientation: OrientationScenarioGroup,
  ScrollView: ScrollViewScenarioGroup,
  FormSheet: FormSheetScenarioGroup,
  TabsInStackV5: TabsInStackV5ScenarioGroup,
  ScrollViewMarker: SvmScenarioGroup,
} as const;

type ScenarioName = keyof typeof COMPONENT_SCENARIOS;
type ParamsList = { [Key in ScenarioName | 'Home']: undefined };

const SCENARIO_NAMES: ScenarioName[] = [
  'Orientation',
  'ScrollView',
  'FormSheet',
  'TabsInStackV5',
  'ScrollViewMarker',
];

export function HomeScreen() {
  const navigation = useNavigation<typeof Stack, 'Home'>('Home');

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      testID="component-integration-tests-scrollview">
      {SCENARIO_NAMES.map(key => {
        const scenarioGroup = COMPONENT_SCENARIOS[key];

        return (
          <ScenarioButton
            key={key}
            title={scenarioGroup.name}
            onPress={() => navigation.navigate(key)}
            testID={`component-integration-tests-${scenarioGroup.name.replace(
              /\s/g,
              '',
            )}`}
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
