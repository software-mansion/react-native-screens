import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type StackParamList = {
  Home: undefined;
  Home1: undefined;
  Home2: undefined;
  Home3: undefined;
};

interface MainScreenProps {
  navigation: NativeStackNavigationProp<StackParamList>;
}

const Home = ({ navigation }: MainScreenProps) => (
  <View style={styles.view}>
    <Text onPress={() => navigation.navigate('Home1')}>
      This is the initial View
    </Text>
  </View>
);

const Home1 = () => (
  <View style={styles.view}>
    <Text>This is View 1</Text>
  </View>
);

const Home2 = ({ navigation }: MainScreenProps) => (
  <View style={styles.view}>
    <Text onPress={() => navigation.navigate('Home3')}>This is View 2</Text>
  </View>
);

const Home3 = () => (
  <View style={styles.view}>
    <Text>This is View 3</Text>
  </View>
);

const Stack = createNativeStackNavigator();

const TestX = () => {
  const [hasChangedState, setHasChangedState] = useState(true);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {hasChangedState ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Home1" component={Home1} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home2" component={Home2} />
            <Stack.Screen name="Home3" component={Home3} />
          </>
        )}
      </Stack.Navigator>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setHasChangedState(old => !old)}>
        <Text>Change state</Text>
      </TouchableOpacity>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  view: {
    alignItems: 'center',
    backgroundColor: '#b7c4bb',
    flex: 1,
    justifyContent: 'center',
    padding: 12,
  },
});

export default TestX;
