import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {
  TabsContainer,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
  useTabsNavigationContext,
} from '@apps/shared/containers/tabs';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/4199
//
// Android: "FragmentManager is already executing transactions" thrown from
// TabsContainer while the activity resumes, pauses or stops.
//
// While the activity is paused, Fabric holds back the mount items, including a
// tab change made from JS (e.g. a deep link handled while a translucent
// notification trampoline is on top). When a tab fragment then runs a
// lifecycle callback, its appearance event goes through Reanimated, which
// mounts the pending transactions synchronously. The tab change reaches
// TabsContainer, which commits a fragment transaction while the fragment
// manager is still executing the lifecycle state change.
//
// The race is narrow, so this screen keeps a tab change in flight at all times
// (every SELECTION_INTERVAL_MS), keeps a Reanimated animation of a layout prop
// running, and toggles a CSS transition along the way.

const ROUTE_NAMES = ['First', 'Second', 'Third'] as const;

const SELECTION_INTERVAL_MS = 50;

const ChaosContext = React.createContext<{
  isChaosEnabled: boolean;
  toggleChaos: () => void;
}>({ isChaosEnabled: true, toggleChaos: () => {} });

function PulsingBar() {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 300, easing: Easing.linear }),
      -1,
      true,
    );
  }, [progress]);

  // Width is a layout prop: it goes through a shadow tree commit.
  const animatedStyle = useAnimatedStyle(() => ({
    width: 20 + progress.value * 120,
  }));

  return <Animated.View style={[styles.bar, animatedStyle]} />;
}

function ContentView() {
  const { routeKey, isSelected, selectTab } = useTabsNavigationContext();
  const { isChaosEnabled, toggleChaos } = React.useContext(ChaosContext);
  const [isWide, setIsWide] = React.useState(false);

  React.useEffect(() => {
    if (!isSelected || !isChaosEnabled) {
      return;
    }
    const timeout = setTimeout(() => {
      const index = ROUTE_NAMES.indexOf(
        routeKey as (typeof ROUTE_NAMES)[number],
      );
      selectTab(ROUTE_NAMES[(index + 1) % ROUTE_NAMES.length]);
      setIsWide(value => !value);
    }, SELECTION_INTERVAL_MS);
    return () => clearTimeout(timeout);
  }, [isSelected, isChaosEnabled, routeKey, selectTab]);

  return (
    <View style={styles.content}>
      <Text style={styles.title}>{routeKey}</Text>
      <PulsingBar />
      <Animated.View
        style={[
          styles.bar,
          {
            width: isWide ? 140 : 20,
            transitionProperty: 'width',
            transitionDuration: 300,
          },
        ]}
      />
      <Button
        testID="toggle-chaos-button"
        title={isChaosEnabled ? 'Stop switching tabs' : 'Start switching tabs'}
        onPress={toggleChaos}
      />
      <Text style={styles.step}>
        1. Keep the tabs switching (Android only).
      </Text>
      <Text style={styles.step}>
        2. Send the app to the background and bring it back, many times in a
        row, e.g. with adb: `input keyevent KEYCODE_HOME`, then `am start` of
        the launcher activity, in a loop.
      </Text>
      <Text style={styles.step}>
        3. Expected: no crash. Before the fix the app throws "FragmentManager is
        already executing transactions" within a few dozen round trips.
      </Text>
    </View>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = ROUTE_NAMES.map(name => ({
  name,
  element: <ContentView />,
  options: {
    ...DEFAULT_TAB_ROUTE_OPTIONS,
    title: name,
  },
}));

export default function Test4199() {
  const [isChaosEnabled, setIsChaosEnabled] = React.useState(true);
  const chaos = React.useMemo(
    () => ({
      isChaosEnabled,
      toggleChaos: () => setIsChaosEnabled(value => !value),
    }),
    [isChaosEnabled],
  );

  return (
    <ChaosContext.Provider value={chaos}>
      <TabsContainer routeConfigs={ROUTE_CONFIGS} />
    </ChaosContext.Provider>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  bar: {
    height: 12,
    borderRadius: 4,
    backgroundColor: 'darkslateblue',
  },
  step: {
    fontSize: 14,
  },
});
