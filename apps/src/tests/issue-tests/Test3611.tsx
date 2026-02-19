import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Button, ScrollView, Text, TextInput, View } from 'react-native';
import Colors from '../../shared/styling/Colors';
import { SafeAreaView } from 'react-native-screens/experimental';

const TEST_CASES = [
  { id: '1Detent07', detents: [0.7], label: '1 Detent: 0.7' },
  { id: '1Detent10', detents: [1.0], label: '1 Detent: 1.0' },
  { id: '2Detents03_07', detents: [0.3, 0.7], label: '2 Detents: 0.3, 0.7' },
  { id: '2Detents03_10', detents: [0.3, 1.0], label: '2 Detents: 0.3, 1.0' },
  {
    id: '3Detents02_04_07',
    detents: [0.2, 0.4, 0.7],
    label: '3 Detents: 0.2, 0.4, 0.7',
  },
  {
    id: '3Detents02_04_10',
    detents: [0.2, 0.4, 1.0],
    label: '3 Detents: 0.2, 0.4, 1.0',
  },
] as const;

type StackParamList = {
  Main: undefined;
} & {
  [K in (typeof TEST_CASES)[number]['id'] as `${K}_OverflowEnabled`]: undefined;
} & {
  [K in (typeof TEST_CASES)[number]['id'] as `${K}_OverflowDisabled`]: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

function Main({
  navigation,
}: {
  navigation: NativeStackNavigationProp<StackParamList>;
}) {
  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {TEST_CASES.map(test => (
        <View key={test.id} style={{ marginBottom: 16 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>
            {test.label}
          </Text>
          <Button
            title="Overflow ENABLED"
            onPress={() => navigation.navigate(`${test.id}_OverflowEnabled`)}
          />
          <View style={{ height: 8 }} />
          <Button
            title="Overflow DISABLED"
            color="gray"
            onPress={() =>
              navigation.navigate(`${test.id}_OverflowDisabled` as any)
            }
          />
        </View>
      ))}
    </ScrollView>
  );
}

function Footer() {
  return (
    <View
      style={{
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.PurpleDark40,
        borderBottomColor: Colors.PurpleDark140,
        borderBottomWidth: 5,
      }}>
      <Text>Footer</Text>
    </View>
  );
}

function FormSheetBase() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={{ bottom: true }}>
      <View style={{ flex: 1, justifyContent: 'space-between'}}>
        <View style={{padding: 20}}>
          <Text style={{ marginBottom: 10 }}>Content Area</Text>
          <TextInput
            style={{ borderWidth: 1, height: 40, paddingHorizontal: 8 }}
            placeholder="placeholder"
          />
        </View>
        <Footer />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={Main} />
        {TEST_CASES.flatMap(test => [
          <Stack.Screen
            key={`${test.id}_on`}
            name={`${test.id}_OverflowEnabled`}
            component={FormSheetBase}
            options={{
              presentation: 'formSheet',
              headerShown: false,
              contentStyle: { backgroundColor: Colors.GreenLight100 },
              sheetShouldOverflowTopInset: true,
              sheetAllowedDetents: test.detents as any,
            }}
          />,
          <Stack.Screen
            key={`${test.id}_off`}
            name={`${test.id}_OverflowDisabled`}
            component={FormSheetBase}
            options={{
              presentation: 'formSheet',
              headerShown: false,
              contentStyle: { backgroundColor: Colors.GreenLight100 },
              sheetShouldOverflowTopInset: false,
              sheetAllowedDetents: test.detents as any,
            }}
          />,
        ])}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
