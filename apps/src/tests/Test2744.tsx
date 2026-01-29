import React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, View, ScrollView } from 'react-native';

type StackRouteParamList = {
  Home: undefined;
  SearchAlways: undefined;
  SearchCollapse: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<StackRouteParamList>;

const SearchAlways = ({navigation}: StackNavigationProp) => {
  return <ScrollView contentInsetAdjustmentBehavior='automatic'>
    <Button onPress={() => navigation.pop()} title='Go back'/>
  </ScrollView>
}

const SearchCollapse = ({navigation}: StackNavigationProp) => {
  return <ScrollView contentInsetAdjustmentBehavior='automatic'>
    <Button onPress={() => navigation.pop()} title='Go back'/>
  </ScrollView>
}

const Home = ({navigation}: StackNavigationProp) =>
  <View>
    <Button onPress={() => navigation.push("SearchAlways")} title='showAsAction=always'/>
    <Button onPress={() => navigation.push("SearchCollapse")} title='showAsAction=collapse'/>
  </View>

const Stack = createNativeStackNavigator<StackRouteParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
        />
        <Stack.Screen
          name="SearchAlways"
          component={SearchAlways}
          options={{
            title: "showAsAction=default",
            headerSearchBarOptions: {}
          }}
        />
        <Stack.Screen
          name="SearchCollapse"
          component={SearchCollapse}
          options={{
            title: "showAsAction=collapse",
            headerSearchBarOptions: {
              showAsAction: "collapse"
            }
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
