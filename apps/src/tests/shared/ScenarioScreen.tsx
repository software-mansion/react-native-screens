import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { Scenario, ScenarioGroup } from './helpers';
import { ScenarioButton } from './ScenarioButton';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';

function ScenarioSelect(props: { scenarios: Scenario[] }) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      {props.scenarios.map(({ name, key, details, platforms }) => (
        <ScenarioButton
          title={name}
          details={details}
          route={key}
          key={key}
          platformsHint={platforms}
        />
      ))}
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
          {props.scenarioGroup.scenarios.map(({ key, AppComponent }) => (
            <Stack.Screen name={key} key={key} component={AppComponent} />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
