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

function TestStackPreventNativeDismissSingleStack() {
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
              console.info('Native dismiss prevented');
              toast.push({
                message: 'Native dismiss prevented',
                backgroundColor: Colors.GreenLight60,
              });
            },
            headerConfig: {
              title: 'B',
            },
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
      <StackNavigationButtons isPopEnabled={false} routeNames={['A', 'B']} />
    </CenteredLayoutView>
  );
}

function AScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.YellowLight40 }}>
      <StackRouteInformation routeName="A" />
      <PreventNativeDismissInfo />
      <StackNavigationButtons isPopEnabled={true} routeNames={['A', 'B']} />
    </CenteredLayoutView>
  );
}

function BScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.GreenLight100 }}>
      <StackRouteInformation routeName="B" />
      <PreventNativeDismissInfo />
      <StackNavigationButtons isPopEnabled={true} routeNames={['A', 'B']} />
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

export default createScenario(
  TestStackPreventNativeDismissSingleStack,
  scenarioDescription,
);
