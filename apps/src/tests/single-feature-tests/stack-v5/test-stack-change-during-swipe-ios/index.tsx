import React, { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { Colors } from '@apps/shared/styling';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';

// Leaves time to start the swipe after the tap; UIKit ignores taps while the swipe runs.
const DELAY_SECONDS = 3;
// Separate timeouts, so each push reaches the stack in its own commit.
const ACTION_SPACING_MS = 200;

function TestStackChangeDuringSwipeIOS() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Home',
          element: <HomeScreen />,
          options: { headerConfig: { title: 'Home' } },
        },
        {
          name: 'Blue',
          element: <BlueScreen />,
          options: { headerConfig: { title: 'Blue' } },
        },
        {
          name: 'Red',
          element: <NamedScreen name="Red" color={Colors.RedLight100} />,
          options: { headerConfig: { title: 'Red' } },
        },
        {
          name: 'Green',
          element: <NamedScreen name="Green" color={Colors.GreenLight100} />,
          options: { headerConfig: { title: 'Green' } },
        },
      ]}
    />
  );
}

function HomeScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.YellowLight100 }}>
      <Text style={styles.name}>Home</Text>
      <StackNavigationButtons routeNames={['Blue']} isPopEnabled={false} />
    </CenteredLayoutView>
  );
}

function BlueScreen() {
  const navigation = useStackNavigationContext();
  const { timer, start } = useDelayedActions();

  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.BlueLight100 }}>
      <Text style={styles.name}>Blue</Text>
      <Button
        title="Push Red in 3 s"
        onPress={() => start([() => navigation.push('Red')])}
      />
      <Button
        title="Pop in 3 s"
        onPress={() => start([() => navigation.pop(navigation.routeKey)])}
      />
      <Button
        title="Push Red and Green in 3 s"
        onPress={() =>
          start([() => navigation.push('Red'), () => navigation.push('Green')])
        }
      />
      <Text style={styles.timer}>{`Timer\n${timer}`}</Text>
    </CenteredLayoutView>
  );
}

function NamedScreen(props: { name: string; color: string }) {
  return (
    <CenteredLayoutView style={{ backgroundColor: props.color }}>
      <Text style={styles.name}>{props.name}</Text>
    </CenteredLayoutView>
  );
}

function useDelayedActions() {
  const [timer, setTimer] = useState('off');
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(
    () => () => {
      timeouts.current.forEach(clearTimeout);
    },
    [],
  );

  const schedule = (ms: number, fn: () => void) => {
    timeouts.current.push(setTimeout(fn, ms));
  };

  const start = (actions: (() => void)[]) => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setTimer(String(DELAY_SECONDS));
    for (let second = 1; second < DELAY_SECONDS; second++) {
      schedule(second * 1000, () => setTimer(String(DELAY_SECONDS - second)));
    }
    actions.forEach((action, index) => {
      schedule(DELAY_SECONDS * 1000 + index * ACTION_SPACING_MS, () => {
        action();
        if (index === actions.length - 1) {
          setTimer('done');
        }
      });
    });
  };

  return { timer, start };
}

const styles = StyleSheet.create({
  name: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  // Left-aligned on two lines, so it stays readable while a swipe holds the
  // screen three quarters of the width to the right.
  timer: {
    alignSelf: 'flex-start',
    marginTop: 24,
    marginLeft: 16,
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default createScenario(
  TestStackChangeDuringSwipeIOS,
  scenarioDescription,
);
