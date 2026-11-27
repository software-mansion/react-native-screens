import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-screens/experimental';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { StackContainer } from '@apps/shared/containers/stack';
import { Colors } from '@apps/shared/styling';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';

const ROWS = Array.from({ length: 20 }, (_, index) => `row ${index}`);

function TestStackPressableUnderBackSwipeIOS() {
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
      ]}
    />
  );
}

function HomeScreen() {
  return (
    <View style={[styles.screen, styles.home]}>
      <StackNavigationButtons routeNames={['Blue']} isPopEnabled={false} />
    </View>
  );
}

function BlueScreen() {
  const [presses, setPresses] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [rowPresses, setRowPresses] = useState(0);

  // The button and the rows span the full width, so a touch on the left screen
  // edge lands on them.
  return (
    <View style={[styles.screen, styles.blue]}>
      <SafeAreaView edges={{ top: true }} style={styles.screen}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          onPress={() => setPresses(count => count + 1)}>
          <Text style={styles.label}>Press me</Text>
        </Pressable>
        <Text style={styles.readout}>{`Presses: ${presses}`}</Text>
        <Text style={styles.readout}>{`Pressed: ${
          isPressed ? 'yes' : 'no'
        }`}</Text>
        <Text style={styles.readout}>{`Row presses: ${rowPresses}`}</Text>
        <FlatList
          style={styles.list}
          data={ROWS}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
              onPress={() => setRowPresses(count => count + 1)}>
              <Text>{item}</Text>
            </Pressable>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  home: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.YellowLight100,
  },
  blue: {
    backgroundColor: Colors.BlueLight40,
  },
  button: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BlueLight100,
  },
  pressed: {
    backgroundColor: Colors.NavyLight40,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  readout: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  list: {
    flex: 1,
  },
  row: {
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default createScenario(
  TestStackPressableUnderBackSwipeIOS,
  scenarioDescription,
);
