import React from 'react';
import { ScrollView } from 'react-native';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Scenario } from '../shared/helpers';
import { ScenarioButton } from '../shared/ScenarioButton';

import OrientationScenarios from './Orientation';
import ScrollViewScenarios from './ScrollView';

function HomeScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior='automatic'>
      <ScenarioButton title="Screen orientation" route="Orientation" />
      <ScenarioButton title="ScrollView" route="ScrollView" />
    </ScrollView>
  );
};

function ScenarioSelect(props: { scenarios: Scenario[] }) {
  return (
    <ScrollView contentInsetAdjustmentBehavior='automatic'>
      { props.scenarios.map(({name, key, details, platforms}) => <ScenarioButton title={name} details={details} route={key} key={key} platformsHint={platforms} />) }
    </ScrollView>
  )
}

function ScenariosScreen(props: { title: string, scenarios: Scenario[] }) {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen key='home' name='home' options={{ headerShown: true, headerLargeTitleEnabled: true, headerTitle: props.title }}>{() => <ScenarioSelect scenarios={props.scenarios}/>}</Stack.Screen>
          { props.scenarios.map(({ name, key, screen }) => <Stack.Screen name={name} key={key} component={screen as any}/>) }
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  )
}

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: true, headerLargeTitleEnabled: true, headerTitle: "Scenarios" }} />
          <Stack.Screen name="Orientation">{() => <ScenariosScreen title='Orientation' scenarios={OrientationScenarios}/>}</Stack.Screen>
          <Stack.Screen name="ScrollView">{() => <ScenariosScreen title='ScrollView' scenarios={ScrollViewScenarios}/>}</Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}