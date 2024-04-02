import {Platform, View} from "react-native";
import React, {useState} from "react";
import Drawer from "../navigation/Drawer";
import DrawerContextProvider from "../navigation/DrawerContext";
import DrawerStackNavigator from "../navigation/DrawerStackNavigator";
import BottomTabBarNavigator from "../navigation/BottomTabBarNavigator";

export default function HomeWrapperScreen() {
  if (Platform.isTV) {
    return <TVVariant />;
  } else {
    return <DeviceVariant />;
  }
}

function TVVariant() {
  const [open, setOpen] = useState(false);

  return (
    <View style={{flexDirection: "row", flex: 1}}>
      <DrawerContextProvider onScreenFocused={() => setOpen(false)}>
        <Drawer
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
        />
        <DrawerStackNavigator />
      </DrawerContextProvider>
    </View>
  );
}

function DeviceVariant() {
  return <BottomTabBarNavigator />;
}
