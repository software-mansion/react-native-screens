import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Spacer } from '../shared';
import Colors from '../shared/styling/Colors';

type StackParamList = {
  Main: undefined;
  FormSheetWithFlex: undefined;
  FormSheetWithFixedHeight: undefined;
  FormSheetWithFlexAndFitToContents: undefined;
  FormSheetWithFixedHeightAndFitToContents: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

type MainProps = {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
};

const EXAMPLES = [
  ['flex:1', 'FormSheetWithFlex'],
  ['height:fixed', 'FormSheetWithFixedHeight'],
  ['flex:1 & fitToContents', 'FormSheetWithFlexAndFitToContents'],
  ['height:fixed & fitToContents', 'FormSheetWithFixedHeightAndFitToContents'],
];

function Main({ navigation }: MainProps) {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <ScrollView>
        {EXAMPLES.map(([title, screen]) => (
          <View key={screen} style={{ marginVertical: 4 }}>
            <Button
              title={title}
              onPress={() =>
                navigation.navigate(screen as keyof StackParamList)
              }
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const formSheetBaseOptions: NativeStackNavigationOptions = {
  presentation: 'formSheet',
  animation: 'slide_from_bottom',
  headerShown: false,
  contentStyle: {
    backgroundColor: Colors.GreenLight100,
  },
};

function FormSheetWithFlex() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.RedDark100,
      }}>
      <Text style={styles.text}>Start</Text>
      <Text style={styles.text}>End</Text>
    </View>
  );
}

function FormSheetWithFixedHeight() {
  return (
    <View style={{ backgroundColor: Colors.RedDark100 }}>
      <Text style={styles.text}>Start</Text>
      <Spacer space={100} />
      <Text style={styles.text}>End</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          options={{ title: 'Main' }}
          children={({ navigation }) => <Main navigation={navigation} />}
        />
        <Stack.Screen
          name="FormSheetWithFlex"
          component={FormSheetWithFlex}
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: [0.3, 0.5, 0.8],
          }}
        />
        <Stack.Screen
          name="FormSheetWithFixedHeight"
          component={FormSheetWithFixedHeight}
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: [0.3, 0.5, 0.8],
          }}
        />
        <Stack.Screen
          name="FormSheetWithFlexAndFitToContents"
          component={FormSheetWithFlex}
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: 'fitToContents',
          }}
        />
        <Stack.Screen
          name="FormSheetWithFixedHeightAndFitToContents"
          component={FormSheetWithFixedHeight}
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: 'fitToContents',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    margin: 8,
    alignSelf: 'center',
  },
});
