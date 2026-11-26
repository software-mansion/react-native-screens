import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';

type Routes = { Home: undefined; SignIn: undefined; Nested: undefined };
type NestedRoutes = { NestedHome: undefined; NestedSignIn: undefined };

const Stack = createNativeStackNavigator<Routes>();
const NestedStack = createNativeStackNavigator<NestedRoutes>();

function CredentialFields() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoComplete="username"
        importantForAutofill="yes"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        autoComplete="current-password"
        importantForAutofill="yes"
        secureTextEntry={true}
        autoCapitalize="none"
      />
    </>
  );
}

function Home({ navigation }: NativeStackScreenProps<Routes, 'Home'>) {
  return (
    <View style={styles.screen}>
      <Text>
        With an autofill service set on the device, focusing Username on any
        screen must start an autofill session (`adb logcat -s AutofillManager`
        after `adb shell cmd autofill set log_level verbose` logs
        `startSessionLocked()`). Relaunch the app before each check.
      </Text>
      <CredentialFields />
      <Button
        testID="test4612-push-sign-in"
        title="Push sign in"
        onPress={() => navigation.navigate('SignIn')}
      />
      <Button
        testID="test4612-push-nested"
        title="Push nested stack"
        onPress={() => navigation.navigate('Nested')}
      />
    </View>
  );
}

function SignIn() {
  return (
    <View style={styles.screen}>
      <CredentialFields />
    </View>
  );
}

function NestedHome({
  navigation,
}: NativeStackScreenProps<NestedRoutes, 'NestedHome'>) {
  return (
    <View style={styles.screen}>
      <CredentialFields />
      <Button
        testID="test4612-push-nested-sign-in"
        title="Push sign in"
        onPress={() => navigation.navigate('NestedSignIn')}
      />
    </View>
  );
}

function Nested() {
  return (
    <NestedStack.Navigator>
      <NestedStack.Screen name="NestedHome" component={NestedHome} />
      <NestedStack.Screen name="NestedSignIn" component={SignIn} />
    </NestedStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen
          name="Nested"
          component={Nested}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 16,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#888888',
    padding: 12,
    fontSize: 18,
    color: '#000000',
  },
});
