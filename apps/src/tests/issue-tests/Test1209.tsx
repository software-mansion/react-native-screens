import React from 'react';
import { View, Text, Button } from 'react-native';
import {
  NavigationContainer,
  NavigationProp,
  NavigatorScreenParams,
  RouteProp,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

type StackParamList = {
  Screen1: undefined;
  Screen2: undefined;
  Screen3: undefined;
};

const Stack = createStackNavigator<StackParamList>();

type TabParamList = {
  TabA: NavigatorScreenParams<typeof Stack> | undefined;
  TabB: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

function Screen1({
  navigation,
}: {
  navigation: StackNavigationProp<StackParamList, 'Screen1'>;
}) {
  return (
    <View
      style={{
        backgroundColor: 'green',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{ color: 'white' }}>Screen 1</Text>
      <Button
        onPress={() => navigation.navigate('Screen2')}
        title="Go to Screen 2"
      />
    </View>
  );
}

function Screen2({
  navigation,
}: {
  navigation: StackNavigationProp<StackParamList, 'Screen2'>;
}) {
  return (
    <View
      style={{
        backgroundColor: 'red',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{ color: 'white' }}>Screen 2</Text>
      <Button
        onPress={() => navigation.navigate('Screen3')}
        title="Go to Screen 3"
      />
    </View>
  );
}

function Screen3() {
  return (
    <View
      style={{
        backgroundColor: 'blue',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{ color: 'white' }}>Screen 3</Text>
    </View>
  );
}

function ScreenB() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Screen B</Text>
    </View>
  );
}

function TabAStack() {
  return (
    <Stack.Navigator initialRouteName="Screen1">
      <Stack.Screen name="Screen1" component={Screen1} />
      <Stack.Screen name="Screen2" component={Screen2} />
      <Stack.Screen name="Screen3" component={Screen3} />
    </Stack.Navigator>
  );
}

export const maybePopToTop = (
  navigation: NavigationProp<TabParamList>,
  tabName: keyof TabParamList,
) => {
  const state = navigation.getState().routes;

  const stackWithState = state.filter(stack => stack.state);

  if (
    stackWithState.length &&
    stackWithState.some(route => route.state?.index !== 0)
  ) {
    if (tabName === 'TabA') {
      navigation.navigate('TabA', { screen: 'Screen1' });
    }
  }
};

const listeners = ({
  navigation,
  route,
}: {
  navigation: NavigationProp<TabParamList>;
  route: RouteProp<TabParamList, keyof TabParamList>;
}) => ({
  tabPress: () => {
    maybePopToTop(navigation, route.name);
  },
});

const MainStack = createStackNavigator();

const Tabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="TabA" component={TabAStack} listeners={listeners} />
    <Tab.Screen name="TabB" component={ScreenB} listeners={listeners} />
  </Tab.Navigator>
);

function App() {
  return (
    <NavigationContainer>
      <MainStack.Navigator>
        <MainStack.Screen name="Tabs" component={Tabs} />
      </MainStack.Navigator>
    </NavigationContainer>
  );
}

export default App;
