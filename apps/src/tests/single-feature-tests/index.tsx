import React from 'react';
import { ScrollView } from 'react-native';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabsScenarios from './tabs-host';
import BottomTabsScreenScenarios from './tabs-screen';
import SplitHostScenarios from './split-host';
import SplitScreenScenarios from './split-screen';
import StackHostScenarios from './stack-host';
import StackScreenScenarios from './stack-screen';
import { Scenario, splitOnUpperCase } from '../shared/helpers';
import { ScenarioButton } from '../shared/ScenarioButton';
import ScenariosScreen from '../shared/ScenarioScreen';

const COMPONENT_SCENARIOS: Record<string, Scenario[]> = {
  BottomTabs: BottomTabsScenarios,
  BottomTabsScreen: BottomTabsScreenScenarios,
  SplitHost: SplitHostScenarios,
  SplitScreen: SplitScreenScenarios,
  StackHost: StackHostScenarios,
  StackScreen: StackScreenScenarios,
} as const;

type ParamsList = { [k: keyof typeof COMPONENT_SCENARIOS]: undefined } & {
  Home: undefined;
};

function HomeScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      {Object.entries(COMPONENT_SCENARIOS).map(([key]) => (
        <ScenarioButton key={key} title={splitOnUpperCase(key)} route={key} />
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
          {Object.entries(COMPONENT_SCENARIOS).map(([key, scenarios]) => (
            <Stack.Screen name={key}>
              {() => (
                <ScenariosScreen
                  key={key}
                  title={splitOnUpperCase(key)}
                  scenarios={scenarios}
                />
              )}
            </Stack.Screen>
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
