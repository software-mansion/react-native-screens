import React, { useState } from 'react';
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '@apps/shared/styling';

export function SecureForm() {
  const [secure, setSecure] = useState(true);
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        autoFocus
        secureTextEntry={secure}
        placeholder="Password"
      />
      <Button
        title={secure ? 'Show Password' : 'Hide Password'}
        onPress={() => setSecure(s => !s)}
      />
      <Button
        title={`TAP ME — count: ${count}`}
        onPress={() => setCount(c => c + 1)}
      />
    </View>
  );
}

export function Home() {
  const navigation = useNavigation('Home');
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FormSheet</Text>
      <Text style={styles.hint}>
        1. The password field below is autofocused (keyboard open){'\n'}
        2. Tap "Show / Hide" 2–3 times{'\n'}
        3. Tap "TAP ME" — counter is frozen until the keyboard closes
      </Text>
      <Button
        title="Open FormSheet"
        onPress={() => navigation.navigate('Sheet')}
      />
    </View>
  );
}

const RootNavigator = createNativeStackNavigator({
  screens: {
    Home: createNativeStackScreen({
      screen: Home,
      options: { headerShown: false },
    }),
    Sheet: createNativeStackScreen({
      screen: SecureForm,
      options: {
        presentation: 'formSheet',
        sheetAllowedDetents: [0.8],
        headerShown: Platform.OS === 'android',
        headerTitle: 'Auth',
      },
    }),
  },
});

const Navigation = createStaticNavigation(RootNavigator);

export default function App() {
  return (
    <SafeAreaProvider>
      <Navigation />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
    justifyContent: 'center',
    backgroundColor: Colors.White,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  hint: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.NavyDark100,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});
