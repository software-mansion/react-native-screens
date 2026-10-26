import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useHeaderHeight } from '@react-navigation/elements';

type Routes = { Home: undefined; Opaque: undefined; Transparent: undefined };
const Stack = createNativeStackNavigator<Routes>();
const Tab = createBottomTabNavigator();

// Android + TalkBack: with `headerTransparent: true` the header (back button, title,
// headerRight) must still be read BEFORE the screen content, the same as with an opaque header.
function Home({ navigation }: NativeStackScreenProps<Routes, 'Home'>) {
  return (
    <View style={styles.content}>
      <Text>
        Turn TalkBack on. Open both screens below and swipe right (next) through
        the header and all content rows. On both, the last content row must be
        followed by the tab bar. With the bug, the transparent screen reads
        title and "Header action" again before the tab bar.
      </Text>
      <Button
        testID="push-opaque"
        title="Opaque header (reference)"
        onPress={() => navigation.push('Opaque')}
      />
      <Button
        testID="push-transparent"
        title="Transparent header"
        onPress={() => navigation.push('Transparent')}
      />
    </View>
  );
}

function Content() {
  return (
    <>
      <Button
        testID="first-content-button"
        title="First content button"
        onPress={() => {}}
      />
      {Array.from({ length: 30 }, (_, i) => (
        <Text key={i} style={styles.row}>
          Content row {i + 1}
        </Text>
      ))}
    </>
  );
}

function Opaque() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Content />
    </ScrollView>
  );
}

function Transparent() {
  const headerHeight = useHeaderHeight();
  return (
    <ScrollView
      contentContainerStyle={[styles.content, { paddingTop: headerHeight }]}>
      <Content />
    </ScrollView>
  );
}

function HeaderAction() {
  return (
    <Button testID="header-action" title="Header action" onPress={() => {}} />
  );
}

function StackTab() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="Opaque"
        component={Opaque}
        options={{ headerRight: HeaderAction }}
      />
      <Stack.Screen
        name="Transparent"
        component={Transparent}
        options={{ headerTransparent: true, headerRight: HeaderAction }}
      />
    </Stack.Navigator>
  );
}

function OtherTab() {
  return (
    <View style={styles.content}>
      <Text>Other tab</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Stack" component={StackTab} />
        <Tab.Screen name="Other" component={OtherTab} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 12,
  },
  row: {
    paddingVertical: 8,
  },
});
