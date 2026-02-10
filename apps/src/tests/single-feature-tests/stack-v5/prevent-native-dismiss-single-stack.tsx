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

const SCENARIO: Scenario = {
  name: 'Prevent native dismiss - single stack',
  key: 'prevent-native-dismiss-single-stack',
  details:
    'Test prevent native dismiss behavior in simple single-stack scenario',
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
          options: {},
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
      <NavigationButtons isPopEnabled={false} />
    </CenteredLayoutView>
  );
}

function AScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.YellowLight40 }}>
      <RouteInformation routeName="A" />
      <PreventNativeDismissInfo />
      <NavigationButtons isPopEnabled={true} />
    </CenteredLayoutView>
  );
}

function BScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.GreenLight100 }}>
      <RouteInformation routeName="B" />
      <PreventNativeDismissInfo />
      <NavigationButtons isPopEnabled={true} />
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

function NavigationButtons(props: { isPopEnabled: boolean }) {
  const navigation = useStackNavigationContext();

  return (
    <>
      <Button title="Push A" onPress={() => navigation.push('A')} />
      <Button title="Push B" onPress={() => navigation.push('B')} />
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
