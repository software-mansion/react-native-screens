import { NavigationContainer, RouteProp } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

type RouteParamList = {
  Home: undefined;
  FormSheet: undefined;
};

type RouteProps<RouteName extends keyof RouteParamList> = {
  navigation: NativeStackNavigationProp<RouteParamList, RouteName>;
  route: RouteProp<RouteParamList, RouteName>;
};

const Stack = createNativeStackNavigator<RouteParamList>();

function Home({ navigation }: RouteProps<'Home'>) {
  return (
    <View style={styles.home}>
      <Text style={styles.instructions}>
        Turn on TalkBack and open the form sheet. Touch the heading or the
        disabled button in the sheet: it should be announced and keep
        accessibility focus. Before the fix, focus then moves to the dimmed area
        behind the sheet, and a double-tap closes the sheet.
      </Text>
      <Button
        title="Open form sheet"
        onPress={() => navigation.navigate('FormSheet')}
      />
    </View>
  );
}

function FormSheet({ navigation }: RouteProps<'FormSheet'>) {
  return (
    <View style={styles.sheet}>
      <Text accessibilityRole="header" style={styles.heading}>
        Sheet heading
      </Text>
      <Button title="Disabled action" disabled onPress={() => {}} />
      <Button title="Close" onPress={() => navigation.goBack()} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="FormSheet"
          component={FormSheet}
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: [0.55],
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    gap: 16,
  },
  instructions: {
    fontSize: 16,
  },
  sheet: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
