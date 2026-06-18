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
  FormSheetNoFooter: undefined;
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

  // This bar's width tracks the reanimated keyboard height. It is pinned to the top
  // of the screen so it stays visible above the keyboard. If reanimated is receiving
  // WindowInsetsAnimation frames it grows with the keyboard; if the decor-view slot
  // was stolen it stays at 0.
  const probeStyle = useAnimatedStyle(() => ({
    width: keyboard.height.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.probeBar, probeStyle]} />
      <Text style={styles.instructions}>
        1. Focus the input — it should translate up with the keyboard and the top
        red bar should grow.{'\n'}
        2. Dismiss the keyboard, open a form sheet, close it.{'\n'}
        3. Focus the input again — before the fix the bar stays at 0 and the input
        no longer animates, and it never recovers for the lifetime of the process.
      </Text>
      <Button
        title="Open form sheet WITH footer"
        onPress={() => navigation.navigate('FormSheetWithFooter')}
      />
      <Button
        title="Open form sheet WITHOUT footer"
        onPress={() => navigation.navigate('FormSheetNoFooter')}
      />
      <Animated.View style={animatedStyle}>
        <TextInput placeholder="Focus me" style={styles.input} />
      </Animated.View>
    </View>
  );
}

function FormSheet({
  navigation,
}: RouteProps<'FormSheetWithFooter' | 'FormSheetNoFooter'>) {
  return (
    <View style={styles.sheetContent}>
      <Button title="Close" onPress={() => navigation.goBack()} />
      <TextInput
        placeholder="Focus me inside the sheet"
        style={styles.input}
      />
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
          component={FormSheet}
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
        <Stack.Screen
          name="FormSheetNoFooter"
          component={FormSheet}
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: [0.4],
            sheetCornerRadius: 8,
            headerShown: false,
            contentStyle: {
              backgroundColor: 'lightyellow',
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
    justifyContent: 'flex-end',
    gap: 16,
    padding: 16,
  },
  probeBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 12,
    backgroundColor: 'red',
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
