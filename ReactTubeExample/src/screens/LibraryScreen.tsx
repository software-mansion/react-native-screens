import React from "react";
import {Platform, Text, View} from "react-native";
import GridView from "../components/GridView";
import useLibrary from "../hooks/useLibrary";
import {createDrawerNavigator} from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

function LibraryScreen() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      defaultStatus={"open"}
      screenOptions={{
        drawerType: Platform.isTV ? "permanent" : undefined,
      }}>
      <Drawer.Screen name="Home" component={LibraryDrawerItem} />
      <Drawer.Screen name="Notifications" component={LibraryDrawerItem} />
    </Drawer.Navigator>
  );
}

export default function LibraryDrawerItem() {
  const {content, fetchMore} = useLibrary();

  return (
    <View>
      <Text>Library</Text>
      <GridView
        shelfItem={content}
        onEndReached={() => fetchMore().catch(console.warn)}
      />
    </View>
  );
}
