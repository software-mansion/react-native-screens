import React, { useState } from 'react';
import { Button, View, Text, StyleSheet, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import Colors from '../../shared/styling/Colors';

type StackParamList = {
  Home: undefined;
  FormSheet: undefined;
  FormSheetWithAutoFocus: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

const HomeScreen = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.text}>Is focused? {isFocused ? "YES" : "NO"}</Text>
      <TextInput
        style={[
          styles.input,
          isFocused
            ? { borderColor: Colors.GreenDark100 }
            : { borderColor: Colors.RedDark100 },
        ]}
        placeholder="Enter text (no sheet)"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <Button
        title="Open Form Sheet"
        onPress={() => navigation.navigate('FormSheet')}
      />
      <Button
        title="Open Form Sheet (with autoFocus)"
        onPress={() => navigation.navigate('FormSheetWithAutoFocus')}
      />
    </View>
  );
};

const FormSheetScreen = () => {
  return (
    <View style={styles.formSheetContainer}>
      <View style={styles.rectangle} />
      <TextInput style={styles.input} placeholder="Enter text in FormSheet" />
    </View>
  );
};

const FormSheetScreenWithAutoFocus = () => {
  return (
    <View style={styles.formSheetContainer}>
      <View style={styles.rectangle} />
      <TextInput style={styles.input} autoFocus placeholder="Enter text in FormSheet" />
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
          component={FormSheetScreen}
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: 'fitToContents',
            headerShown: false,
            contentStyle: {
              backgroundColor: Colors.YellowLight40,
            },
          }}
        />
        <Stack.Screen
          name="FormSheetWithAutoFocus"
          component={FormSheetScreenWithAutoFocus}
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: 'fitToContents',
            headerShown: false,
            contentStyle: {
              backgroundColor: Colors.YellowLight40,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 24,
  },
  formSheetContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 20,
  },
  text: {
    fontSize: 16,
  },
  rectangle: {
    width: '100%',
    backgroundColor: Colors.NavyLight80,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 2,
  },
});
