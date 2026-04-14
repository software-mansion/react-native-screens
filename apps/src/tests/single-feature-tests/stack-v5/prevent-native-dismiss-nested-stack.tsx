import React from 'react';
import type { Scenario } from '@apps/tests/shared/helpers';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { Colors } from '@apps/shared/styling';
import { ToastProvider, useToast } from '@apps/shared';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';

const SCENARIO: Scenario = {
  name: 'Prevent native dismiss - nested stack',
  key: 'prevent-native-dismiss-nested-stack',
  details:
    'Observe behavior of prevent native dismiss depending on configuration of nested stack hosting screen',
  platforms: ['android'],
  AppComponent: App,
};

export default SCENARIO;

export function App() {
  return (
    <ToastProvider>
      <StackSetup />
    </ToastProvider>
  );
}

function StackSetup() {
  const toast = useToast();

  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Home',
          Component: HomeScreen,
          options: {},
        },
        {
          name: 'A',
          Component: AScreen,
          options: {
            headerConfig: {
              title: 'A',
            },
          },
        },
        {
          name: 'B',
          Component: BScreen,
          options: {
            preventNativeDismiss: true,
            onNativeDismissPrevented: () => {
              console.info('Native dismiss prevented - B');
              toast.push({
                message: 'Native dismiss prevented - B',
                backgroundColor: Colors.GreenLight60,
              });
            },
            headerConfig: {
              title: 'B',
            },
          },
        },
        {
          name: 'NestedStack',
          Component: NestedStackScreen,
          options: {
            // This one is interesting. It will prevent nested stack from being popped.
            preventNativeDismiss: false,
          },
        },
      ]}
    />
  );
}

function HomeScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.BlueLight40 }}>
      <RouteInformation routeName="Home" />
      <StackNavigationButtons
        isPopEnabled={false}
        routeNames={['A', 'B', 'NestedStack']}
      />
    </CenteredLayoutView>
  );
}

function AScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.YellowLight40 }}>
      <RouteInformation routeName="A" />
      <PreventNativeDismissInfo />
      <StackNavigationButtons
        isPopEnabled
        routeNames={['A', 'B', 'NestedStack']}
      />
    </CenteredLayoutView>
  );
}

function BScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.GreenLight100 }}>
      <RouteInformation routeName="B" />
      <PreventNativeDismissInfo />
      <StackNavigationButtons
        isPopEnabled
        routeNames={['A', 'B', 'NestedStack']}
      />
      <TogglePreventNativeDismiss />
    </CenteredLayoutView>
  );
}

function NestedStackScreen() {
  const toast = useToast();

  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'NestedHome',
          Component: NestedHomeScreen,
          options: {
            // This one will also prevent!
            preventNativeDismiss: true,
            onNativeDismissPrevented: () => {
              console.info('Native dismiss prevented - NestedHome');
              toast.push({
                message: 'Native dismiss prevented - NestedHome',
                backgroundColor: Colors.GreenLight60,
              });
            },
          },
        },
        {
          name: 'NestedA',
          Component: NestedAScreen,
          options: {
            headerConfig: {
              title: 'NestedA',
            },
          },
        },
        {
          name: 'NestedB',
          Component: NestedBScreen,
          options: {
            preventNativeDismiss: true,
            onNativeDismissPrevented: () => {
              console.info('Native dismiss prevented - NestedB');
              toast.push({
                message: 'Native dismiss prevented - NestedB',
                backgroundColor: Colors.GreenLight60,
              });
            },
            headerConfig: {
              title: 'NestedB',
            },
          },
        },
      ]}
    />
  );
}

function NestedHomeScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.BlueLight40 }}>
      <RouteInformation routeName="NestedHome" />
      <PreventNativeDismissInfo />
      <StackNavigationButtons
        isPopEnabled
        routeNames={['NestedA', 'NestedB']}
      />
      <TogglePreventNativeDismiss />
    </CenteredLayoutView>
  );
}

function NestedAScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.BlueLight40 }}>
      <RouteInformation routeName="NestedA" />
      <PreventNativeDismissInfo />
      <StackNavigationButtons
        isPopEnabled
        routeNames={['NestedA', 'NestedB']}
      />
    </CenteredLayoutView>
  );
}

function NestedBScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.BlueLight40 }}>
      <RouteInformation routeName="NestedB" />
      <PreventNativeDismissInfo />
      <StackNavigationButtons
        isPopEnabled
        routeNames={['NestedA', 'NestedB']}
      />
      <TogglePreventNativeDismiss />
    </CenteredLayoutView>
  );
}

function RouteInformation(props: { routeName: string }) {
  const routeKey = useStackNavigationContext().routeKey;

  return (
    <View>
      <Text style={styles.routeInformation}>Name: {props.routeName}</Text>
      <Text style={styles.routeInformation}>Key: {routeKey}</Text>
    </View>
  );
}

function TogglePreventNativeDismiss() {
  const navigation = useStackNavigationContext();

  return (
    <Button
      title="Toggle Prevent Native Dismiss"
      onPress={() =>
        navigation.setRouteOptions(navigation.routeKey, {
          preventNativeDismiss: !navigation.routeOptions.preventNativeDismiss,
        })
      }
    />
  );
}

function PreventNativeDismissInfo() {
  const navContext = useStackNavigationContext();

  return (
    <View>
      <Text style={styles.routeInformation}>
        Prevent native dismiss:{' '}
        {navContext.routeOptions.preventNativeDismiss ? 'Enabled' : 'Disabled'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  routeInformation: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
