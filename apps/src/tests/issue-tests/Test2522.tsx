import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Spacer } from '../../shared';
import Colors from '../../shared/styling/Colors';
import { featureFlags } from 'react-native-screens';

// For keeping the reference to the original value from the global scope,
// because we need to override it for this specific example.
let originalSynchronousScreenUpdatesFlagEnabled: boolean;

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

interface Example {
  title: string;
  screen: keyof StackParamList;
}

const EXAMPLES: Example[] = [
  { title: 'flex:1', screen: 'FormSheetWithFlex' },
  { title: 'height:fixed', screen: 'FormSheetWithFixedHeight' },
  {
    title: 'flex:1 & fitToContents',
    screen: 'FormSheetWithFlexAndFitToContents',
  },
  {
    title: 'height:fixed & fitToContents',
    screen: 'FormSheetWithFixedHeightAndFitToContents',
  },
];

function Main({ navigation }: MainProps) {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.text}>
        Supported since RN 0.82 with synchronousScreenUpdatesEnabled flag
        enabled
      </Text>
      <ScrollView>
        {EXAMPLES.map(({ title, screen }) => (
          <View key={screen} style={{ marginVertical: 4 }}>
            <Button title={title} onPress={() => navigation.navigate(screen)} />
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
  useEffect(() => {
    originalSynchronousScreenUpdatesFlagEnabled =
      featureFlags.experiment.synchronousScreenUpdatesEnabled;
    featureFlags.experiment.synchronousScreenUpdatesEnabled = true;

    return () => {
      // Note: It signals an error that the flag value has changed, but this is intentional
      featureFlags.experiment.synchronousScreenUpdatesEnabled =
        originalSynchronousScreenUpdatesFlagEnabled;
    };
  }, []);

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
    fontSize: 20,
    margin: 8,
    textAlign: 'center',
  },
});
