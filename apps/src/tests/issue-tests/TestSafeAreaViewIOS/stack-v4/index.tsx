import {
  NavigationContainer,
  NavigationIndependentTree,
  ParamListBase,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  StackV4SAVExampleConfig,
  StackV4SAVExampleContext,
} from './StackV4SAVExampleContext';
import ConfigScreen from './ConfigScreen';
import TestScreen from './TestScreen';
import Colors from '../../../../shared/styling/Colors';

type RouteParamList = {
  ConfigScreen: undefined;
  TestScreen: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

export type StackNavigationProp = NavigationProp<RouteParamList>;

const Stack = createNativeStackNavigator<RouteParamList>();

export default function StackV4SAVExample({
  headerBackgroundColor,
}: {
  headerBackgroundColor?: string;
}) {
  const [config, setConfig] = useState<StackV4SAVExampleConfig>({
    headerTransparent: false,
    headerLargeTitle: false,
    headerShown: true,
    headerSearchBar: 'disabled',
    content: 'regularView',
    safeAreaTopEdge: true,
    safeAreaBottomEdge: true,
    safeAreaLeftEdge: true,
    safeAreaRightEdge: true,
  });

  return (
    <StackV4SAVExampleContext.Provider
      value={{
        config,
        setConfig,
      }}>
      <NavigationIndependentTree>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: headerBackgroundColor,
              },
            }}>
            <Stack.Screen
              name="ConfigScreen"
              component={ConfigScreen}
              options={
                {
                  // headerTransparent: true,
                  // headerLargeTitle: true,
                }
              }
            />
            <Stack.Screen
              name="TestScreen"
              component={TestScreen}
              options={{
                contentStyle: {
                  backgroundColor: Colors.GreenLight80,
                },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NavigationIndependentTree>
    </StackV4SAVExampleContext.Provider>
  );
}
