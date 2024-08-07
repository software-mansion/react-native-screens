import * as React from 'react';
import { View, Text, Button } from 'react-native';
import {
  useNavigation,
  CommonActions,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Home!</Text>
      <Button
        title='Navigate to Home'
        onPress={() => {
          navigation.dispatch(
            CommonActions.navigate('Home2')
          );
        }}
      />
      <Button
        title='Preload CardProfile'
        onPress={() => {
          navigation.dispatch(
            CommonActions.preload('CardProfile', { user: 'jane' })
          );
        }}
      />
      <Button
        title='Navigate to CardProfile'
        onPress={() => {
          navigation.dispatch(
            CommonActions.navigate('CardProfile', { user: 'jane' })
          );
        }}
      />
      <Button
        title='Preload ModalProfile'
        onPress={() => {
          navigation.dispatch(
            CommonActions.preload('ModalProfile', { user: 'jane' })
          );
        }}
      />
      <Button
        title='Navigate to ModalProfile'
        onPress={() => {
          navigation.dispatch(
            CommonActions.navigate('ModalProfile', { user: 'jane' })
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
      }}
    >
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
      <Text>Preloaded for: {endTime ? endTime - startTime : 'N/A'}ms</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />
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
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
