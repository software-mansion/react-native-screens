import * as React from 'react';
import { View, Button, Text, StyleSheet, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

type StackParamList = {
  Home: undefined;
  'Sheet One': undefined;
  'Sheet Two': undefined;
  'Sheet Three': undefined;
};

function HomeScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<StackParamList>;
}) {
  return (
    <View style={styles.container}>
      <Button
        onPress={() => navigation.navigate('Sheet One')}
        title="Open First Sheet"
      />
      <Button
        onPress={() => navigation.navigate('Sheet Two')}
        title="Open Second Sheet"
      />
      <Button
        onPress={() => navigation.navigate('Sheet Three')}
        title="Open Third Sheet"
      />
    </View>
  );
}

function Screen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<StackParamList>;
}) {
  return (
    <View style={styles.sheetContainer}>
      <Text style={styles.text}>I'm inside a view</Text>
      <Button onPress={navigation.goBack} title="Dismiss" />
    </View>
  );
}

function Screen2({
  navigation,
}: {
  navigation: NativeStackNavigationProp<StackParamList>;
}) {
  return (
    <View style={{ ...styles.sheetContainer, flex: 1 }}>
      <Text style={styles.text}>I'm inside a view with "flex: 1"</Text>
      <Button onPress={navigation.goBack} title="Dismiss" />
    </View>
  );
}

function Screen3({
  navigation,
}: {
  navigation: NativeStackNavigationProp<StackParamList>;
}) {
  return (
    <ScrollView
      contentContainerStyle={styles.sheetContainer}
      nestedScrollEnabled>
      {Array(30)
        .fill(0)
        .map((_, index) => (
          <Text style={styles.text} key={index}>
            I'm inside a scrollview
          </Text>
        ))}
      <Button onPress={navigation.goBack} title="Dismiss" />
      <ScrollView>
        {Array(30)
          .fill(0)
          .map((_, index) => (
            <Text style={styles.text} key={'nested' + index}>
              I'm inside a nested scrollview
            </Text>
          ))}
      </ScrollView>
    </ScrollView>
  );
}

const RootStack = createNativeStackNavigator<StackParamList>();

const commonSheetOptions = {
  presentation: 'formSheet',
  sheetAllowedDetents: [0.5, 1],
  contentStyle: { backgroundColor: 'palegoldenrod' },
  sheetCornerRadius: 25,
} as NativeStackNavigationOptions;

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="Sheet One"
          component={Screen}
          options={commonSheetOptions}
        />
        <RootStack.Screen
          name="Sheet Two"
          component={Screen2}
          options={commonSheetOptions}
        />
        <RootStack.Screen
          name="Sheet Three"
          component={Screen3}
          options={commonSheetOptions}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    fontSize: 20,
    padding: 5,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  sheetContainer: {
    backgroundColor: 'antiquewhite',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
