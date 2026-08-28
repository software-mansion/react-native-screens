import React, { useState } from 'react';

import { View, Text, Button, StyleSheet } from 'react-native';
import {
  useNavigation,
  CommonActions,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScreenStack, ScreenStackItem } from 'react-native-screens';

// Repros for the ScreenStack.onUpdate attach pass ("attach screens that just
// became visible") re-adding fragments that must stay detached. Both scenarios
// dismiss an opaque screen sitting above a transparent modal whose anchor got
// detached, which triggers the pile-restore attach pass:
// 1. react-navigation + preload: the preloaded (activityState INACTIVE) route
//    is the stack's last child and gets attached on top of the visible stack.
// 2. Bare screens API + native header back dismissal: the dismissed screen is
//    still a React child (dismissedWrappers path) and gets re-added right
//    after the remove pass removed it.

export default function App() {
  const [scenario, setScenario] = useState<'preload' | 'native-dismiss'>();

  if (scenario === 'preload') {
    return <PreloadScenario />;
  }
  if (scenario === 'native-dismiss') {
    return <NativeDismissScenario />;
  }
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Pick a scenario:</Text>
      <Button
        title="react-navigation + preload"
        onPress={() => setScenario('preload')}
      />
      <Button
        title="Screens API + native dismiss"
        onPress={() => setScenario('native-dismiss')}
      />
    </View>
  );
}

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <Button title={`Counter: ${count}`} onPress={() => setCount(c => c + 1)} />
  );
}

// #region react-navigation + preload scenario

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Steps:</Text>
      <Text>1. Preload screen</Text>
      <Text>2. Open transparent modal</Text>
      <Text>3. Push opaque modal (from the transparent one)</Text>
      <Text>4. Dismiss opaque modal</Text>
      <Text>
        5. Tap the counter on the transparent modal. If it does not respond (or
        a magenta screen appears), the bug reproduced. Hardware back should heal
        it.
      </Text>
      <Button
        title="1. Preload screen"
        onPress={() => navigation.dispatch(CommonActions.preload('Preloaded'))}
      />
      <Button
        title="2. Open transparent modal"
        onPress={() =>
          navigation.dispatch(CommonActions.navigate('TransparentModal'))
        }
      />
    </View>
  );
}

function TransparentModalScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.transparentModalBackdrop}>
      <View style={styles.transparentModalCard}>
        <Text style={styles.title}>Transparent modal</Text>
        <Counter />
        <Button
          title="3. Push opaque modal"
          onPress={() =>
            navigation.dispatch(CommonActions.navigate('OpaqueModal'))
          }
        />
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

function OpaqueModalScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Opaque modal</Text>
      <Button
        title="4. Dismiss opaque modal"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

function PreloadedScreen() {
  React.useEffect(() => {
    console.log('PreloadedScreen mounted');
    return () => console.log('PreloadedScreen unmounted');
  }, []);

  return (
    <View style={styles.preloaded}>
      <Text style={styles.title}>PRELOADED SCREEN</Text>
      <Text>You should never see this without navigating to it!</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

const PreloadScenario = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="TransparentModal"
        component={TransparentModalScreen}
        options={{ presentation: 'transparentModal', headerShown: false }}
      />
      <Stack.Screen
        name="OpaqueModal"
        component={OpaqueModalScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="Preloaded" component={PreloadedScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

// #region Screens API + native dismiss scenario

function NativeDismissScenario() {
  const [routes, setRoutes] = useState<string[]>(['home']);

  const pushRoute = (route: string) => setRoutes(prev => [...prev, route]);
  const popRoute = (route: string) =>
    setRoutes(prev => prev.filter(r => r !== route));

  return (
    <ScreenStack style={styles.container}>
      <ScreenStackItem
        screenId="home"
        style={StyleSheet.absoluteFill}
        headerConfig={{ title: 'Test0000' }}>
        <View style={styles.screen}>
          <Text style={styles.title}>Steps:</Text>
          <Text>1. Open transparent modal</Text>
          <Text>2. Push opaque screen (from the modal)</Text>
          <Text>3. Tap the NATIVE header back button on the opaque screen</Text>
          <Text>
            Expected: the opaque screen plays its close animation and the
            transparent modal is restored with a working counter. Broken: the
            first back tap does nothing (or the screen pops with no animation)
            and a second tap is needed to recover.
          </Text>
          <Button
            title="1. Open transparent modal"
            onPress={() => pushRoute('transparent-modal')}
          />
        </View>
      </ScreenStackItem>
      {routes.includes('transparent-modal') && (
        <ScreenStackItem
          screenId="transparent-modal"
          style={StyleSheet.absoluteFill}
          stackPresentation="transparentModal"
          headerConfig={{ hidden: true }}
          onDismissed={() => popRoute('transparent-modal')}>
          <View style={styles.transparentModalBackdrop}>
            <View style={styles.transparentModalCard}>
              <Text style={styles.title}>Transparent modal</Text>
              <Counter />
              <Button
                title="2. Push opaque screen"
                onPress={() => pushRoute('opaque')}
              />
              <Button
                title="Close"
                onPress={() => popRoute('transparent-modal')}
              />
            </View>
          </View>
        </ScreenStackItem>
      )}
      {routes.includes('opaque') && (
        <ScreenStackItem
          screenId="opaque"
          style={StyleSheet.absoluteFill}
          stackAnimation="slide_from_bottom"
          nativeBackButtonDismissalEnabled
          headerConfig={{ title: 'Opaque screen' }}
          onDismissed={() => popRoute('opaque')}>
          <View style={styles.screen}>
            <Text style={styles.title}>Opaque screen</Text>
            <Text>3. Tap the native back button in the header above.</Text>
          </View>
        </ScreenStackItem>
      )}
    </ScreenStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    gap: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  transparentModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  transparentModalCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  preloaded: {
    flex: 1,
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'magenta',
  },
});
