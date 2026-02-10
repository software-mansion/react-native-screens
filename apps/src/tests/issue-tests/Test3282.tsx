import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

type StackParamList = {
  Home: undefined,
  FormSheet: undefined,
}

type RouteProps = {
  navigation: NativeStackNavigationProp<StackParamList>;
}

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }: RouteProps) => {
  return (
    <View style={styles.container}>
      <Button
        title="Open Modal"
        onPress={() => navigation.navigate('FormSheet')}
      />
    </View>
  );
};

const FormSheet = () => {
  return (
    <View style={styles.sheetContainer}>
      <View style={styles.content}>
        <Text>Modal Content</Text>
      </View>
      <View style={styles.blueBox}>
        <Text style={styles.boxText}>Box</Text>
      </View>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="FormSheet"
          component={FormSheet}
          options={{
            presentation: 'formSheet',
            title: 'Modal',
            headerShown: true,
            sheetAllowedDetents: [0.4, 0.8],
            sheetGrabberVisible: true,
          }}
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
  },
  sheetContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'red',
    minHeight: '100%',
    position: 'relative',
  },
  content: {
    padding: 20,
  },
  blueBox: {
    height: 60,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  boxText: {
    color: 'white',
  },
});
