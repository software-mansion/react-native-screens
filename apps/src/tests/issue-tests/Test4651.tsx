import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Button, Pressable, ScrollView, Text, View } from 'react-native';
import { Colors } from '@apps/shared/styling';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/4651
//
// A formSheet whose ScrollView is the screen's only child is replaced by a pushed
// screen whose ScrollView is also the screen's only child and has its content at
// mount. The pushed screen's UIScrollView ends up sized to the sheet's detent
// (half the screen): the rows below the fold are neither painted nor tappable and
// the list does not scroll. "Push Detail directly" shows the same screen at full
// height, so the sheet dismissal is what breaks it.

type StackParamList = {
  Home: undefined;
  FormSheet: undefined;
  Detail: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

type StackNavigationProp = NativeStackNavigationProp<StackParamList>;

const SCROLL_ROW_COUNT = 40;

function Home({ navigation }: { navigation: StackNavigationProp }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        backgroundColor: Colors.White,
      }}>
      <Button
        title="Open FormSheet"
        onPress={() => navigation.navigate('FormSheet')}
        testID="home-open-form-sheet"
      />
      <Button
        title="Push Detail directly"
        onPress={() => navigation.navigate('Detail')}
        testID="home-push-detail"
      />
    </View>
  );
}

function FormSheetScreen({ navigation }: { navigation: StackNavigationProp }) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.GreenLight100 }}
      contentContainerStyle={{ padding: 16, paddingTop: 72 }}>
      {['1', '2'].map(id => (
        <Pressable
          key={id}
          onPress={() => {
            navigation.goBack();
            navigation.navigate('Detail');
          }}
          style={{ paddingVertical: 16 }}
          testID={`form-sheet-row-${id}`}>
          <Text style={{ fontSize: 17 }}>Open Detail (row {id})</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function DetailScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.PurpleLight100 }}
      contentContainerStyle={{ gap: 12, padding: 16 }}
      contentInsetAdjustmentBehavior="automatic">
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Detail</Text>
      {[...Array(SCROLL_ROW_COUNT).keys()].map(index => (
        <Text key={index}>Scroll row {index}</Text>
      ))}
      <View style={{ borderWidth: 1, padding: 16, borderRadius: 12 }}>
        <Text>Bottom row</Text>
      </View>
    </ScrollView>
  );
}

export default function Test4651() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: true, headerTransparent: true }}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="FormSheet"
          component={FormSheetScreen}
          options={{
            title: 'Sheet',
            presentation: 'formSheet',
            sheetAllowedDetents: [0.5],
            sheetGrabberVisible: true,
          }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: 'Detail' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
