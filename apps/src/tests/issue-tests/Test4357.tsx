import React, { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '@apps/shared/styling';

const Stack = createNativeStackNavigator();

const DummyContent = () => <View style={styles.contentContainer} />;

function Screen1() {
  return <DummyContent />;
}

function NavigationStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Screen1"
          component={Screen1}
          options={{ unstable_headerInsets: { top: false } }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [show, setShow] = useState(false);

  if (show) {
    return <NavigationStack />;
  }

  return (
    <View style={styles.centerLayout}>
      <Button title="Mount Navigation Stack" onPress={() => setShow(true)} />
    </View>
  );
}

const styles = StyleSheet.create({
  centerLayout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.NavyDark100,
  },
});
