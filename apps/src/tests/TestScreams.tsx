import React, { useEffect, useState } from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, Text, View, ScrollView } from 'react-native';
import { ScrollView as RNGHScrollView } from 'react-native-gesture-handler';

type StackRouteParamList = {
  Home: undefined;
  FitToContentNot: undefined;
  NestedNasty: undefined;
  RNGHSteals: undefined;
  NavBack: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<StackRouteParamList>;

const Stack = createNativeStackNavigator<StackRouteParamList>();

function RNGHSteals({ navigation }: StackNavigationProp) {
  return (
    <RNGHScrollView
      style={{ height: 400 }}
      contentContainerStyle={{ flexGrow: 1, paddingTop: 80 }}
      nestedScrollEnabled>
      <Button title="back" onPress={navigation.goBack} />
      <View
        style={{ height: 2000, width: '100%', backgroundColor: 'lightgreen' }}
      />
    </RNGHScrollView>
  );
}

function NestedNasty() {
  return (
    <View
      style={{
        height: 600,
      }}>
      <View style={{ height: 50, backgroundColor: 'black' }} />
      <ScrollView
        style={{ flex: 1, backgroundColor: 'lightblue' }}
        contentContainerStyle={{ flexGrow: 1 }}
        nestedScrollEnabled>
        <View style={{ height: 50, backgroundColor: 'yellow' }} />
        <ScrollView
          style={{ height: 100, backgroundColor: 'lightgreen' }}
          contentContainerStyle={{
            height: 100,
          }}
          nestedScrollEnabled>
          <View style={{ height: 100, backgroundColor: 'red' }} />
        </ScrollView>
        <View style={{ height: 300, backgroundColor: 'yellow' }} />
      </ScrollView>
    </View>
  );
}

function FitToContentNot() {
    const [height, setHeight] = useState(100);
    useEffect(() => {
      setTimeout(() => {
        setHeight(500);
      }, 800);
    });

    return (
      <View
        style={{
          height: height,
          backgroundColor: 'lightblue',
        }}
      />
    );
  }

function Home({ navigation }: StackNavigationProp) {
  return (
    <View>
      <Button
        title="FitToContentNot"
        onPress={() => navigation.navigate('FitToContentNot')}
      />
      <Button
        title="NestedNasty"
        onPress={() => navigation.navigate('NestedNasty')}
      />
      <Button title="NavBack" onPress={() => navigation.navigate('NavBack')} />
      <Button
        title="RNGHSteals"
        onPress={() => navigation.navigate('RNGHSteals')}
      />
    </View>
  );
}

function NavBack() {
    return (
      <View style={{ padding: 24, gap: 8 }}>
        <Text>
          Simply put your finger _above_ the formSheet container and make a
          confident swipe back right after.
        </Text>

        <Text>
          The bug that will happen is that both the formSheet will get closed (due
          to a touch gesture onto the backdrop) and a navigation back (due to
          Androids nav system).
        </Text>
      </View>
    );
  }

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="FitToContentNot"
          options={{
            presentation: 'formSheet',
            gestureDirection: 'vertical',
            animation: 'slide_from_bottom',
            sheetAllowedDetents: 'fitToContents',
          }}
          component={FitToContentNot}
        />
        <Stack.Screen
          name="NestedNasty"
          options={{
            presentation: 'formSheet',
            animation: 'slide_from_bottom',
            sheetAllowedDetents: 'fitToContents',
          }}
          component={NestedNasty}
        />

        <Stack.Screen
          name="RNGHSteals"
          options={{
            presentation: 'formSheet',
            // headerShown: true,
            // animation: "slide_from_bottom",
            sheetAllowedDetents: 'fitToContents',
          }}
          component={RNGHSteals}
        />

        <Stack.Screen
          name="NavBack"
          options={{
            presentation: 'formSheet',
            headerShown: false,
            gestureDirection: 'vertical',
            animation: 'slide_from_bottom',
            sheetAllowedDetents: 'fitToContents',
          }}
          component={NavBack}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
