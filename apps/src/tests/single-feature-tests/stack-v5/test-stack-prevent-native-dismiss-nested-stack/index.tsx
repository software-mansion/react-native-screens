import React from 'react';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { Colors } from '@apps/shared/styling';
import { ToastProvider, useToast } from '@apps/shared';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';
import { StackRouteInformation } from '@apps/tests/shared/components/stack-v5/StackRouteInformation';

function TestStackPreventNativeDismissNestedStack() {
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
          element: <HomeScreen />,
        },
        {
          name: 'A',
          element: <AScreen />,
          options: {
            headerConfig: {
              title: 'A',
            },
          },
        },
        {
          name: 'B',
          element: <BScreen />,
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
          element: <NestedStackScreen />,
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
      <StackRouteInformation routeName="Home" />
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
      <StackRouteInformation routeName="A" />
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
      <StackRouteInformation routeName="B" />
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
          element: <NestedHomeScreen />,
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
          element: <NestedAScreen />,
          options: {
            headerConfig: {
              title: 'NestedA',
            },
          },
        },
        {
          name: 'NestedB',
          element: <NestedBScreen />,
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
      <StackRouteInformation routeName="NestedHome" />
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
      <StackRouteInformation routeName="NestedA" />
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
      <StackRouteInformation routeName="NestedB" />
      <PreventNativeDismissInfo />
      <StackNavigationButtons
        isPopEnabled
        routeNames={['NestedA', 'NestedB']}
      />
      <TogglePreventNativeDismiss />
    </CenteredLayoutView>
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
      <Text
        style={styles.routeInformation}
        testID="prevent-native-dismiss-info">
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

export default createScenario(
  TestStackPreventNativeDismissNestedStack,
  scenarioDescription,
);
