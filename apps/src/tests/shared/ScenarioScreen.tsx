import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import type { Scenario, ScenarioGroup } from './helpers';
import { ScenarioButton } from './ScenarioButton';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';

function ScenarioSelect(props: { scenarios: Scenario[] }) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      {Object.values(props.scenarios).map((ScenarioComponent: Scenario) => {
        const { name, key, details, platforms } =
          ScenarioComponent.scenarioDescription;
        return (
          <ScenarioButton
            title={name}
            details={details}
            route={key}
            key={key}
            platformsHint={platforms}
            testID={key}
          />
        );
      })}
    </ScrollView>
  );
}

export default function ScenarioSelectionScreen(props: {
  scenarioGroup: ScenarioGroup;
}) {
  const Stack = useMemo(() => createNativeStackNavigator(), []);

  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            key="Main"
            name="Main"
            options={{
              headerShown: true,
              headerLargeTitleEnabled: true,
              headerTitle: props.scenarioGroup.name,
            }}>
            {() => <ScenarioSelect scenarios={props.scenarioGroup.scenarios} />}
          </Stack.Screen>
          {Object.values<Scenario>(props.scenarioGroup.scenarios).map(
            (ScenarioComponent: Scenario) => {
              const { key } = ScenarioComponent.scenarioDescription;
              return (
                <Stack.Screen
                  key={key}
                  name={key}
                  component={ScenarioComponent}
                />
              );
            },
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
