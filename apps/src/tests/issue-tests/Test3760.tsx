import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {
  NavigationContainer,
  type ParamListBase,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import Colors from '../../shared/styling/Colors';

type RouteParamList = {
  Main: undefined;
  ModalOne: undefined;
  ModalTwo: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<RouteParamList>;

function MainScreen({ navigation }: StackNavigationProp) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main Screen</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Open Modal One"
          onPress={() => navigation.navigate('ModalOne')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Open Modal Two"
          color="green"
          onPress={() => navigation.navigate('ModalTwo')}
        />
      </View>
    </View>
  );
}

function ModalOneScreen() {
  return (
    <View style={[styles.container, { backgroundColor: Colors.BlueLight20 }]}>
      <Text style={styles.title}>This is Modal One</Text>
    </View>
  );
}

function ModalTwoScreen() {
  return (
    <View style={[styles.container, { backgroundColor: Colors.GreenLight20 }]}>
      <Text style={styles.title}>This is Modal Two</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator<RouteParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="ModalOne" component={ModalOneScreen} />
          <Stack.Screen name="ModalTwo" component={ModalTwoScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  buttonContainer: {
    marginVertical: 10,
  },
});
