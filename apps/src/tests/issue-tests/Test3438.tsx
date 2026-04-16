import React from 'react';
import { View, Text, StyleSheet, I18nManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Issue #3438</Text>
      <Text>headerTitleAlign: center + headerTitle as function</Text>
      <Text>RTL mode: {I18nManager.isRTL ? 'YES' : 'NO'}</Text>
      <Text style={styles.note}>
        The header title above should say "Custom Title".
        {'\n'}If it's missing or there's extra space, the bug is present.
      </Text>
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitleAlign: 'center',
            headerTitle: () => (
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                Custom Title
              </Text>
            ),
          }}
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
    padding: 20,
    gap: 8,
  },
  note: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
});

export default App;
