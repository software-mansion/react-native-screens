import React from 'react';
import type { Scenario } from '../../shared/helpers';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  StackContainer,
  useStackNavigationContext,
} from '../../../shared/gamma/containers/stack';
import { CenteredLayoutView } from '../../../shared/CenteredLayoutView';
import Colors from '../../../shared/styling/Colors';
import { ToastProvider, useToast } from '../../../shared';

const scenario: Scenario = {
  name: 'Prevent native dismiss - nested stack',
  key: 'prevent-native-dismiss-nested-stack',
  details:
    'Observe behavior of prevent native dismiss depending on configuration of nested stack hosting screen',
  platforms: ['android'],
  screen: App,
};

export default scenario;

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
          options: {},
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
      <NavigationButtons
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
      <NavigationButtons isPopEnabled routeNames={['A', 'B', 'NestedStack']} />
    </CenteredLayoutView>
  );
}

function BScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.GreenLight100 }}>
      <RouteInformation routeName="B" />
      <PreventNativeDismissInfo />
      <NavigationButtons isPopEnabled routeNames={['A', 'B', 'NestedStack']} />
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
          options: {},
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
      <NavigationButtons isPopEnabled routeNames={['NestedA', 'NestedB']} />
    </CenteredLayoutView>
  );
}

function NestedAScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.BlueLight40 }}>
      <RouteInformation routeName="NestedA" />
      <PreventNativeDismissInfo />
      <NavigationButtons isPopEnabled routeNames={['NestedA', 'NestedB']} />
    </CenteredLayoutView>
  );
}

function NestedBScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.BlueLight40 }}>
      <RouteInformation routeName="NestedB" />
      <PreventNativeDismissInfo />
      <NavigationButtons isPopEnabled routeNames={['NestedA', 'NestedB']} />
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

function NavigationButtons(props: {
  routeNames: string[];
  isPopEnabled: boolean;
}) {
  const navigation = useStackNavigationContext();

  return (
    <>
      {props.routeNames.map(routeName => (
        <Button
          key={routeName}
          title={`Push ${routeName}`}
          onPress={() => navigation.push(routeName)}
        />
      ))}
      {props.isPopEnabled && (
        <Button
          title="Pop"
          onPress={() => navigation.pop(navigation.routeKey)}
        />
      )}
    </>
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
