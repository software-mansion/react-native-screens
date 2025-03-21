import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

type RootStackRouteParamList = {
  RootTabNavHost: undefined;
  RootFormSheet: undefined;
}

type TabsRouteParamList = {
  TabsHome: undefined;
  TabsMore: undefined;
}

const RootStack = createNativeStackNavigator<RootStackRouteParamList>();
const Tabs = createBottomTabNavigator<TabsRouteParamList>();

function RootTabNavHost() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="TabsHome" component={TabsHome} />
      <Tabs.Screen name="TabsMore" component={TabsMore} listeners={({ route, navigation }) => {
        return {
          tabPress: event => {
            event.preventDefault();
            navigation.preload('TabsMore');
            navigation.navigate('RootFormSheet');
          },
        };
      }} />
    </Tabs.Navigator>
  );
}

function RootFormSheet() {
  return (
    <View style={{ flex: 1, backgroundColor: 'seagreen' }}>
      <Text>RootFormSheet</Text>
    </View>
  );
}

function TabsHome() {
  return (
    <View style={{ backgroundColor: 'crimson', flex: 1 }}>
      <Text>TabsHome</Text>
    </View>
  );
}

function TabsMore() {
  return (
    <View style={{ backgroundColor: 'blue', flex: 1 }}>
      <Text>TabsMore</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="RootTabNavHost" component={RootTabNavHost} />
        <RootStack.Screen name="RootFormSheet" component={RootFormSheet} options={{
          presentation: 'formSheet',
          sheetCornerRadius: 12,
          sheetAllowedDetents: [0.54, 1],
          headerShown: false,
          contentStyle: {
            width: '100%',
            height: '100%',
            backgroundColor: 'slateblue',
          },
        }} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
