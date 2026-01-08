import React from 'react';
import { ScrollView } from 'react-native';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabsScenarios from './BottomTabs';
import BottomTabsScreenScenarios from './BottomTabsScreen';
import SplitHostScenarios from './SplitHost';
import SplitScreenScenarios from './SplitScreen';
import StackHostScenarios from './StackHost';
import StackScreenScenarios from './StackScreen';
import { Scenario } from '../shared/helpers';
import { ScenarioButton } from '../shared/ScenarioButton';

function HomeScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior='automatic'>
      <ScenarioButton title="Bottom Tabs" route="BottomTabs" />
      <ScenarioButton title="Bottom Tabs Screen" route="BottomTabsScreen" />
      <ScenarioButton title="Split Host" route="SplitHost" />
      <ScenarioButton title="Split Screen" route="SplitScreen" />
      <ScenarioButton title="Stack Host" route="StackHost" />
      <ScenarioButton title="Stack Screen" route="StackScreen" />
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
          <Stack.Screen name="BottomTabs">{() => <ScenariosScreen title='BottomTabs' scenarios={BottomTabsScenarios}/>}</Stack.Screen>
          <Stack.Screen name="BottomTabsScreen">{() => <ScenariosScreen title='BottomTabsScreen' scenarios={BottomTabsScreenScenarios}/>}</Stack.Screen>
          <Stack.Screen name="SplitHost">{() => <ScenariosScreen title='SplitHost' scenarios={SplitHostScenarios}/>}</Stack.Screen>
          <Stack.Screen name="SplitScreen">{() => <ScenariosScreen title='SplitScreen' scenarios={SplitScreenScenarios}/>}</Stack.Screen>
          <Stack.Screen name="StackHost">{() => <ScenariosScreen title='StackHost' scenarios={StackHostScenarios}/>}</Stack.Screen>
          <Stack.Screen name="StackScreen">{() => <ScenariosScreen title='StackScreen' scenarios={StackScreenScenarios}/>}</Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}