import * as React from 'react';

import { View, Text, Button } from 'react-native';
import {
  useNavigation,
  CommonActions,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>Home!</Text>
      <Button
        title="Navigate to Home"
        onPress={() => {
          navigation.dispatch(CommonActions.navigate('Home2'));
        }}
      />
      <Button
        title="Preload CardProfile"
        onPress={() => {
          navigation.dispatch(
            CommonActions.preload('CardProfile', { user: 'jane' }),
          );
        }}
      />
      <Button
        title="Navigate to CardProfile"
        onPress={() => {
          navigation.dispatch(
            CommonActions.navigate('CardProfile', { user: 'jane' }),
          );
        }}
      />
      <Button
        title="Preload ModalProfile"
        onPress={() => {
          navigation.dispatch(
            CommonActions.preload('ModalProfile', { user: 'jane' }),
          );
        }}
      />
      <Button
        title="Navigate to ModalProfile"
        onPress={() => {
          navigation.dispatch(
            CommonActions.navigate('ModalProfile', { user: 'jane' }),
          );
        }}
      />
      <Button
        title="Preload TabScreen"
        onPress={() => {
          navigation.dispatch(
            CommonActions.preload('TabScreen', { user: 'jane' }),
          );
        }}
      />
      <Button
        title="Navigate to TabScreen"
        onPress={() => {
          navigation.dispatch(
            CommonActions.navigate('TabScreen', { user: 'jane' }),
          );
        }}
      />
    </View>
  );
}

function ProfileScreen({ route }: any) {
  const navigation = useNavigation();
  const [startTime] = React.useState(Date.now());
  const [endTime, setEndTime] = React.useState<number | null>(null);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setEndTime(Date.now());
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
      <Text>Preloaded for: {endTime ? endTime - startTime : 'N/A'}ms</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
const StackTabA = createNativeStackNavigator();

function TabA() {
  return (
    <StackTabA.Navigator>
      <StackTabA.Screen name="TabA_1" component={TabA_1} />
      <StackTabA.Screen name="TabA_2" component={TabA_2} />
    </StackTabA.Navigator>
  );
}

function TabA_1() {
  const navigation = useNavigation();
  const [startTime] = React.useState(Date.now());
  const [endTime, setEndTime] = React.useState<number | null>(null);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setEndTime(Date.now());
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>TabA_1!</Text>
      <Text>Preloaded for: {endTime ? endTime - startTime : 'N/A'}ms</Text>
      <Button
        title="Preload TabA_2"
        onPress={() => {
          navigation.dispatch(
            CommonActions.preload('TabA_2', { user: 'jane' }),
          );
        }}
      />
      <Button
        title="Navigate to TabA_2"
        onPress={() => {
          navigation.dispatch(
            CommonActions.navigate('TabA_2', { user: 'jane' }),
          );
        }}
      />
    </View>
  );
}

function TabA_2() {
  const navigation = useNavigation();
  const [startTime] = React.useState(Date.now());
  const [endTime, setEndTime] = React.useState<number | null>(null);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setEndTime(Date.now());
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>TabA_2!</Text>
      <Text>Preloaded for: {endTime ? endTime - startTime : 'N/A'}ms</Text>
      <Button
        title="Preload ModalProfile"
        onPress={() => {
          navigation.dispatch(
            CommonActions.preload('ModalProfile', { user: 'jane' }),
          );
        }}
      />
      <Button
        title="Navigate to ModalProfile"
        onPress={() => {
          navigation.dispatch(
            CommonActions.navigate('ModalProfile', { user: 'jane' }),
          );
        }}
      />
    </View>
  );
}

const StackTabB = createNativeStackNavigator();

function TabB() {
  return (
    <StackTabA.Navigator>
      <StackTabA.Screen name="TabB_1" component={TabB_1} />
      <StackTabA.Screen name="TabB_2" component={TabB_2} />
    </StackTabA.Navigator>
  );
}

function TabB_1() {
  const navigation = useNavigation();
  const [startTime] = React.useState(Date.now());
  const [endTime, setEndTime] = React.useState<number | null>(null);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setEndTime(Date.now());
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>TabB_1!</Text>
      <Text>Preloaded for: {endTime ? endTime - startTime : 'N/A'}ms</Text>
      <Button
        title="Preload TabB_2"
        onPress={() => {
          navigation.dispatch(
            CommonActions.preload('TabB_2', { user: 'jane' }),
          );
        }}
      />
      <Button
        title="Navigate to TabB_2"
        onPress={() => {
          navigation.dispatch(
            CommonActions.navigate('TabB_2', { user: 'jane' }),
          );
        }}
      />
    </View>
  );
}

function TabB_2() {
  const navigation = useNavigation();
  const [startTime] = React.useState(Date.now());
  const [endTime, setEndTime] = React.useState<number | null>(null);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setEndTime(Date.now());
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>TabB_2!</Text>
      <Text>Preloaded for: {endTime ? endTime - startTime : 'N/A'}ms</Text>
      <Button
        title="Preload ModalProfile"
        onPress={() => {
          navigation.dispatch(
            CommonActions.preload('ModalProfile', { user: 'jane' }),
          );
        }}
      />
      <Button
        title="Navigate to ModalProfile"
        onPress={() => {
          navigation.dispatch(
            CommonActions.navigate('ModalProfile', { user: 'jane' }),
          );
        }}
      />
    </View>
  );
}

function TabScreen({ route }: any) {
  console.log('route?.params?.user', route?.params?.user);

  return (
    <Tab.Navigator>
      <Tab.Screen name="TabA" component={TabA} />
      <Tab.Screen name="TabB" component={TabB} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Home2"
        component={HomeScreen}
        options={{ presentation: 'card' }}
      />
      <Stack.Screen
        name="CardProfile"
        component={ProfileScreen}
        options={{ presentation: 'card' }}
      />
      <Stack.Screen
        name="ModalProfile"
        component={ProfileScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="TabScreen" component={TabScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
