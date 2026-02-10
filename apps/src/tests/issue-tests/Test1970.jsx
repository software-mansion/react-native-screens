import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, StyleSheet, Text } from 'react-native';

const Stack = createNativeStackNavigator();

const Home = () => {
  const navigation = useNavigation();

  return (
    <>
      <Text>Home Screen - Portrait</Text>
      <Button title="Next" onPress={() => navigation.navigate('Landscape')} />
    </>
  );
};

const Landscape = () => {
  const navigation = useNavigation();

  return (
    <>
      <Text>Landscape Screen</Text>
      <Button title="Back" onPress={() => navigation.goBack()} />
    </>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ animation: 'none', headerShown: false }}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            orientation: 'portrait',
            contentStyle: {
              flex: 1,
              backgroundColor: '#abc',
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}
        />
        <Stack.Screen
          name="Landscape"
          component={Landscape}
          options={{
            orientation: 'landscape',
            contentStyle: {
              flex: 1,
              backgroundColor: '#cba',
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
