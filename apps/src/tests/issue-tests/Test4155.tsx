import React from 'react';
import {
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { TabsBottomAccessoryEnvironment } from 'react-native-screens';
import {
  StackContainer,
  type StackRouteConfig,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import {
  TabsContainer,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';

export function AccessoryContent(environment: TabsBottomAccessoryEnvironment) {
  return (
    <View style={styles.accessory}>
      <Text>Bottom Accessory</Text>
      {environment === 'inline' && <Text>Inline</Text>}
    </View>
  );
}

export function HomeTab() {
  const { push } = useStackNavigationContext();
  return (
    <View style={styles.centered}>
      <Button title="Go to test" onPress={() => push('Test')} />
    </View>
  );
}

export function ExploreTab() {
  const { push } = useStackNavigationContext();
  return (
    <ScrollView
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic">
      {Array.from({ length: 150 }, (_, i) => (
        <Pressable
          key={i}
          onPress={() => push('Test')}
          style={[
            styles.scrollItem,
            { backgroundColor: i % 2 ? 'black' : 'white' },
          ]}
        />
      ))}
    </ScrollView>
  );
}

const TAB_ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Home',
    Component: HomeTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Home',
    },
  },
  {
    name: 'Explore',
    Component: ExploreTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Explore',
    },
  },
];

export function TabsScreen() {
  return (
    <TabsContainer
      routeConfigs={TAB_ROUTE_CONFIGS}
      ios={{
        bottomAccessory: AccessoryContent,
        tabBarMinimizeBehavior: 'onScrollDown',
      }}
    />
  );
}

export function TestScreen() {
  return <View />;
}

const STACK_ROUTE_CONFIGS: StackRouteConfig[] = [
  {
    name: 'Tabs',
    Component: TabsScreen,
    options: {},
  },
  {
    name: 'Test',
    Component: TestScreen,
    options: {
      headerConfig: {
        title: 'Test',
      },
    },
  },
];

export default function App() {
  return <StackContainer routeConfigs={STACK_ROUTE_CONFIGS} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accessory: {
    flex: 1,
    backgroundColor: 'rgba(255,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  scrollItem: {
    width: '100%',
    height: 50,
  },
});
