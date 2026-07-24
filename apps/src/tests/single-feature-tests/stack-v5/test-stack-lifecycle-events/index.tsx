import React, { useCallback } from 'react';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { StyleSheet, Text, View } from 'react-native';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { Colors } from '@apps/shared/styling';
import { ToastProvider, useToast } from '@apps/shared';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';

function TestStackLifecycleEvents() {
  return (
    <ToastProvider>
      <StackSetup />
    </ToastProvider>
  );
}

function useMakeLifecycleCallbacks() {
  const toast = useToast();

  return useCallback(
    (screenName: string) => ({
      onWillAppear: () =>
        toast.push({
          message: `${screenName}: onWillAppear`,
          backgroundColor: Colors.GreenLight60,
        }),
      onDidAppear: () =>
        toast.push({
          message: `${screenName}: onDidAppear`,
          backgroundColor: Colors.BlueLight100,
        }),
      onWillDisappear: () =>
        toast.push({
          message: `${screenName}: onWillDisappear`,
          backgroundColor: Colors.NavyLight60,
        }),
      onDidDisappear: () =>
        toast.push({
          message: `${screenName}: onDidDisappear`,
          backgroundColor: Colors.NavyLight100,
        }),
    }),
    [toast],
  );
}

function StackSetup() {
  const makeCallbacks = useMakeLifecycleCallbacks();

  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Home',
          Component: HomeScreen,
          options: {
            ...makeCallbacks('Home'),
            headerConfig: {
              title: 'Home',
            },
          },
        },
        {
          name: 'A',
          Component: AScreen,
          options: {
            ...makeCallbacks('A'),
            headerConfig: {
              title: 'A',
            },
          },
        },
        {
          name: 'NestedStack',
          Component: NestedStackScreen,
          options: {
            ...makeCallbacks('NestedStack'),
            headerConfig: {
              title: 'NestedStack',
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
      <RouteInformation routeName="Home" />
      <StackNavigationButtons
        isPopEnabled={false}
        routeNames={['A', 'NestedStack']}
      />
    </CenteredLayoutView>
  );
}

function AScreen() {
  return (
    <CenteredLayoutView testID='screenA-layout-view' style={{ backgroundColor: Colors.YellowLight40 }}>
      <RouteInformation routeName="A" />
      <StackNavigationButtons isPopEnabled routeNames={['A', 'NestedStack']} />
    </CenteredLayoutView>
  );
}

function NestedStackScreen() {
  const makeCallbacks = useMakeLifecycleCallbacks();

  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'NestedHome',
          Component: NestedHomeScreen,
          options: {
            ...makeCallbacks('NestedHome'),
            headerConfig: {
              title: 'NestedHome',
            },
          },
        },
        {
          name: 'NestedA',
          Component: NestedAScreen,
          options: {
            ...makeCallbacks('NestedA'),
            headerConfig: {
              title: 'NestedA',
            },
          },
        },
      ]}
    />
  );
}

function NestedHomeScreen() {
  return (
    <CenteredLayoutView testID='nested-home-screen-layout-view'style={{ backgroundColor: Colors.BlueLight40 }}>
      <RouteInformation routeName="NestedHome" />
      <StackNavigationButtons isPopEnabled routeNames={['NestedA']} />
    </CenteredLayoutView>
  );
}

function NestedAScreen() {
  return (
    <CenteredLayoutView testID='nested-screenA-layout-view' style={{ backgroundColor: Colors.BlueLight40 }}>
      <RouteInformation routeName="NestedA" />
      <StackNavigationButtons isPopEnabled routeNames={['NestedA']} />
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

const styles = StyleSheet.create({
  routeInformation: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default createScenario(TestStackLifecycleEvents, scenarioDescription);
