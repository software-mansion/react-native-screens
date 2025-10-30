import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Button, Text, View } from 'react-native';
import PressableWithFeedback from '../shared/PressableWithFeedback';
import { Spacer } from '../shared';
import Colors from '../shared/styling/Colors';
import { SafeAreaView } from 'react-native-screens/experimental';

type StackParamList = {
  Main: undefined;
  FormSheetWithFitToContents: undefined;
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
        justifyContent: 'space-between',
      }}>
      <PressableBase />
      <PressableBase />
    </View>
  );
};

const FormSheetNoFlex = () => {
  return (
    <View>
      <PressableBase />
      <Spacer space={100} />
      <PressableBase />
    </View>
  );
};

const FormSheetWithSAV = () => (
  <SafeAreaView edges={{top: true, bottom: true}}>
    <FormSheetBase />
  </SafeAreaView>
)

const FormSheetNoFlexWithSAV = () => (
  <SafeAreaView edges={{top: true, bottom: true}}>
    <FormSheetNoFlex />
  </SafeAreaView>
)

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
          component={FormSheetNoFlexWithSAV}
          name="FormSheetWithFitToContents"
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: 'fitToContents',
          }}
        />
        <Stack.Screen
          component={FormSheetWithSAV}
          name="FormSheetWithSmallDetent"
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: [0.2],
          }}
        />
        <Stack.Screen
          component={FormSheetWithSAV}
          name="FormSheetWithMediumDetent"
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: [0.5],
          }}
        />
        <Stack.Screen
          component={FormSheetWithSAV}
          name="FormSheetWithLargeDetent"
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: [0.8],
          }}
        />
        <Stack.Screen
          component={FormSheetWithSAV}
          name="FormSheetWithTwoDetents"
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: [0.3, 0.6],
          }}
        />
        <Stack.Screen
          component={FormSheetWithSAV}
          name="FormSheetWithThreeDetents"
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: [0.3, 0.6, 0.9],
          }}
        />
        <Stack.Screen
          component={FormSheetWithSAV}
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
