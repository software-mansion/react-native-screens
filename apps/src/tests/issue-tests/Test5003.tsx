import React, { useLayoutEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';

type Routes = { Home: undefined; Items: undefined };
const Stack = createNativeStackNavigator<Routes>();

/** Root screen: pushes the screen with header items. */
function Home({ navigation }: NativeStackScreenProps<Routes, 'Home'>) {
  return (
    <View style={styles.content}>
      <Button
        testID="push-items"
        title="Push screen with header items"
        onPress={() => navigation.push('Items')}
      />
    </View>
  );
}

/** A custom (React element) header item. */
function Badge() {
  return <Text style={styles.badge}>custom</Text>;
}

/**
 * iOS 26: switching between [Edit] and [Delete, Done] must morph the Liquid Glass
 * (UIKit matches the items by `identifier`). A title-only change must not animate
 * the items. Custom (React element) items must keep rendering.
 */
function Items({ navigation }: NativeStackScreenProps<Routes, 'Items'>) {
  const [editing, setEditing] = useState(false);
  const [custom, setCustom] = useState(false);
  const [count, setCount] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Items (${count})`,
      unstable_headerRightItems: () => [
        ...(custom ? [{ type: 'custom' as const, element: <Badge /> }] : []),
        ...(editing
          ? [
              {
                type: 'button' as const,
                label: 'Delete',
                icon: { type: 'sfSymbol' as const, name: 'trash' as const },
                identifier: 'delete',
                onPress: () => {},
              },
              {
                type: 'button' as const,
                label: 'Done',
                variant: 'done' as const,
                identifier: 'done',
                onPress: () => setEditing(false),
              },
            ]
          : [
              {
                type: 'button' as const,
                label: 'Edit',
                identifier: 'edit',
                onPress: () => setEditing(true),
              },
            ]),
      ],
    });
  }, [navigation, editing, custom, count]);

  return (
    <View style={styles.content}>
      <Text>
        Toggle edit mode: on iOS 26 the header items must morph, not jump.
        Changing the title must not animate the items.
      </Text>
      <Button
        testID="toggle-edit"
        title={editing ? 'Leave edit mode' : 'Enter edit mode'}
        onPress={() => setEditing(value => !value)}
      />
      <Button
        testID="toggle-custom"
        title={custom ? 'Remove custom item' : 'Add custom item'}
        onPress={() => setCustom(value => !value)}
      />
      <Button
        testID="change-title"
        title="Change title only"
        onPress={() => setCount(value => value + 1)}
      />
    </View>
  );
}

/** Reproduction for #5003. */
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Items" component={Items} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: 24, gap: 16 },
  badge: {
    fontSize: 13,
    fontWeight: '600',
    color: '#007aff',
    paddingHorizontal: 8,
  },
});
