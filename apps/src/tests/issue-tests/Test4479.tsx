import React from 'react';
import { Appearance, Button } from 'react-native';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  DEFAULT_TAB_ROUTE_OPTIONS,
  TabsContainer,
} from '@apps/shared/containers/tabs';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { ThemedText } from '@apps/shared';

type RouteParamList = {
  One: undefined;
};

const Stack = createNativeStackNavigator<RouteParamList>();

function OneScreen() {
  return (
    <CenteredLayoutView>
      <ThemedText>Watch the prominent + button in the header.</ThemedText>
    </CenteredLayoutView>
  );
}

function TabOne() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="One"
            component={OneScreen}
            options={{
              title: 'One',
              headerLargeTitle: true,
              unstable_headerRightItems: () => [
                {
                  type: 'button',
                  label: 'Add',
                  icon: { type: 'sfSymbol', name: 'plus' },
                  variant: 'prominent',
                  tintColor: '#3B72C0',
                  onPress: () => {},
                },
              ],
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

function TabTwo() {
  return (
    <CenteredLayoutView>
      <Button
        title="Toggle appearance, then go back to One"
        onPress={() =>
          Appearance.setColorScheme(
            Appearance.getColorScheme() === 'dark' ? 'light' : 'dark',
          )
        }
      />
    </CenteredLayoutView>
  );
}

export default function App() {
  return (
    <TabsContainer
      defaultRouteName="One"
      routeConfigs={[
        {
          name: 'One',
          element: <TabOne />,
          options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'One' },
        },
        {
          name: 'Two',
          element: <TabTwo />,
          options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'Two' },
        },
      ]}
    />
  );
}
