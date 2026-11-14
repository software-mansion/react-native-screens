import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '@apps/shared/styling';

// Each cycle signs out in a stack (an animated replace) and removes the whole
// stack a few ms later, before UIKit starts the transition. Then it mounts a
// new stack, pushes Details and, while Details animates in, pushes More.
// Expected: More appears in every cycle.

const CYCLES = 20;
const REMOVAL_DELAYS_MS = [0, 1, 2, 3, 4];
const NEXT_STACK_DELAY_MS = 100;
const PUSH_DURING_TRANSITION_MS = 100;
const APPEAR_TIMEOUT_MS = 3000;

type Phase = 'idle' | 'signOut' | 'removed' | 'check';

type SignOutParamList = {
  App: undefined;
  SignIn: undefined;
};

type CheckParamList = {
  Home: undefined;
  Details: undefined;
  More: undefined;
};

type ScreenName = keyof SignOutParamList | keyof CheckParamList;

type TransitionEndEvent = { data: { closing: boolean } };

const SignOutStack = createNativeStackNavigator<SignOutParamList>();
const CheckStack = createNativeStackNavigator<CheckParamList>();

export default function TestStackRecycle() {
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [awaitedScreen, setAwaitedScreen] = useState<ScreenName>();
  const [result, setResult] = useState('');
  const lastAppearedScreen = useRef<ScreenName | undefined>(undefined);
  const removalDelay = REMOVAL_DELAYS_MS[cycle % REMOVAL_DELAYS_MS.length];

  useEffect(() => {
    if (phase !== 'removed') {
      return;
    }
    const timeout = setTimeout(() => {
      setPhase('check');
      setAwaitedScreen('Home');
    }, NEXT_STACK_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [phase]);

  useEffect(() => {
    if (awaitedScreen === undefined) {
      return;
    }
    const timeout = setTimeout(() => {
      setResult(
        `Result: ${awaitedScreen} did not appear in cycle ${
          cycle + 1
        } (last screen that appeared: ${lastAppearedScreen.current ?? 'none'})`,
      );
      setAwaitedScreen(undefined);
    }, APPEAR_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [awaitedScreen, cycle]);

  const onRemove = useCallback(() => setPhase('removed'), []);

  const startCycle = (nextCycle: number) => {
    setCycle(nextCycle);
    setPhase('signOut');
    setAwaitedScreen('App');
  };

  const start = () => {
    lastAppearedScreen.current = undefined;
    setResult('');
    startCycle(0);
  };

  const onAppear = (screen: ScreenName) => {
    lastAppearedScreen.current = screen;
    if (screen !== awaitedScreen) {
      return;
    }
    if (screen === 'App') {
      setAwaitedScreen(undefined);
    } else if (screen === 'Home') {
      setAwaitedScreen('More');
    } else if (cycle + 1 < CYCLES) {
      startCycle(cycle + 1);
    } else {
      setAwaitedScreen(undefined);
      setPhase('idle');
      setResult(`Result: More appeared in all ${CYCLES} cycles`);
    }
  };

  const running = phase !== 'idle' && result === '';

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <Button
          title="Start"
          onPress={start}
          disabled={running}
          testID="stack-recycle-start"
        />
        <Text testID="stack-recycle-status">
          Cycle {cycle + 1} of {CYCLES}, removal delay {removalDelay} ms
        </Text>
        <Text testID="stack-recycle-result">{result}</Text>
      </View>
      <View style={styles.stack}>
        {phase === 'signOut' && (
          <SignOutThenRemove
            key={cycle}
            removalDelay={removalDelay}
            onAppear={onAppear}
            onRemove={onRemove}
          />
        )}
        {phase === 'check' && (
          <PushDuringTransition key={cycle} onAppear={onAppear} />
        )}
      </View>
    </View>
  );
}

function SignOutThenRemove({
  removalDelay,
  onAppear,
  onRemove,
}: {
  removalDelay: number;
  onAppear: (screen: ScreenName) => void;
  onRemove: () => void;
}) {
  const [signedIn, setSignedIn] = useState(true);

  return (
    <NavigationContainer>
      <SignOutStack.Navigator>
        {signedIn ? (
          <SignOutStack.Screen
            name="App"
            component={Placeholder}
            listeners={{
              transitionEnd: (event: TransitionEndEvent) => {
                if (!event.data.closing) {
                  onAppear('App');
                  setSignedIn(false);
                }
              },
            }}
          />
        ) : (
          <SignOutStack.Screen
            name="SignIn"
            listeners={{
              transitionEnd: (event: TransitionEndEvent) => {
                if (!event.data.closing) {
                  onAppear('SignIn');
                }
              },
            }}>
            {() => <SignIn removalDelay={removalDelay} onRemove={onRemove} />}
          </SignOutStack.Screen>
        )}
      </SignOutStack.Navigator>
    </NavigationContainer>
  );
}

function SignIn({
  removalDelay,
  onRemove,
}: {
  removalDelay: number;
  onRemove: () => void;
}) {
  useEffect(() => {
    const timeout = setTimeout(onRemove, removalDelay);
    return () => clearTimeout(timeout);
  }, [removalDelay, onRemove]);

  return <Placeholder />;
}

function PushDuringTransition({
  onAppear,
}: {
  onAppear: (screen: ScreenName) => void;
}) {
  const navigationRef = useNavigationContainerRef<CheckParamList>();
  const pushMoreTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => () => clearTimeout(pushMoreTimeout.current), []);

  const appearListener = (screen: keyof CheckParamList) => ({
    transitionEnd: (event: TransitionEndEvent) => {
      if (event.data.closing) {
        return;
      }
      onAppear(screen);
      if (screen === 'Home' && pushMoreTimeout.current === undefined) {
        navigationRef.navigate('Details');
        pushMoreTimeout.current = setTimeout(
          () => navigationRef.navigate('More'),
          PUSH_DURING_TRANSITION_MS,
        );
      }
    },
  });

  return (
    <NavigationContainer ref={navigationRef}>
      <CheckStack.Navigator>
        <CheckStack.Screen
          name="Home"
          component={Placeholder}
          listeners={appearListener('Home')}
        />
        <CheckStack.Screen
          name="Details"
          component={Placeholder}
          listeners={appearListener('Details')}
        />
        <CheckStack.Screen
          name="More"
          component={Placeholder}
          listeners={appearListener('More')}
        />
      </CheckStack.Navigator>
    </NavigationContainer>
  );
}

function Placeholder() {
  return <View style={styles.screen} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  controls: {
    padding: 16,
    paddingTop: 64,
    gap: 8,
  },
  stack: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.White,
  },
});
