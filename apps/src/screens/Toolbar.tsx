import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const demoScreens = [
  { name: 'BasicButtons', title: 'Basic Buttons' },
  { name: 'FlexibleSpace', title: 'Flexible Space' },
  { name: 'MenuItems', title: 'Menu Items' },
  { name: 'AdvancedMenus', title: 'Advanced Menus' },
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
        name="AdvancedMenus"
        component={DemoContent}
        options={{
          title: 'Advanced Menus',
          // @ts-ignore
          unstable_toolbarItems: () => [
            {
              type: 'menu',
              label: 'Format',
              icon: { type: 'sfSymbol', name: 'textformat' },
              menu: {
                title: 'Format',
                items: [
                  {
                    type: 'submenu',
                    label: 'Text Style',
                    icon: { type: 'sfSymbol', name: 'bold.italic.underline' },
                    items: [
                      {
                        type: 'action',
                        label: 'Bold',
                        icon: { type: 'sfSymbol', name: 'bold' },
                        onPress: () => Alert.alert('Bold'),
                      },
                      {
                        type: 'action',
                        label: 'Italic',
                        icon: { type: 'sfSymbol', name: 'italic' },
                        onPress: () => Alert.alert('Italic'),
                      },
                      {
                        type: 'action',
                        label: 'Underline',
                        icon: { type: 'sfSymbol', name: 'underline' },
                        onPress: () => Alert.alert('Underline'),
                      },
                      {
                        type: 'submenu',
                        label: 'More Styles',
                        items: [
                          {
                            type: 'action',
                            label: 'Strikethrough',
                            icon: { type: 'sfSymbol', name: 'strikethrough' },
                            onPress: () => Alert.alert('Strikethrough'),
                          },
                          {
                            type: 'action',
                            label: 'Subscript',
                            onPress: () => Alert.alert('Subscript'),
                          },
                          {
                            type: 'action',
                            label: 'Superscript',
                            onPress: () => Alert.alert('Superscript'),
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'submenu',
                    label: 'Alignment',
                    inline: true,
                    items: [
                      {
                        type: 'action',
                        label: 'Left',
                        icon: { type: 'sfSymbol', name: 'text.alignleft' },
                        onPress: () => Alert.alert('Align Left'),
                      },
                      {
                        type: 'action',
                        label: 'Center',
                        icon: { type: 'sfSymbol', name: 'text.aligncenter' },
                        onPress: () => Alert.alert('Align Center'),
                      },
                      {
                        type: 'action',
                        label: 'Right',
                        icon: { type: 'sfSymbol', name: 'text.alignright' },
                        onPress: () => Alert.alert('Align Right'),
                      },
                      {
                        type: 'action',
                        label: 'Justify',
                        icon: { type: 'sfSymbol', name: 'text.justify' },
                        onPress: () => Alert.alert('Justify'),
                      },
                    ],
                  },
                  {
                    type: 'submenu',
                    label: 'Danger Zone',
                    destructive: true,
                    inline: true,
                    items: [
                      {
                        type: 'action',
                        label: 'Clear Formatting',
                        destructive: true,
                        onPress: () => Alert.alert('Clear Formatting'),
                      },
                    ],
                  },
                ],
              },
            },
            { type: 'flexibleSpace' },
            {
              type: 'menu',
              label: 'View',
              icon: { type: 'sfSymbol', name: 'rectangle.grid.2x2' },
              menu: {
                title: 'View Options',
                items: [
                  {
                    type: 'submenu',
                    label: 'Layout',
                    inline: true,
                    items: [
                      {
                        type: 'action',
                        label: 'List',
                        icon: { type: 'sfSymbol', name: 'list.bullet' },
                        onPress: () => Alert.alert('List'),
                      },
                      {
                        type: 'action',
                        label: 'Grid',
                        icon: { type: 'sfSymbol', name: 'square.grid.2x2' },
                        onPress: () => Alert.alert('Grid'),
                      },
                      {
                        type: 'action',
                        label: 'Columns',
                        icon: { type: 'sfSymbol', name: 'rectangle.split.3x1' },
                        onPress: () => Alert.alert('Columns'),
                      },
                    ],
                  },
                  {
                    type: 'submenu',
                    label: 'Sort',
                    icon: { type: 'sfSymbol', name: 'arrow.up.arrow.down' },
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
                      {
                        type: 'submenu',
                        label: 'Direction',
                        icon: { type: 'sfSymbol', name: 'chevron.up.chevron.down' },
                        items: [
                          {
                            type: 'action',
                            label: 'Ascending',
                            icon: { type: 'sfSymbol', name: 'arrow.up' },
                            onPress: () => Alert.alert('Ascending'),
                          },
                          {
                            type: 'action',
                            label: 'Descending',
                            icon: { type: 'sfSymbol', name: 'arrow.down' },
                            onPress: () => Alert.alert('Descending'),
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'submenu',
                    label: 'Filter',
                    inline: true,
                    items: [
                      {
                        type: 'action',
                        label: 'Show Favorites',
                        icon: { type: 'sfSymbol', name: 'star' },
                        onPress: () => Alert.alert('Show Favorites'),
                      },
                      {
                        type: 'action',
                        label: 'Show Hidden',
                        icon: { type: 'sfSymbol', name: 'eye.slash' },
                        onPress: () => Alert.alert('Show Hidden'),
                      },
                    ],
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
