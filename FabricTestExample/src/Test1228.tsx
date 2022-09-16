import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import {
  useNavigation,
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';


export const FirstScreen = () => {
  const [theme, setTheme] = useState(false);
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: theme ? 'red' : 'green',
    })
  });

  return (
    <View style={style.container}>
      <Text>Screen 1</Text>
      <Button title="set theme" onPress={() => setTheme(!theme)} />
      <Button title="open" onPress={() => navigation.navigate('screen2')} />
    </View>
  );
};

export const SecondScreen = () => {
  const [theme, setTheme] = useState(false);
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: theme ? 'red' : 'green',
    })
  });

  return (
    <View style={style.container}>
      <Text>Screen 2</Text>
      <Button title="set theme" onPress={() => setTheme(!theme)} />
      <Button title="close" onPress={() => navigation.goBack()} />
    </View>
  );
};

const Stack = createNativeStackNavigator();

export default function App() {
  const [theme, setTheme] = useState(false);

  setTimeout(() => setTheme(!theme), 5000);

  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={theme ? DarkTheme : DefaultTheme}
      >
        <Stack.Navigator screenOptions={{ stackPresentation: 'modal' }}>
          <Stack.Screen name="screen1" component={FirstScreen} />
          <Stack.Screen name="screen2" component={SecondScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
