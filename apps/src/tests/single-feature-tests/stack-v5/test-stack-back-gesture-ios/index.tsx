import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StackScreenPropsIOS } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { SettingsSwitch } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';

type GestureOption = keyof StackScreenPropsIOS;

function TestStackBackGestureIOS() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Home',
          element: (
            <NamedScreen
              name="Home"
              color={Colors.YellowLight100}
              routeNames={['Blue', 'Hidden', 'Nested']}
            />
          ),
          options: { headerConfig: { title: 'Home' } },
        },
        {
          name: 'Blue',
          element: (
            <NamedScreen
              name="Blue"
              color={Colors.BlueLight100}
              switches={['backGestureEnabled', 'fullScreenBackGestureEnabled']}
            />
          ),
          options: { headerConfig: { title: 'Blue' } },
        },
        {
          name: 'Hidden',
          element: (
            <NamedScreen
              name="Hidden"
              color={Colors.RedLight100}
              switches={['backGestureEnabled']}
              isPopEnabled
            />
          ),
          options: { headerConfig: { title: 'Hidden', hidden: true } },
        },
        {
          name: 'Nested',
          element: <NestedScreen />,
          options: { headerConfig: { title: 'Nested', hidden: true } },
        },
      ]}
    />
  );
}

function NestedScreen() {
  return (
    <View style={styles.nested}>
      {/* Outside the inner stack: the strip stays while the inner stack pops
          and leaves with the outer screen. */}
      <View style={styles.nestedStrip}>
        <Text style={styles.nestedLabel}>Nested</Text>
      </View>
      <StackContainer
        routeConfigs={[
          {
            name: 'Inner Home',
            element: (
              <NamedScreen
                name="Inner Home"
                color={Colors.GreenLight100}
                routeNames={['Inner Blue']}
              />
            ),
            options: { headerConfig: { title: 'Inner Home', hidden: true } },
          },
          {
            name: 'Inner Blue',
            element: (
              <NamedScreen
                name="Inner Blue"
                color={Colors.BlueLight100}
                switches={['backGestureEnabled']}
              />
            ),
            options: { headerConfig: { title: 'Inner Blue', hidden: true } },
          },
        ]}
      />
    </View>
  );
}

function NamedScreen({
  name,
  color,
  routeNames = [],
  switches = [],
  isPopEnabled = false,
}: {
  name: string;
  color: string;
  routeNames?: string[];
  switches?: GestureOption[];
  isPopEnabled?: boolean;
}) {
  // Controls at the bottom keep a swipe from the middle of the screen on the
  // background; a horizontal drag across a switch would toggle it instead.
  return (
    <View style={[styles.screen, { backgroundColor: color }]}>
      <View style={styles.center}>
        <Text style={styles.name}>{name}</Text>
      </View>
      <View style={styles.controls}>
        <GestureSwitches options={switches} />
        <StackNavigationButtons
          routeNames={routeNames}
          isPopEnabled={isPopEnabled}
        />
      </View>
    </View>
  );
}

function GestureSwitches({ options }: { options: GestureOption[] }) {
  const { routeKey, routeOptions, setRouteOptions } =
    useStackNavigationContext();

  return (
    <View style={styles.switches}>
      {options.map(option => (
        <SettingsSwitch
          key={option}
          label={option}
          value={routeOptions.ios?.[option] ?? true}
          onValueChange={value =>
            setRouteOptions(routeKey, {
              ios: { ...routeOptions.ios, [option]: value },
            })
          }
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  controls: {
    alignItems: 'center',
    paddingBottom: 48,
  },
  switches: {
    alignSelf: 'stretch',
    marginBottom: 8,
  },
  nested: {
    flex: 1,
  },
  nestedStrip: {
    paddingTop: initialWindowMetrics?.insets.top ?? 0,
    paddingBottom: 12,
    alignItems: 'center',
    backgroundColor: Colors.PurpleLight60,
  },
  nestedLabel: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default createScenario(TestStackBackGestureIOS, scenarioDescription);
