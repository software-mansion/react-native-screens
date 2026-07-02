import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-screens/experimental';
import { Colors } from '@apps/shared/styling';

const Stack = createNativeStackNavigator();

function MainScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text>Main Screen inside Stack</Text>
      <Button
        title="Open FormSheet Modal"
        onPress={() => navigation.navigate('MyFormSheet')}
      />
    </View>
  );
}

function FormSheetScreen({ navigation }: any) {
  const [text, setText] = useState('');

  return (
    <SafeAreaView edges={{ bottom: true }}>
      <View style={[styles.container, { backgroundColor: Colors.NavyDark40 }]}>
        <Text>FormSheet Modal</Text>
        <TextInput
          style={styles.input}
          placeholder="Type something here..."
          value={text}
          onChangeText={setText}
        />
        <Button title="Close" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="MyFormSheet"
          component={FormSheetScreen}
          options={{
            presentation: 'formSheet',
            headerShown: false,
            sheetAllowedDetents: 'fitToContents',
            contentStyle: {
              backgroundColor: Colors.RedDark100,
            },
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
    gap: 16,
    paddingTop: 24,
    paddingHorizontal: 24,
    backgroundColor: Colors.White,
  },
  input: {
    width: '80%',
    height: 45,
    borderColor: Colors.offBackground,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.White,
  },
});
