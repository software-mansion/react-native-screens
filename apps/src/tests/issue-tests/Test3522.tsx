import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Button, StyleProp, TextInput, View, ViewStyle } from 'react-native';

type StackParamList = {
  Main: undefined;
  FormSheetWithFitToContents: undefined;
  FormSheetWithAutoFocusAndFitToContents: undefined;
  FormSheetWithFitToContentsLarge: undefined;
  FormSheetWithAutoFocusAndFitToContentsLarge: undefined;
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
        title="Fit to contents - autoFocus"
        onPress={() =>
          navigation.navigate('FormSheetWithAutoFocusAndFitToContents')
        }
      />
      <Button
        title="Fit to contents - large"
        onPress={() => navigation.navigate('FormSheetWithFitToContentsLarge')}
      />
      <Button
        title="Fit to contents - large - autoFocus"
        onPress={() =>
          navigation.navigate('FormSheetWithAutoFocusAndFitToContentsLarge')
        }
      />
    </View>
  );
}

const formSheetBaseOptions: NativeStackNavigationOptions = {
  presentation: 'formSheet',
  animation: 'slide_from_bottom',
  headerShown: false,
};

function FormSheetBase({
  autoFocus = false,
  containerStyle = { height: 200 },
}: {
  autoFocus?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={containerStyle}>
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

function LargeFormSheet({ autoFocus = false }: { autoFocus?: boolean }) {
  return (
    <FormSheetBase containerStyle={{ height: 1000 }} autoFocus={autoFocus} />
  );
}

function LargeFormSheetWithAutoFocus() {
  return <LargeFormSheet autoFocus />;
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
          component={FormSheetWithAutoFocus}
          name="FormSheetWithAutoFocusAndFitToContents"
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: 'fitToContents',
          }}
        />
        <Stack.Screen
          component={LargeFormSheet}
          name="FormSheetWithFitToContentsLarge"
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: 'fitToContents',
          }}
        />
        <Stack.Screen
          component={LargeFormSheetWithAutoFocus}
          name="FormSheetWithAutoFocusAndFitToContentsLarge"
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: 'fitToContents',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
