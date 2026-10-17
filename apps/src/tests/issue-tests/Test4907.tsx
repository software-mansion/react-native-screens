import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useHeaderHeight } from '@react-navigation/elements';

type Routes = { Home: undefined; Opaque: undefined; Transparent: undefined };
const Stack = createNativeStackNavigator<Routes>();

// Android + TalkBack: with `headerTransparent: true` the header (back button, title,
// headerRight) must still be read BEFORE the screen content, the same as with an opaque header.
function Home({ navigation }: NativeStackScreenProps<Routes, 'Home'>) {
  return (
    <View style={styles.content}>
      <Text>
        Turn TalkBack on. Open both screens below and swipe right (next) from
        the top of each. The header must be read first on both: back button,
        title, "Header action", then "First content button".
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

export default function App() {
  return (
    <NavigationContainer>
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
