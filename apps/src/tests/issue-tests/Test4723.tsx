import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';

type ParamList = {
  Home: undefined;
  Sheet: undefined;
  Undimmed: undefined;
  StackedSheet: undefined;
};

const Stack = createNativeStackNavigator<ParamList>();

function Home({ navigation }: NativeStackScreenProps<ParamList, 'Home'>) {
  return (
    <View style={styles.screen} testID="test4723-home">
      <Text style={styles.title}>Home screen, behind the sheet</Text>
      <Text style={styles.description}>
        Turn on TalkBack and open a sheet.{'\n'}
        Expected: focus lands on the heading, the dimmed area is not a focus
        stop, touching the heading keeps focus on it and a double tap leaves the
        sheet open.{'\n'}
        Undimmed sheet: at the low detent the home screen stays reachable, at
        the high detent it does not.{'\n'}
        Stacked sheet: swiping through the top sheet must not reach the lower
        sheet's backdrop.
      </Text>
      <Button
        title="Open form sheet"
        testID="test4723-open-sheet"
        onPress={() => navigation.navigate('Sheet')}
      />
      <Button
        title="Open undimmed sheet"
        testID="test4723-open-undimmed"
        onPress={() => navigation.navigate('Undimmed')}
      />
    </View>
  );
}

function Sheet({
  navigation,
  route,
}: NativeStackScreenProps<ParamList, 'Sheet' | 'Undimmed' | 'StackedSheet'>) {
  return (
    <View style={styles.sheet} testID={`test4723-${route.name}`}>
      <Text accessibilityRole="header" style={styles.heading}>
        {route.name} heading
      </Text>
      <Button title="Disabled action" disabled onPress={() => {}} />
      {route.name !== 'StackedSheet' && (
        <Button
          title="Open sheet on top"
          testID="test4723-open-stacked"
          onPress={() => navigation.navigate('StackedSheet')}
        />
      )}
      <Button
        title="Close"
        testID="test4723-close"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

export default function Test4723() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Sheet"
          component={Sheet}
          options={{
            presentation: 'formSheet',
            headerShown: false,
            sheetAllowedDetents: [0.55],
          }}
        />
        <Stack.Screen
          name="Undimmed"
          component={Sheet}
          options={{
            presentation: 'formSheet',
            headerShown: false,
            sheetAllowedDetents: [0.4, 0.9],
            sheetLargestUndimmedDetentIndex: 0,
          }}
        />
        <Stack.Screen
          name="StackedSheet"
          component={Sheet}
          options={{
            presentation: 'formSheet',
            headerShown: false,
            sheetAllowedDetents: [0.75],
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 16,
    backgroundColor: '#fff',
  },
  sheet: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111',
  },
  description: {
    fontSize: 16,
    color: '#444',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
