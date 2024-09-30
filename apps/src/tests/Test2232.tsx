import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { Button, Square } from '../shared';
import { NavigationContainer } from '@react-navigation/native';

const MainScreen = ({ navigation }: any) => (
  <ScrollView style={{ marginTop: 100 }}>
    <Button
      onPress={() => navigation.navigate('Settings')}
      title="Go to next screen"
    />
  </ScrollView>
);

const SettingsScreen = ({ navigation }: any) => (
  <Button title="Go back" onPress={() => navigation.goBack()} />
);

const Stack = createNativeStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        options={{
          headerShown: false,
        }}
        component={MainScreen}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerTintColor: 'hotpink',
          headerBackButtonDisplayMode: 'minimal',
          headerTitle: () => (
            <View style={{ gap: 16, flexDirection: 'row' }}>
              <Square color="green" size={20} />
              <Square color="green" size={20} />
              <Square color="green" size={20} />
              <Square color="green" size={20} />
            </View>
          ),
          headerRight: () => <Square color="red" size={20} />,
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;

