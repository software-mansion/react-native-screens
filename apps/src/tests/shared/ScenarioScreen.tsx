import React from 'react';
import { ScrollView } from 'react-native';
import { Scenario } from './helpers';
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

export default function ScenariosScreen(props: {
  title: string;
  scenarios: Scenario[];
}) {
  const Stack = createNativeStackNavigator();

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
              headerTitle: props.title,
            }}>
            {() => <ScenarioSelect scenarios={props.scenarios} />}
          </Stack.Screen>
          {props.scenarios.map(({ name, key, screen }) => (
            <Stack.Screen name={name} key={key} component={screen} />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
