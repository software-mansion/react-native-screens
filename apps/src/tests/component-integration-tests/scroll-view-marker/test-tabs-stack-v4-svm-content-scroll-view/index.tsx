import React from 'react';
import { Button, ScrollView, StyleSheet, View } from 'react-native';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { ScrollViewMarker } from 'react-native-screens';
import {
  DEFAULT_TAB_ROUTE_OPTIONS,
  type TabRouteConfig,
  TabsContainer,
} from '@apps/shared/containers/tabs';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Rectangle } from '@apps/shared/Rectangle';
import { Colors } from '@apps/shared/styling';
import { generateNextColor } from '@apps/shared/utils/color-generator';

type StackParamList = {
  Home: undefined;
  Pushed: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

const RECT_COLORS = Array.from({ length: 24 }, () => generateNextColor());

function MarkedList(props: { header?: React.ReactNode }) {
  return (
    <View style={styles.fillParent}>
      {/* Takes the first-subview chain, so UIKit cannot find the ScrollView on its own. */}
      <View style={[StyleSheet.absoluteFill, styles.background]} />
      <ScrollViewMarker
        style={styles.fillParent}
        scrollEdgeEffects={{ top: 'soft' }}>
        <ScrollView testID="svm-tabs-stack-v4-list" style={styles.fillParent}>
          {props.header}
          {RECT_COLORS.map((color, index) => (
            <Rectangle key={index} color={color} width={'100%'} height={96} />
          ))}
        </ScrollView>
      </ScrollViewMarker>
    </View>
  );
}

function HomeScreen({
  navigation,
}: NativeStackScreenProps<StackParamList, 'Home'>) {
  return (
    <MarkedList
      header={
        <View style={styles.header}>
          <Button
            title="Push screen"
            testID="svm-tabs-stack-v4-push"
            onPress={() => navigation.navigate('Pushed')}
          />
        </View>
      }
    />
  );
}

function PushedScreen() {
  return <MarkedList />;
}

function StackTab() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerLargeTitleEnabled: true }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Pushed" component={PushedScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

function OtherTab() {
  return <View style={[styles.fillParent, styles.background]} />;
}

const TAB_ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Stack',
    element: <StackTab />,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Stack',
      tabBarItemTestID: 'stack-tab-item',
      tabBarItemAccessibilityLabel: 'stack-tab-item-label',
    },
  },
  {
    name: 'Other',
    element: <OtherTab />,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Other',
      tabBarItemTestID: 'other-tab-item',
      tabBarItemAccessibilityLabel: 'other-tab-item-label',
    },
  },
];

function TestTabsStackV4SvmContentScrollView() {
  return (
    <TabsContainer
      routeConfigs={TAB_ROUTE_CONFIGS}
      ios={{ tabBarMinimizeBehavior: 'onScrollDown' }}
    />
  );
}

const styles = StyleSheet.create({
  fillParent: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  background: {
    backgroundColor: Colors.White,
  },
  header: {
    padding: 16,
  },
});

export default createScenario(
  TestTabsStackV4SvmContentScrollView,
  scenarioDescription,
);
