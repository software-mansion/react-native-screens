import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  I18nManager,
  Button,
  DevSettings,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function toggleRTL(forceRTL: boolean) {
  if (I18nManager.isRTL === forceRTL) return;
  I18nManager.forceRTL(forceRTL);
  I18nManager.allowRTL(forceRTL);
  DevSettings.reload();
}

function HeaderTitle() {
  return (
    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Custom Title</Text>
  );
}

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Issue #3438</Text>
      <Text>headerTitleAlign: center + headerTitle as function</Text>
      <Text>RTL mode: {I18nManager.isRTL ? 'YES' : 'NO'}</Text>
      <Text style={styles.note}>
        The header title above should say "Custom Title".
        {'\n'}If it's missing or there's extra space, the bug is present.
      </Text>
      <View style={styles.buttons}>
        <Button title="Force RTL" onPress={() => toggleRTL(true)} />
        <Button title="Force LTR" onPress={() => toggleRTL(false)} />
      </View>
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
            headerTitle: HeaderTitle,
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
  heading: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  note: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
});

export default App;
