import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import {
  createStackNavigator,
  type StackNavigationProp,
} from '@react-navigation/stack';

// Android: on the Collection tab, tap "Tap me" once to see the counter
// increase. Tap "Run loop": it navigates between ListA and ListB 6 times
// (`getId` makes the later navigations reorder the buried routes instead of
// pushing new ones), then pops to the top. Back on the Collection tab, tap
// "Tap me" and the About tab. Both should respond.
// To check a list screen during the reordering, tap "Go to ListA", then
// "Go to ListB" and "Go to ListA" again, and tap "Tap me" on ListA.

type ParamList = {
  Profile: undefined;
  ListA: { id: number };
  ListB: { id: number };
};

type NavigationProp = StackNavigationProp<ParamList>;

const Stack = createStackNavigator<ParamList>();
const Tabs = createBottomTabNavigator();

const LOOP: ('ListA' | 'ListB')[] = [
  'ListA',
  'ListB',
  'ListA',
  'ListB',
  'ListA',
  'ListB',
];

function TapCounter({ label }: { label: string }) {
  const [count, setCount] = useState(0);
  return (
    <Pressable
      testID={`${label}-tap-counter`}
      style={[styles.button, styles.counter]}
      onPress={() => setCount(value => value + 1)}>
      <Text style={styles.buttonText}>
        {label}: tap me (count: {count})
      </Text>
    </Pressable>
  );
}

function CollectionTab() {
  const navigation = useNavigation<NavigationProp>();

  const runLoop = () => {
    let step = 0;
    const next = () => {
      if (step >= LOOP.length) {
        navigation.dispatch(StackActions.popToTop());
        return;
      }
      navigation.navigate(LOOP[step], { id: 1 });
      step += 1;
      setTimeout(next, 300);
    };
    next();
  };

  return (
    <View style={[styles.container, styles.collection]}>
      <TapCounter label="Collection" />
      <Pressable
        testID="run-loop"
        style={[styles.button, styles.run]}
        onPress={runLoop}>
        <Text style={styles.buttonText}>Run loop</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('ListA', { id: 1 })}>
        <Text style={styles.buttonText}>Go to ListA</Text>
      </Pressable>
    </View>
  );
}

function AboutTab() {
  return (
    <View style={[styles.container, styles.about]}>
      <TapCounter label="About" />
    </View>
  );
}

function ProfileScreen() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="Collection" component={CollectionTab} />
      <Tabs.Screen name="About" component={AboutTab} />
    </Tabs.Navigator>
  );
}

function ListScreen({
  name,
  other,
}: {
  name: 'ListA' | 'ListB';
  other: 'ListA' | 'ListB';
}) {
  const navigation = useNavigation<NavigationProp>();
  return (
    <View style={[styles.container, styles.list]}>
      <TapCounter label={name} />
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate(other, { id: 1 })}>
        <Text style={styles.buttonText}>Go to {other}</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => navigation.dispatch(StackActions.popToTop())}>
        <Text style={styles.buttonText}>Pop to top</Text>
      </Pressable>
    </View>
  );
}

function ListAScreen() {
  return <ListScreen name="ListA" other="ListB" />;
}

function ListBScreen() {
  return <ListScreen name="ListB" other="ListA" />;
}

export default function Test4382() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen
          name="ListA"
          component={ListAScreen}
          getId={({ params }) => `listA-${params.id}`}
          initialParams={{ id: 1 }}
        />
        <Stack.Screen
          name="ListB"
          component={ListBScreen}
          getId={({ params }) => `listB-${params.id}`}
          initialParams={{ id: 1 }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  collection: {
    backgroundColor: '#eef6ff',
  },
  about: {
    backgroundColor: '#f0fff2',
  },
  list: {
    backgroundColor: '#fff3ec',
  },
  button: {
    minWidth: 260,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#4c8bf5',
  },
  counter: {
    backgroundColor: '#2fbf71',
  },
  run: {
    backgroundColor: '#e2574c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
