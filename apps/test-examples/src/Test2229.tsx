import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
  AppState,
  AppStateStatus,
  Button,
} from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ParamListBase,
} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { enableFreeze } from 'react-native-screens';

const Stack = createNativeStackNavigator();

let lastState: AppStateStatus;

export default function App() {
  const [counter, setCounter] = useState(0);
  const handleChange = useCallback((nextState: AppStateStatus) => {
    if (nextState === 'active' && lastState === 'background') {
      setCounter(c => c + 1);
    }
    lastState = nextState;
  }, []);

  useEffect(() => {
    enableFreeze(false);
    const listener = AppState.addEventListener('change', handleChange);
    handleChange(AppState.currentState);
    return () => {
      listener.remove();
    };
  }, [handleChange]);

  const theme = useColorScheme();

  return (
    <NavigationContainer theme={theme === 'light' ? DefaultTheme : DarkTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Push"
          component={PushScreen}
          options={{
            presentation: 'card',
            title: `header ${counter}`,
          }}
        />
        <Stack.Screen
          name="PushWithoutHeader"
          component={PushScreen}
          options={{
            presentation: 'card',
            headerShown: false,
            title: 'no header',
          }}
        />
        <Stack.Screen
          name="Modal"
          component={ModalScreen}
          options={{
            presentation: 'modal',
            orientation: 'portrait_up',
            title: 'modal',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

interface ModalScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

function ModalScreen({ navigation }: ModalScreenProps) {
  return (
    <View style={styles.container}>
      <Button
        testID="stack-presentation-modal-screen-go-back-button"
        title="Go back"
        onPress={navigation.goBack}
      />
    </View>
  );
}

interface PushScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

function PushScreen({ navigation }: PushScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button
        testID="stack-presentation-screen-with-header"
        title="Push"
        onPress={() => navigation.push('Push')}
      />
      <Button
        testID="stack-presentation-form-screen-push-modal"
        title="Open modal"
        onPress={() => navigation.push('Modal')}
      />
      <Button
        testID="stack-presentation-screen-without-header"
        title="Push without header"
        onPress={() => navigation.push('PushWithoutHeader')}
      />
      {navigation.canGoBack() && (
        <Button
          testID="stack-presentation-screen-go-back-button"
          title="Go back"
          onPress={navigation.goBack}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
});
