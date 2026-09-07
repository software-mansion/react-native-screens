import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  StackContainer,
  type StackRouteConfig,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import {
  TabsContainer,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/containers/tabs';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { Colors } from '@apps/shared/styling';
import { ToastProvider, useToast } from '@apps/shared';
import { createScenario } from '@apps/tests/shared/helpers';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';
import { StackRouteInformation } from '@apps/tests/shared/components/stack-v5/StackRouteInformation';
import {
  OuterStackNavigationProvider,
  PushOuterStackRouteButton,
} from '@apps/tests/shared/components/stack-v5/OuterStackNavigation';
import { scenarioDescription } from './scenario-description';

function TestStackPreventNativeDismissTabsInStack() {
  return (
    <ToastProvider>
      <StackContainer routeConfigs={STACK_ROUTE_CONFIGS} />
    </ToastProvider>
  );
}

function HomeScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.BlueLight40 }}>
      <StackRouteInformation routeName="Home" />
      <StackNavigationButtons
        isPopEnabled={false}
        routeNames={['A', 'TabsHost']}
      />
    </CenteredLayoutView>
  );
}

function AScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.YellowLight40 }}>
      <StackRouteInformation routeName="A" />
      <StackNavigationButtons isPopEnabled routeNames={['A', 'TabsHost']} />
    </CenteredLayoutView>
  );
}

// Rendered as an outer route element, so the provider captures the OUTER stack
// context and hands it down through the tabs to the nested stack's screens.
function TabsHostScreen() {
  return (
    <OuterStackNavigationProvider>
      <TabsContainer routeConfigs={TAB_ROUTE_CONFIGS} />
    </OuterStackNavigationProvider>
  );
}

function Tab1Stack() {
  const toast = useToast();

  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'N1',
          element: <NestedScreen routeName="N1" />,
          options: {
            preventNativeDismiss: true,
            onNativeDismissPrevented: () => {
              console.info('Native dismiss prevented - N1');
              toast.push({
                message: 'Native dismiss prevented - N1',
                backgroundColor: Colors.GreenLight60,
              });
            },
            headerConfig: {
              title: 'N1',
            },
          },
        },
        {
          name: 'N2',
          element: <NestedScreen routeName="N2" />,
          options: {
            headerConfig: {
              title: 'N2',
            },
          },
        },
      ]}
    />
  );
}

function NestedScreen({ routeName }: { routeName: string }) {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.GreenLight100 }}>
      <StackRouteInformation routeName={routeName} />
      <PreventNativeDismissInfo />
      <StackNavigationButtons isPopEnabled routeNames={['N2']} />
      <TogglePreventNativeDismiss />
      <PushOuterStackRouteButton routeName="A" />
    </CenteredLayoutView>
  );
}

function Tab2Content() {
  return (
    <View style={styles.centered}>
      <Text style={styles.title}>Tab2 - nothing to pop here</Text>
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
      <Text
        style={styles.routeInformation}
        testID="prevent-native-dismiss-info">
        Prevent native dismiss:{' '}
        {navContext.routeOptions.preventNativeDismiss ? 'Enabled' : 'Disabled'}
      </Text>
    </View>
  );
}

const TAB_ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Tab1',
    element: <Tab1Stack />,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab1',
    },
  },
  {
    name: 'Tab2',
    element: <Tab2Content />,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab2',
    },
  },
];

const STACK_ROUTE_CONFIGS: StackRouteConfig[] = [
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
    name: 'TabsHost',
    element: <TabsHostScreen />,
    options: {
      headerConfig: {
        title: 'Tabs',
      },
    },
  },
];

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  title: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
  },
  routeInformation: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default createScenario(
  TestStackPreventNativeDismissTabsInStack,
  scenarioDescription,
);
