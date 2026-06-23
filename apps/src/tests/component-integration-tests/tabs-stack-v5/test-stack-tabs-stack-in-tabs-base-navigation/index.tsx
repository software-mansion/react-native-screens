import React from 'react';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';
import {
  DEFAULT_TAB_ROUTE_OPTIONS,
  type TabRouteConfig,
  TabsContainer,
} from '@apps/shared/gamma/containers/tabs';
import {
  StackContainer,
  type StackRouteConfig,
} from '@apps/shared/gamma/containers/stack';
import { StyleSheet } from 'react-native';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { StackRouteInformation } from '@apps/tests/shared/components/stack-v5/StackRouteInformation';
import { TabsRouteInformation } from '@apps/tests/shared/components/tabs/TabsRouteInformation';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';

const TABS_ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'First',
    Component: FirstTabScreen,
    options: {
      title: 'First',
      ...DEFAULT_TAB_ROUTE_OPTIONS,
    },
  },
  {
    name: 'Second',
    Component: SecondTabScreen,
    options: {
      title: 'Second',
      ...DEFAULT_TAB_ROUTE_OPTIONS,
    },
  },
  {
    name: 'Stack',
    Component: StackTabScreen,
    options: {
      title: 'Stack',
      ...DEFAULT_TAB_ROUTE_OPTIONS,
    },
  },
];

const STACK_ROUTE_CONFIGS: StackRouteConfig[] = [
  {
    name: 'First',
    Component: FirstStackScreen,
    options: {},
  },
  {
    name: 'Second',
    Component: SecondStackScreen,
    options: {},
  },
  {
    name: 'Third',
    Component: ThirdStackScreen,
    options: {},
  },
];

export function TestStackTabsStackInTabsBaseNavigation() {
  return <App />;
}

function App() {
  return <TabsNavigation />;
}

function TabsNavigation() {
  return <TabsContainer routeConfigs={TABS_ROUTE_CONFIGS} />;
}

function StackNavigation() {
  return <StackContainer routeConfigs={STACK_ROUTE_CONFIGS} />;
}

function FirstTabScreen() {
  return <GenericTabsScreenContents />;
}

function SecondTabScreen() {
  return <GenericTabsScreenContents />;
}

function StackTabScreen() {
  return <StackNavigation />;
}

function FirstStackScreen() {
  return <GenericStackScreenContents />;
}

function SecondStackScreen() {
  return <GenericStackScreenContents />;
}

function ThirdStackScreen() {
  return <GenericStackScreenContents />;
}

function GenericTabsScreenContents() {
  return (
    <CenteredLayoutView style={[styles.flexContainer]}>
      <TabsRouteInformation />
    </CenteredLayoutView>
  );
}

function GenericStackScreenContents() {
  const routeNames = React.useMemo(() => {
    return STACK_ROUTE_CONFIGS.map(value => value.name);
  }, []);

  return (
    <CenteredLayoutView style={[styles.flexContainer]}>
      <StackRouteInformation />
      <StackNavigationButtons routeNames={routeNames} isPopEnabled />
    </CenteredLayoutView>
  );
}

export default createScenario(
  TestStackTabsStackInTabsBaseNavigation,
  scenarioDescription,
);

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  fillParent: {
    width: '100%',
    height: '100%',
  },
});
