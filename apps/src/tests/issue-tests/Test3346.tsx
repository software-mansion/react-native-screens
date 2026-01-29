import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Button, Text, View } from 'react-native';
import PressableWithFeedback from '../../shared/PressableWithFeedback';
import Colors from '../../shared/styling/Colors';

type StackParamList = {
  Main: undefined;
  FormSheetWithSmallDetent: undefined;
  FormSheetWithMediumDetent: undefined;
  FormSheetWithLargeDetent: undefined;
  FormSheetWithTwoDetents: undefined;
  FormSheetWithThreeDetents: undefined;
  FormSheetWithMaxDetent: undefined;
};

type MainProps = {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
};

const Stack = createNativeStackNavigator();

const Main = ({ navigation }: MainProps) => {
  return (
    <View style={{ flex: 1 }}>
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
        title="Max detent"
        onPress={() => navigation.navigate('FormSheetWithMaxDetent')}
      />
    </View>
  );
};

const formSheetBaseOptions: NativeStackNavigationOptions = {
  presentation: 'formSheet',
  animation: 'slide_from_bottom',
  headerShown: false,
  contentStyle: {
    backgroundColor: Colors.GreenLight100
  }
};

const PressableBase = () => (
  <PressableWithFeedback>
    <View
      style={{
        alignItems: 'center',
        height: 40,
        justifyContent: 'center',
      }}>
      <Text>Pressable</Text>
    </View>
  </PressableWithFeedback>
);

const FormSheetBase = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-end',
      }}>
      <PressableBase />
    </View>
  );
};

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
          name="FormSheetWithSmallDetent"
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: [0.2],
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
          component={FormSheetBase}
          name="FormSheetWithMaxDetent"
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: [1.0],
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
