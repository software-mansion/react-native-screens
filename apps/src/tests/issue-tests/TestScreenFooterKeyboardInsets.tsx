import { NavigationContainer, RouteProp } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import React from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated';

type RouteParamList = {
  Home: undefined;
  FormSheetWithFooter: undefined;
};

type RouteProps<RouteName extends keyof RouteParamList> = {
  navigation: NativeStackNavigationProp<RouteParamList, RouteName>;
  route: RouteProp<RouteParamList, RouteName>;
};

const Stack = createNativeStackNavigator<RouteParamList>();

function Home({ navigation }: RouteProps<'Home'>) {
  const keyboard = useAnimatedKeyboard();
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value }],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>
        1. Focus the input — it should translate up with the keyboard.{'\n'}
        2. Dismiss the keyboard, open the form sheet (its footer mounts),
        close the sheet.{'\n'}
        3. Focus the input again — before the fix the keyboard animation no
        longer runs and never recovers for the lifetime of the process.
      </Text>
      <Button
        title="Open form sheet with footer"
        onPress={() => navigation.navigate('FormSheetWithFooter')}
      />
      <Animated.View style={animatedStyle}>
        <TextInput placeholder="Focus me" style={styles.input} />
      </Animated.View>
    </View>
  );
}

function FormSheetWithFooter({
  navigation,
}: RouteProps<'FormSheetWithFooter'>) {
  return (
    <View style={styles.sheetContent}>
      <Button title="Close" onPress={() => navigation.goBack()} />
    </View>
  );
}

function FormSheetFooter() {
  return (
    <View style={styles.footer}>
      <Text>Sheet footer</Text>
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="FormSheetWithFooter"
          component={FormSheetWithFooter}
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: [0.4],
            sheetCornerRadius: 8,
            headerShown: false,
            contentStyle: {
              backgroundColor: 'lightblue',
            },
            unstable_sheetFooter: FormSheetFooter,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: 16,
    padding: 16,
  },
  instructions: {
    fontSize: 14,
  },
  input: {
    height: 48,
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  sheetContent: {
    height: 200,
    justifyContent: 'center',
  },
  footer: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgray',
  },
});

export default App;
