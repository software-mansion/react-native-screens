import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';

type StackParamList = {
  Home: undefined;
  FormSheet: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

function HomeScreen({
  navigation,
}: NativeStackScreenProps<StackParamList, 'Home'>) {
  return (
    <View style={styles.home}>
      <Text style={styles.title}>Form sheet background</Text>
      <Button
        title="Open form sheet"
        onPress={() => navigation.navigate('FormSheet')}
      />
    </View>
  );
}

function FormSheetScreen({
  navigation,
}: NativeStackScreenProps<StackParamList, 'FormSheet'>) {
  return (
    <View style={styles.sheetContent}>
      <Text style={styles.title}>
        The rounded sheet surface should be yellow.
      </Text>
      <Text>
        No red should be visible inside the sheet bounds, including behind the
        rounded top corners.
      </Text>
      <Button title="Dismiss" onPress={() => navigation.goBack()} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          contentStyle: styles.screenBackground,
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="FormSheet"
          component={FormSheetScreen}
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: [0.45, 0.8],
            sheetCornerRadius: 32,
            contentStyle: styles.sheetBackground,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screenBackground: {
    backgroundColor: 'crimson',
  },
  home: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  sheetBackground: {
    backgroundColor: 'lemonchiffon',
  },
  sheetContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
});
