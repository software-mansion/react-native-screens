import React from 'react';
import { ScrollView } from 'react-native';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScenarioButton } from '../shared/ScenarioButton';

import OrientationScenarioGroup from './orientation';
import ScrollViewScenarioGroup from './scroll-view';
import ScenarioSelectionScreen from '../shared/ScenarioScreen';

export const COMPONENT_SCENARIOS = {
  Orientation: OrientationScenarioGroup,
  ScrollView: ScrollViewScenarioGroup,
} as const;

type ParamsList = { [k: keyof typeof COMPONENT_SCENARIOS]: undefined } & {
  Home: undefined;
};

function HomeScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      {Object.entries(COMPONENT_SCENARIOS).map(([key, scenarioGroup]) => (
        <ScenarioButton key={key} title={scenarioGroup.name} route={key} />
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
