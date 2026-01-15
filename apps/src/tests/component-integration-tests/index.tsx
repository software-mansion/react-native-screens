import React from 'react';
import { ScrollView } from 'react-native';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Scenario, ucsplit } from '../shared/helpers';
import { ScenarioButton } from '../shared/ScenarioButton';

import OrientationScenarios from './orientation';
import ScrollViewScenarios from './scroll-view';
import ScenariosScreen from '../shared/ScenarioScreen';

const COMPONENTS_SCENARIOS: Record<string, Scenario[]> = {
  Orientation: OrientationScenarios,
  ScrollView: ScrollViewScenarios,
} as const;

type ParamsList = { [k: keyof typeof COMPONENTS_SCENARIOS]: undefined } & {
  Home: undefined;
};

function HomeScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      {Object.entries(COMPONENTS_SCENARIOS).map(([key]) => (
        <ScenarioButton key={key} title={ucsplit(key)} route={key} />
      ))}
    </ScrollView>
  );
}

export default function App() {
  const Stack = createNativeStackNavigator<ParamsList>();

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
          <Stack.Screen name="Orientation">
            {() => (
              <ScenariosScreen
                title="Orientation"
                scenarios={OrientationScenarios}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="ScrollView">
            {() => (
              <ScenariosScreen
                title="ScrollView"
                scenarios={ScrollViewScenarios}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
