import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-screens/experimental';
import {
  type TabRouteConfig,
  TabsContainer,
} from '@apps/shared/gamma/containers/tabs';

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
    <View style={styles.container}>
      <Text>FormSheet Modal</Text>
      <TextInput
        style={styles.input}
        placeholder="Type something here..."
        value={text}
        onChangeText={setText}
      />
      <Button title="Close" onPress={() => navigation.goBack()} />
    </View>
  );
}

function MyStack() {
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
            sheetAllowedDetents: [0.3],
            sheetGrabberVisible: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function TabContentWrapper() {
  return (
    <SafeAreaView edges={{ bottom: true }} style={styles.wrapper}>
      <MyStack />
    </SafeAreaView>
  );
}

const TAB_CONFIGS: TabRouteConfig[] = [
  {
    name: 'HomeTab',
    Component: TabContentWrapper,
    options: {
      title: 'Tab',
    },
  },
];

export default function App() {
  return <TabsContainer routeConfigs={TAB_CONFIGS} />;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: '#f8f9fa',
  },
  input: {
    width: '80%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
});
