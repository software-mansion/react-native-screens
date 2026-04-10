import React from 'react';
import { ScrollView } from 'react-native';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabsScenarioGroup from './tabs';
import SplitScenarioGroup from './split';
import StackV5ScenarioGroup from './stack-v5';
import StackV4ScenarioGroup from './stack-v4';
import { ScenarioButton } from '@apps/tests/shared/ScenarioButton';
import ScenarioSelectionScreen from '@apps/tests/shared/ScenarioScreen';

export const COMPONENT_SCENARIOS = {
  Tabs: TabsScenarioGroup,
  Split: SplitScenarioGroup,
  StackV5: StackV5ScenarioGroup,
  StackV4: StackV4ScenarioGroup,
} as const;

type ParamsList = { [k: keyof typeof COMPONENT_SCENARIOS]: undefined } & {
  Home: undefined;
};

function HomeScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic"
      testID="single-feature-tests-scrollview"> 
      {/* it might be not needed, but it is added to be sure that the scroll view is rendered and can be scrolled in tests */}
      {Object.entries(COMPONENT_SCENARIOS).map(([key, scenarioGroup]) => (
        <ScenarioButton
          key={key}
          title={scenarioGroup.name}
          route={key}
          details={scenarioGroup.details}
          testID={`single-feature-tests-${scenarioGroup.name}`}
        />
      ))}
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
          {Object.entries(COMPONENT_SCENARIOS).map(([key, scenarioGroup]) => (
            <Stack.Screen name={key}>
              {() => (
                <ScenarioSelectionScreen
                  key={key}
                  scenarioGroup={scenarioGroup}
                />
              )}
            </Stack.Screen>
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
