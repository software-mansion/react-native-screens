import React, { useLayoutEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';

// Repro for https://github.com/software-mansion/react-native-screens/issues/4132
//
// Adapted from the maintainer's snippet in the issue thread. Differences:
//   * `Alert.alert` replaced with `console.log`, so taps driven by raw
//     `adb shell input tap` can be read back from logcat without a dialog
//     blocking the next probe,
//   * the single bottom-anchored `Pressable` is replaced with a ladder of 12
//     stacked 30dp-tall `Pressable`s, so a tap sweep maps where the dead band
//     starts instead of only proving that "somewhere down there is dead",
//   * the ladder occupies the left half only and the `ScrollView` runs to the
//     bottom of the screen, so both reported paths - a static bottom-anchored
//     `Pressable` and a row scrolled into the strip - can be exercised on one
//     screen without either occluding the other,
//   * a third route mounts the tab host with the bar already hidden, covering
//     the initial-mount case next to the runtime-toggle one.

const PROBE_COUNT = 12;
const PROBE_HEIGHT = 30;
const PROBE_STACK_HEIGHT = PROBE_COUNT * PROBE_HEIGHT;

const RootStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const Tab = createNativeBottomTabNavigator();

function log(message: string) {
  console.log(`[RNS4132] ${message}`);
}

type ScreenProps = {
  navigation: NativeStackNavigationProp<Record<string, undefined>>;
};

type DeadZoneReproProps = ScreenProps & {
  label: string;
  badgeColor: string;
};

function DeadZoneRepro({ label, badgeColor, navigation }: DeadZoneReproProps) {
  return (
    <View style={styles.reproContainer}>
      <Text
        style={[styles.badge, { backgroundColor: badgeColor }]}
        testID="repro-badge">
        {label}
      </Text>

      <Pressable
        onPress={() => log('TOP tapped')}
        style={[styles.btn, styles.topBtn]}
        testID="top-pressable">
        <Text style={styles.btnText}>TOP Pressable</Text>
      </Pressable>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        testID="repro-scrollview">
        {Array.from({ length: 20 }).map((_, i) => (
          <Pressable
            key={i}
            onPress={() => log(`Row ${i} tapped`)}
            style={styles.rowBtn}
            testID={`repro-row-${i}`}>
            <Text style={styles.btnText}>Scrollable Row {i}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.probeStack} testID="probe-stack">
        {Array.from({ length: PROBE_COUNT }).map((_, i) => (
          <Pressable
            key={i}
            onPress={() => log(`PROBE ${i} tapped`)}
            style={[
              styles.probeRow,
              { backgroundColor: i % 2 === 0 ? '#c62828' : '#ad1457' },
            ]}
            testID={`probe-${i}`}>
            <Text style={styles.probeText}>probe {i}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
        testID="repro-back">
        <Text style={styles.backBtnText}>← Go Back</Text>
      </Pressable>
    </View>
  );
}

function ControlScreen({ navigation }: ScreenProps) {
  return (
    <DeadZoneRepro
      label="CONTROL (root route, outside tabs)"
      badgeColor="green"
      navigation={navigation}
    />
  );
}

function DetailScreen({ navigation }: ScreenProps) {
  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarHidden: true,
      tabBarStyle: { display: 'none' },
    });
    return () => {
      navigation.getParent()?.setOptions({
        tabBarHidden: false,
        tabBarStyle: { display: 'flex' },
      });
    };
  }, [navigation]);

  return (
    <DeadZoneRepro
      label="DETAIL (inside tabs, tab bar hidden=true)"
      badgeColor="orange"
      navigation={navigation}
    />
  );
}

function HomeIndexScreen({ navigation }: ScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home tab (NativeTabs visible)</Text>

      <Pressable
        style={styles.link}
        onPress={() => navigation.navigate('Detail')}
        testID="open-detail">
        <Text style={styles.linkText}>Open /detail (pushes inside tabs)</Text>
        <Text style={styles.linkSubText}>Bug reproduces here</Text>
      </Pressable>

      <Pressable
        style={styles.link}
        onPress={() => navigation.getParent()?.navigate('Control')}
        testID="open-control">
        <Text style={styles.linkText}>Open /control (pushes outside tabs)</Text>
        <Text style={styles.linkSubText}>Works perfectly here</Text>
      </Pressable>

      <Pressable
        style={styles.link}
        onPress={() => navigation.getParent()?.navigate('StaticHidden')}
        testID="open-static-hidden">
        <Text style={styles.linkText}>Open /static-hidden</Text>
        <Text style={styles.linkSubText}>
          Tab host mounted with the bar already hidden
        </Text>
      </Pressable>
    </View>
  );
}

/**
 * Initial-mount variant: this tab host is mounted with the bar already hidden,
 * rather than hiding it from a `useLayoutEffect` after the screen mounts.
 */
function StaticHiddenScreen() {
  return (
    <Tab.Navigator screenOptions={{ tabBarStyle: { display: 'none' } }}>
      <Tab.Screen
        name="StaticHiddenTab"
        component={StaticHiddenTabContent}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="StaticHiddenOtherTab"
        component={OtherTabScreen}
        options={{ title: 'Other' }}
      />
    </Tab.Navigator>
  );
}

function StaticHiddenTabContent({ navigation }: ScreenProps) {
  return (
    <DeadZoneRepro
      label="STATIC (tab host mounted with the bar already hidden)"
      badgeColor="purple"
      navigation={navigation}
    />
  );
}

/**
 * Control for the opposite direction: same content, but reached with the tab bar
 * still visible. Everything the bar covers must stay untappable, and the bar
 * itself must keep taking its own touches.
 */
function OtherTabScreen({ navigation }: ScreenProps) {
  return (
    <DeadZoneRepro
      label="OTHER TAB (tab bar visible)"
      badgeColor="#00695c"
      navigation={navigation}
    />
  );
}

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeIndex" component={HomeIndexScreen} />
      <HomeStack.Screen name="Detail" component={DetailScreen} />
    </HomeStack.Navigator>
  );
}

function TabsNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="OtherTab"
        component={OtherTabScreen}
        options={{ title: 'Other' }}
      />
    </Tab.Navigator>
  );
}

export default function Test4132() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Tabs" component={TabsNavigator} />
        <RootStack.Screen name="Control" component={ControlScreen} />
        <RootStack.Screen name="StaticHidden" component={StaticHiddenScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  link: {
    padding: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginVertical: 8,
  },
  linkText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  linkSubText: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 },

  reproContainer: { flex: 1, paddingTop: 80, backgroundColor: '#fff' },
  badge: {
    padding: 8,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 4,
    overflow: 'hidden',
  },

  btn: {
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  btnText: { color: 'white', fontWeight: 'bold' },
  topBtn: { backgroundColor: '#333', marginBottom: 16 },

  scroll: {
    flex: 1,
    backgroundColor: '#fafafa',
    marginHorizontal: 16,
    borderRadius: 8,
  },
  scrollContent: { padding: 16, paddingBottom: 40 },
  rowBtn: {
    padding: 16,
    backgroundColor: '#888',
    marginVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
  },

  probeStack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '50%',
    height: PROBE_STACK_HEIGHT,
  },
  probeRow: {
    height: PROBE_HEIGHT,
    justifyContent: 'center',
    paddingLeft: 12,
  },
  probeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },

  backBtn: {
    position: 'absolute',
    top: 40,
    left: 16,
    padding: 8,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  backBtnText: { fontWeight: 'bold' },
});
