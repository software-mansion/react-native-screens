import * as React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

type StackParamList = {
  ScreenOne: undefined;
  ScreenTwo: { index?: number };
};

function ScreenOne({
  navigation,
}: {
  navigation: NativeStackNavigationProp<StackParamList, 'ScreenOne'>;
}) {
  const pushMany = () => {
    for (let i = 1; i <= 200; i++) {
      navigation.push('ScreenTwo', { index: i });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ScreenOne</Text>
      <Button title="Push 200 ScreenTwo instances" onPress={pushMany} />
    </View>
  );
}

function ScreenTwo({
  route,
  navigation,
}: {
  route: any;
  navigation: NativeStackNavigationProp<StackParamList, 'ScreenTwo'>;
}) {
  const index = route.params?.index ?? 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ScreenTwo</Text>
      <Text style={styles.subtitle}>Instance Number: {index}</Text>
      <Button title="Pop to Top" onPress={() => navigation.popToTop()} />
    </View>
  );
}

const Stack = createNativeStackNavigator<StackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ScreenOne" component={ScreenOne} />
        <Stack.Screen name="ScreenTwo" component={ScreenTwo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
  },
});
