import React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { ScrollView, Button, Text } from 'react-native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Screen, ScreenSplit } from 'react-native-screens';

export default function SplitNavigation() {
  return (
    <ScreenSplit>
      <Screen>
        <Text style={{ height: '100%', backgroundColor: 'red' }}>
          Go to `TabNavigator` and then go to second tab there. Spot the
          difference between dismissing modal with a swipe and with a `Pop to top`
          button.
          Go to `TabNavigator` and then go to second tab there. Spot the
          difference between dismissing modal with a swipe and with a `Pop to top`
          button.
        </Text>
      </Screen>
      <Screen>
        <NativeNavigation />
      </Screen>
    </ScreenSplit>
  );
}

const Stack = createNativeStackNavigator();

const NativeNavigation = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="CardNestedNavigator" component={NestedNavigator} options={{ presentation: 'card' }} />
      <Stack.Screen name="ModalNestedNavigator" component={NestedNavigator} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

const Tab = createBottomTabNavigator();

const NestedNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Screen1" component={Home} />
    <Tab.Screen name="Screen2" component={Inner} />
    <Tab.Screen name="Screen3" component={Home} />
  </Tab.Navigator>
);

const InnerStack = createNativeStackNavigator();

const Inner = () => (
  <InnerStack.Navigator>
    <InnerStack.Screen name="DeeperHome" component={Home} />
  </InnerStack.Navigator>
);

function Home({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <ScrollView
      style={{ backgroundColor: 'yellow' }}
      contentInsetAdjustmentBehavior="automatic">
      <Button
        title="Card NestedNavigator"
        onPress={() => {
          navigation.navigate('CardNestedNavigator');
        }}
      />
      <Button
        title="Modal NestedNavigator"
        onPress={() => {
          navigation.navigate('ModalNestedNavigator');
        }}
      />
      <Button
        title="Pop one modal"
        onPress={() => {
          navigation.pop();
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
