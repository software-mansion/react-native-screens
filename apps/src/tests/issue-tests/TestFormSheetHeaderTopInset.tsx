// On Android, a form sheet is not drawn under the status bar, so no header in
// it should be padded by the status bar's height: neither the sheet's own
// header, nor the first visible header of a stack nested in it.
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';

type RootRoutes = {
  Home: undefined;
  SheetWithHeader: undefined;
  SheetWithNestedStack: undefined;
};
type NestedRoutes = {
  First: undefined;
  Second: undefined;
};

const RootStack = createNativeStackNavigator<RootRoutes>();
const NestedStack = createNativeStackNavigator<NestedRoutes>();

const SHEET_OPTIONS = {
  presentation: 'formSheet',
  sheetAllowedDetents: [0.5, 0.97],
  sheetGrabberVisible: true,
  contentStyle: { flex: 1 },
} as const;

function Home({ navigation }: NativeStackScreenProps<RootRoutes, 'Home'>) {
  return (
    <View style={styles.content}>
      <Text>
        Open a sheet and expand it. The header must sit at the top of the sheet,
        with no blank band (the height of the status bar) above its title.
      </Text>
      <Button
        testID="open-sheet-with-header"
        title="Open sheet with its own header"
        onPress={() => navigation.navigate('SheetWithHeader')}
      />
      <Button
        testID="open-sheet-with-nested-stack"
        title="Open sheet with a nested stack"
        onPress={() => navigation.navigate('SheetWithNestedStack')}
      />
    </View>
  );
}

function SheetContent() {
  return (
    <View style={[styles.content, styles.sheetContent]}>
      <Text>The header above must have no padding on top.</Text>
    </View>
  );
}

function First({ navigation }: NativeStackScreenProps<NestedRoutes, 'First'>) {
  return (
    <View style={[styles.content, styles.sheetContent]}>
      <Text>The header above must have no padding on top.</Text>
      <Button
        testID="push-second"
        title="Push second screen"
        onPress={() => navigation.push('Second')}
      />
    </View>
  );
}

function SheetWithNestedStack() {
  return (
    <NestedStack.Navigator>
      <NestedStack.Screen name="First" component={First} />
      <NestedStack.Screen name="Second" component={SheetContent} />
    </NestedStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Home" component={Home} />
        <RootStack.Screen
          name="SheetWithHeader"
          component={SheetContent}
          options={{ ...SHEET_OPTIONS, title: 'Sheet header' }}
        />
        <RootStack.Screen
          name="SheetWithNestedStack"
          component={SheetWithNestedStack}
          options={{ ...SHEET_OPTIONS, headerShown: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 16,
    padding: 16,
  },
  sheetContent: {
    backgroundColor: '#e0e0ff',
  },
});
