import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Button, TextInput, View } from 'react-native';

type StackParamList = {
  Main: undefined;
  FormSheetWithFitToContents: undefined;
  FormSheetWithSmallDetent: undefined;
  FormSheetWithMediumDetent: undefined;
  FormSheetWithLargeDetent: undefined;
  FormSheetWithTwoDetents: undefined;
  FormSheetWithThreeDetents: undefined;
  FormSheetWithAutoFocusAndFitToContents: undefined;
  FormSheetWithAutoFocusAndDetent: undefined;
};

type MainProps = {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
};

const Stack = createNativeStackNavigator();

function Main({ navigation }: MainProps) {
  return (
    <View style={{ flex: 1 }}>
      <Button
        title="Fit to contents"
        onPress={() => navigation.navigate('FormSheetWithFitToContents')}
      />
      <Button
        title="1 small detent"
        onPress={() => navigation.navigate('FormSheetWithSmallDetent')}
      />
      <Button
        title="1 medium detent"
        onPress={() => navigation.navigate('FormSheetWithMediumDetent')}
      />
      <Button
        title="1 large detent"
        onPress={() => navigation.navigate('FormSheetWithLargeDetent')}
      />
      <Button
        title="2 detents"
        onPress={() => navigation.navigate('FormSheetWithTwoDetents')}
      />
      <Button
        title="3 detents"
        onPress={() => navigation.navigate('FormSheetWithThreeDetents')}
      />
      <Button
        title="Fit to contents - autoFocus"
        onPress={() =>
          navigation.navigate('FormSheetWithAutoFocusAndFitToContents')
        }
      />
      <Button
        title="1 detent - autoFocus"
        onPress={() => navigation.navigate('FormSheetWithAutoFocusAndDetent')}
      />
    </View>
  );
}

const formSheetBaseOptions: NativeStackNavigationOptions = {
  presentation: 'formSheet',
  animation: 'slide_from_bottom',
  headerShown: false,
};

function FormSheetBase({ autoFocus = false }: { autoFocus?: boolean }) {
  return (
    <View>
      <TextInput
        autoFocus={autoFocus}
        style={{
          borderWidth: 1,
          borderColor: 'black',
          padding: 10,
          borderRadius: 10,
        }}
      />
    </View>
  );
}

function FormSheetWithAutoFocus() {
  return <FormSheetBase autoFocus />;
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          component={Main}
          name="main"
          options={{ title: 'Main' }}
        />
        <Stack.Screen
          component={FormSheetBase}
          name="FormSheetWithFitToContents"
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: 'fitToContents',
          }}
        />
        <Stack.Screen
          component={FormSheetBase}
          name="FormSheetWithSmallDetent"
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: [0.1],
          }}
        />
        <Stack.Screen
          component={FormSheetBase}
          name="FormSheetWithMediumDetent"
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: [0.5],
          }}
        />
        <Stack.Screen
          component={FormSheetBase}
          name="FormSheetWithLargeDetent"
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: [0.8],
          }}
        />
        <Stack.Screen
          component={FormSheetBase}
          name="FormSheetWithTwoDetents"
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: [0.3, 0.6],
          }}
        />
        <Stack.Screen
          component={FormSheetBase}
          name="FormSheetWithThreeDetents"
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: [0.3, 0.6, 0.9],
          }}
        />
        <Stack.Screen
          component={FormSheetWithAutoFocus}
          name="FormSheetWithAutoFocusAndFitToContents"
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: 'fitToContents',
          }}
        />
        <Stack.Screen
          component={FormSheetWithAutoFocus}
          name="FormSheetWithAutoFocusAndDetent"
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: [0.5],
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
