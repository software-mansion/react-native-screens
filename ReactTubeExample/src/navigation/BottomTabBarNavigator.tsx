import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import useAccountData from "../hooks/account/useAccountData";
import SubscriptionScreen from "../screens/SubscriptionScreen";
import LibraryScreen from "../screens/LibraryScreen";

export type RootBottomTabParamList = {
  HomeFeed: undefined;
  SearchScreen: undefined;
  Subscriptions: undefined;
  Library: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootBottomTabParamList>();

export default function BottomTabBarNavigator() {
  const {loginData} = useAccountData();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          if (route.name === "HomeFeed") {
            iconName = "home";
          } else if (route.name === "Settings") {
            iconName = focused ? "ios-list" : "ios-list-outline";
          } else if (route.name === "Subscriptions") {
            return (
              <MaterialIcons name={"subscriptions"} size={size} color={color} />
            );
          } else if (route.name === "Library") {
            iconName = "ios-library-outline";
          }

          // You can return any component that you like here!
          // @ts-ignore
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}>
      <Tab.Screen
        name="HomeFeed"
        component={HomeScreen}
        options={{title: "Home"}}
      />
      {loginData.accounts.length > 0 ? (
        <>
          <Tab.Screen name="Subscriptions" component={SubscriptionScreen} />
          <Tab.Screen name="Library" component={LibraryScreen} />
        </>
      ) : null}
      <Tab.Screen
        name="Settings"
        // @ts-ignore
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
}
