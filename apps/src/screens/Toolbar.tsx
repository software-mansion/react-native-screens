import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const demoScreens = [
  { name: 'BasicButtons', title: 'Basic Buttons' },
  { name: 'FlexibleSpace', title: 'Flexible Space' },
  { name: 'MenuItems', title: 'Menu Items' },
  { name: 'SfSymbols', title: 'SF Symbols' },
  { name: 'DisabledItems', title: 'Disabled Items' },
  { name: 'FixedSpacing', title: 'Fixed Spacing' },
  { name: 'DynamicItems', title: 'Dynamic Items' },
];

const MainScreen = ({ navigation }: any) => (
  <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ flex: 1 }}>
    <View style={{ padding: 8 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
        iOS only
      </Text>
    </View>
    {demoScreens.map(screen => (
      <Button
        key={screen.name}
        onPress={() => navigation.navigate(screen.name)}
        title={screen.title}
      />
    ))}
  </ScrollView>
);

const DemoContent = () => (
  <ScrollView style={{ flex: 1 }} contentInsetAdjustmentBehavior="automatic">
    <View style={{ width: '100%', height: 200, backgroundColor: '#333' }} />
    <View style={{ width: '100%', height: 200, backgroundColor: '#888' }} />
    <View style={{ width: '100%', height: 600, backgroundColor: '#eee' }} />
  </ScrollView>
);

const DynamicItemsScreen = ({ navigation }: any) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      title: `Dynamic Items (${count})`,
      // @ts-ignore
      unstable_toolbarItems: () => [
        {
          type: 'button',
          icon: { type: 'sfSymbol', name: 'minus' },
          disabled: count === 0,
          onPress: () => setCount(c => Math.max(0, c - 1)),
        },
        { type: 'flexibleSpace' },
        {
          type: 'button',
          label: String(count),
          onPress: () => setCount(0),
        },
        { type: 'flexibleSpace' },
        {
          type: 'button',
          icon: { type: 'sfSymbol', name: 'plus' },
          onPress: () => setCount(c => c + 1),
        },
      ],
    });
  }, [count, navigation]);

  return <DemoContent />;
};

export default function ToolbarExample() {
  return (
    // @ts-ignore
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{ title: 'Toolbar Demos' }}
      />

      <Stack.Screen
        name="BasicButtons"
        component={DemoContent}
        options={{
          title: 'Basic Buttons',
          // @ts-ignore
          unstable_toolbarItems: () => [
            {
              type: 'button',
              label: 'Share',
              onPress: () => Alert.alert('Share pressed'),
            },
            {
              type: 'button',
              label: 'Edit',
              onPress: () => Alert.alert('Edit pressed'),
            },
            {
              type: 'button',
              label: 'Delete',
              tintColor: 'red',
              onPress: () => Alert.alert('Delete pressed'),
            },
          ],
        }}
      />

      <Stack.Screen
        name="FlexibleSpace"
        component={DemoContent}
        options={{
          title: 'Flexible Space',
          // @ts-ignore
          unstable_toolbarItems: () => [
            {
              type: 'button',
              label: 'Left',
              onPress: () => Alert.alert('Left pressed'),
            },
            { type: 'flexibleSpace' },
            {
              type: 'button',
              label: 'Right',
              onPress: () => Alert.alert('Right pressed'),
            },
          ],
        }}
      />

      <Stack.Screen
        name="MenuItems"
        component={DemoContent}
        options={{
          title: 'Menu Items',
          // @ts-ignore
          unstable_toolbarItems: () => [
            { type: 'flexibleSpace' },
            {
              type: 'menu',
              label: 'Sort',
              menu: {
                items: [
                  {
                    type: 'action',
                    label: 'By Name',
                    onPress: () => Alert.alert('Sort by Name'),
                  },
                  {
                    type: 'action',
                    label: 'By Date',
                    onPress: () => Alert.alert('Sort by Date'),
                  },
                  {
                    type: 'action',
                    label: 'By Size',
                    onPress: () => Alert.alert('Sort by Size'),
                  },
                ],
              },
            },
          ],
        }}
      />

      <Stack.Screen
        name="SfSymbols"
        component={DemoContent}
        options={{
          title: 'SF Symbols',
          // @ts-ignore
          unstable_toolbarItems: () => [
            {
              type: 'button',
              icon: { type: 'sfSymbol', name: 'square.and.arrow.up' },
              onPress: () => Alert.alert('Share pressed'),
            },
            { type: 'flexibleSpace' },
            {
              type: 'button',
              icon: { type: 'sfSymbol', name: 'star' },
              onPress: () => Alert.alert('Favorite pressed'),
            },
            {
              type: 'button',
              icon: { type: 'sfSymbol', name: 'trash' },
              tintColor: 'red',
              onPress: () => Alert.alert('Delete pressed'),
            },
          ],
        }}
      />

      <Stack.Screen
        name="DisabledItems"
        component={DemoContent}
        options={{
          title: 'Disabled Items',
          // @ts-ignore
          unstable_toolbarItems: () => [
            {
              type: 'button',
              label: 'Enabled',
              onPress: () => Alert.alert('Enabled pressed'),
            },
            {
              type: 'button',
              label: 'Disabled',
              disabled: true,
              onPress: () => Alert.alert('Should not fire'),
            },
            { type: 'flexibleSpace' },
            {
              type: 'button',
              icon: { type: 'sfSymbol', name: 'checkmark' },
              disabled: true,
              onPress: () => Alert.alert('Should not fire'),
            },
          ],
        }}
      />

      <Stack.Screen
        name="FixedSpacing"
        component={DemoContent}
        options={{
          title: 'Fixed Spacing',
          // @ts-ignore
          unstable_toolbarItems: () => [
            {
              type: 'button',
              label: 'A',
              onPress: () => Alert.alert('A pressed'),
            },
            { type: 'spacing', spacing: 32 },
            {
              type: 'button',
              label: 'B',
              onPress: () => Alert.alert('B pressed'),
            },
            { type: 'flexibleSpace' },
            {
              type: 'button',
              label: 'C',
              onPress: () => Alert.alert('C pressed'),
            },
          ],
        }}
      />

      <Stack.Screen
        name="DynamicItems"
        component={DynamicItemsScreen}
        options={{ title: 'Dynamic Items (0)' }}
      />
    </Stack.Navigator>
  );
}
