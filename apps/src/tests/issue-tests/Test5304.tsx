import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-screens/experimental';

type ParamList = {
  Home: undefined;
  SafeAreaSheet: undefined;
  StaticSheet: undefined;
};

const Stack = createNativeStackNavigator<ParamList>();

const SHEET_OPTIONS = {
  presentation: 'formSheet',
  sheetAllowedDetents: 'fitToContents',
  headerShown: false,
} as const;

function Home({ navigation }: NativeStackScreenProps<ParamList, 'Home'>) {
  return (
    <View style={styles.screen} testID="test5304-home">
      <Text style={styles.description}>
        Open each sheet on an iPhone with a home indicator.{'\n'}
        Expected: the dimming fades in evenly over the whole screen.{'\n'}
        Bug: with the SafeAreaView sheet, the dimming grows from the top left
        corner, because its inset changes the content height while the sheet is
        being presented.{'\n'}
        Grow and Shrink still animate the sheet height once it is presented.
      </Text>
      {Array.from({ length: 5 }).map((_, i) => (
        <View key={i} style={styles.row} />
      ))}
      <Button
        title="Open sheet with SafeAreaView"
        testID="test5304-open-safe-area"
        onPress={() => navigation.navigate('SafeAreaSheet')}
      />
      <Button
        title="Open static sheet"
        testID="test5304-open-static"
        onPress={() => navigation.navigate('StaticSheet')}
      />
    </View>
  );
}

function Sheet({
  navigation,
  route,
}: NativeStackScreenProps<ParamList, 'SafeAreaSheet' | 'StaticSheet'>) {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <View style={styles.sheet}>
      {route.name === 'SafeAreaSheet' && (
        <SafeAreaView edges={{ bottom: true }} style={styles.inset} />
      )}
      <Text style={styles.heading}>{route.name}</Text>
      {expanded && <View style={styles.extra} />}
      <Button
        title={expanded ? 'Shrink' : 'Grow'}
        testID="test5304-toggle"
        onPress={() => setExpanded(value => !value)}
      />
      <Button
        title="Close"
        testID="test5304-close"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

export default function Test5304() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="SafeAreaSheet"
          component={Sheet}
          options={SHEET_OPTIONS}
        />
        <Stack.Screen
          name="StaticSheet"
          component={Sheet}
          options={SHEET_OPTIONS}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    gap: 8,
    backgroundColor: '#f2f2f7',
  },
  description: {
    marginBottom: 8,
  },
  row: {
    height: 44,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  sheet: {
    alignItems: 'center',
    gap: 16,
    padding: 32,
  },
  inset: {
    flex: 0,
  },
  extra: {
    width: 200,
    height: 120,
    backgroundColor: '#ddd',
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
  },
});
