import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  NavigationContainer,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

// https://github.com/software-mansion/react-native-screens/issues/4168 (iOS)
//
// Press "Start" and leave it running. Without the fix a Release build on a device crashes
// within seconds with "Collection <__NSArrayM> was mutated while being enumerated" in
// -[RNSScreenContainerView updateContainer].
//
// The JS stack drives `activityState` with a native-driver Animated value, so
// `updateContainer` runs synchronously on the UI thread. Attaching a screen triggers a UIKit
// layout pass; a tab screen hosted in an RNSNavigationController then calls `updateBounds`,
// whose immediate shadow-state update mounts a pending commit inline. When that commit adds
// or removes a screen of the same container, `_reactSubviews` changes mid-loop. It only throws
// when the attached screen is not the last one: here, the screen below a transparent modal
// dismissed while the next screen is pushed. Ported from https://github.com/bananer/rns-4168-repro.

type RootParamList = {
  Tabs: undefined;
  Detail: { depth: number };
  Notice: undefined;
};

const RootStack = createStackNavigator<RootParamList>();
const Tab = createBottomTabNavigator();

const PUSH_EVERY_MS = 280;
const MAX_DEPTH = 8;
const CYCLE_PAUSE_MS = 800;
const NOTICE_DEPTH = 3;
const NOTICE_DELAY_MS = 140;
const NOTICE_MS = 300;
const HEAVY = 500;

let running = false;

function HeavyBody() {
  return (
    <View>
      {Array.from({ length: HEAVY }, (_, i) => (
        <View
          key={i}
          style={{ height: 1, backgroundColor: i % 2 ? '#eeeeee' : '#dddddd' }}
        />
      ))}
    </View>
  );
}

function HomeScreen() {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const focused = useIsFocused();
  const [cycles, setCycles] = useState(0);
  const [isRunning, setIsRunning] = useState(running);

  useEffect(() => {
    if (!isRunning || !focused) {
      return;
    }
    const timer = setTimeout(() => {
      setCycles(c => c + 1);
      navigation.push('Detail', { depth: 1 });
    }, CYCLE_PAUSE_MS);
    return () => clearTimeout(timer);
  }, [isRunning, focused, navigation]);

  return (
    <View style={styles.center}>
      <Text>Cycles started: {cycles}</Text>
      <Button
        title={isRunning ? 'Stop' : 'Start'}
        onPress={() => {
          running = !isRunning;
          setIsRunning(running);
        }}
      />
    </View>
  );
}

function DetailScreen({
  route,
  navigation,
}: {
  route: { params: { depth: number } };
  navigation: StackNavigationProp<RootParamList, 'Detail'>;
}) {
  const { depth } = route.params;
  const focused = useIsFocused();
  const [noticeShown, setNoticeShown] = useState(false);

  useEffect(() => {
    if (!running || !focused) {
      return;
    }
    const pushTimer = setTimeout(() => {
      if (depth < MAX_DEPTH) {
        navigation.push('Detail', { depth: depth + 1 });
      } else {
        navigation.popToTop();
      }
    }, PUSH_EVERY_MS);
    let noticeTimer: ReturnType<typeof setTimeout> | undefined;
    if (depth === NOTICE_DEPTH && !noticeShown) {
      noticeTimer = setTimeout(() => {
        setNoticeShown(true);
        navigation.push('Notice');
      }, NOTICE_DELAY_MS);
    }
    return () => {
      clearTimeout(pushTimer);
      if (noticeTimer) {
        clearTimeout(noticeTimer);
      }
    };
  }, [depth, focused, navigation, noticeShown]);

  return (
    <View style={styles.screen}>
      <Text style={styles.depth}>depth {depth}</Text>
      <HeavyBody />
    </View>
  );
}

function NoticeScreen({
  navigation,
}: {
  navigation: StackNavigationProp<RootParamList, 'Notice'>;
}) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.goBack(), NOTICE_MS);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.noticeBackdrop}>
      <View style={styles.notice}>
        <Text>Notice</Text>
      </View>
    </View>
  );
}

function TabsScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Tabs"
          component={TabsScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen name="Detail" component={DetailScreen} />
        <RootStack.Screen
          name="Notice"
          component={NoticeScreen}
          options={{ presentation: 'transparentModal', headerShown: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  screen: {
    flex: 1,
  },
  depth: {
    padding: 12,
    fontSize: 16,
  },
  noticeBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  notice: {
    padding: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
});
