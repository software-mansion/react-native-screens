import React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button } from 'react-native';
import {
  DEFAULT_TAB_ROUTE_OPTIONS,
  TabsContainer,
} from '@apps/shared/gamma/containers/tabs';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';

type RouteParamList = {
  Screen1: undefined;
  Screen2: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<RouteParamList>;

const Stack = createNativeStackNavigator<RouteParamList>();

function TabsScreen({ navigation }: StackNavigationProp) {
  return (
    <CenteredLayoutView>
      <Button title="Push" onPress={() => navigation.push('Screen2')} />
    </CenteredLayoutView>
  );
}

function Screen1({ navigation }: StackNavigationProp) {
  return (
    <TabsContainer
      routeConfigs={[
        {
          name: 'Tab1',
          Component: () => TabsScreen({ navigation }),
          options: {
            ...DEFAULT_TAB_ROUTE_OPTIONS,
            title: 'Tab1',
          },
        },
        {
          name: 'Tab2',
          Component: () => TabsScreen({ navigation }),
          options: {
            ...DEFAULT_TAB_ROUTE_OPTIONS,
            title: 'Tab2',
          },
        },
        {
          name: 'Tab3',
          Component: () => TabsScreen({ navigation }),
          options: {
            ...DEFAULT_TAB_ROUTE_OPTIONS,
            title: 'Tab3',
          },
        },
      ]}
    />
  );
}

function Screen2({ navigation }: StackNavigationProp) {
  return (
    <CenteredLayoutView>
      <Button title="Pop" onPress={() => navigation.pop()} />
    </CenteredLayoutView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Screen1" component={Screen1} />
        <Stack.Screen name="Screen2" component={Screen2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
