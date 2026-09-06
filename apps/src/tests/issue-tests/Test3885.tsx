import * as React from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import {
  NavigationContainer,
  ParamListBase,
  usePreventRemove,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Colors } from '@apps/shared/styling';

type NavigationProps = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

function HomeScreen({ navigation }: NavigationProps) {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>

      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Go to Login</Text>
      </Pressable>
    </View>
  );
}

function LoginScreen({ navigation }: NavigationProps) {
  const hasUnsavedChanges = true;

  usePreventRemove(hasUnsavedChanges, ({ data }) => {
    Alert.alert('Unsaved changes', 'Discard and exit?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => navigation.dispatch(data.action),
      },
    ]);
  });

  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Try to go back</Text>
      </Pressable>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login' }}
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
    gap: 20,
  },
  linkText: {
    color: Colors.BlueDark100,
    fontSize: 16,
    fontWeight: '600',
  },
});
