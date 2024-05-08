// connected PRs: #679, #675
import React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { ScrollView, Button, Text } from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import {createStackNavigator} from '@react-navigation/stack';

const Stack = createNativeStackNavigator();

export default function NativeNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          presentation: 'modal',
        }}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            orientation: 'portrait_up',
          }}
        />
        <Stack.Screen
          name="NestedNavigator"
          component={NestedNavigator}
          options={{
            orientation: 'landscape_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// change to createStackNavigator to test with stack in the middle
const Tab = createBottomTabNavigator();

const NestedNavigator = () => (
  <Tab.Navigator
    screenOptions={
      {
        // orientation: 'landscape_left',
      }
    }>
    <Tab.Screen name="Screen1" component={Home} />
    <Tab.Screen name="Screen2" component={Inner} />
    <Tab.Screen
      name="Screen3"
      component={Home}
      // options={{orientation: 'landscape_right'}}
    />
  </Tab.Navigator>
);

const InnerStack = createNativeStackNavigator();

const Inner = () => (
  <InnerStack.Navigator
    screenOptions={{
      orientation: 'portrait_down',
    }}>
    <InnerStack.Screen name="DeeperHome" component={Home} />
  </InnerStack.Navigator>
);

function Home({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  const [yes, setYes] = React.useState(true);
  return (
    <ScrollView
      style={{ backgroundColor: 'yellow' }}
      contentInsetAdjustmentBehavior="automatic">
      <Button
        title="NestedNavigator"
        onPress={() => {
          navigation.push('NestedNavigator');
        }}
      />
      <Button
        title="Screen2"
        onPress={() => {
          navigation.navigate('Screen2');
        }}
      />
      <Button
        title="Pop one modal"
        onPress={() => {
          navigation.pop();
        }}
      />
      <Button
        title="Randomly change screen orientation"
        onPress={() => {
          navigation.setOptions({
            orientation: Math.random() > 0.5 ? 'portrait' : 'landscape',
          });
          setYes(!yes);
        }}
      />
      <Text>
        Go to `TabNavigator` and then go to second tab there. Spot the
        difference between dismissing modal with a swipe and with a `Pop to top`
        button.{' '}
      </Text>
    </ScrollView>
  );
}
