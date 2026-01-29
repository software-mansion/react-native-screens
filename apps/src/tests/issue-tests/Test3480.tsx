import React, { useState } from 'react';
import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { Button, TextInput, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function Home() {
  const navigation = useNavigation<NavigationProp<{ FormSheet: undefined }>>();
  const [text, setText] = useState('Edit me');

  return (
    <View>
      <Button
        title="Open Form Sheet"
        onPress={() => navigation.navigate('FormSheet')}
      />
      <View style={{ alignItems: 'center' }}>
        <TextInput
          style={{
            marginVertical: 12,
            paddingVertical: 8,
            backgroundColor: 'lavender',
            borderRadius: 24,
            width: '80%',
          }}
          value={text}
          onChangeText={t => setText(t)}
        />
      </View>
    </View>
  );
}

function FormSheet() {
  const navigation = useNavigation<NavigationProp<{ FormSheet2: undefined }>>();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Go Back" onPress={navigation.goBack} />
      <Button
        title="Next Modal"
        onPress={() => navigation.navigate('FormSheet2')}
      />
    </View>
  );
}

function FormSheet2() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Go Back" onPress={navigation.goBack} />
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="FormSheet"
          component={FormSheet}
          options={{
            presentation: 'formSheet',
            headerShown: false,
            sheetAllowedDetents: [0.5],
          }}
        />
        <Stack.Screen
          name="FormSheet2"
          component={FormSheet2}
          options={{
            presentation: 'formSheet',
            headerShown: false,
            sheetAllowedDetents: [0.3],
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
