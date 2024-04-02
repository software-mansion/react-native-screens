import React from "react";
import {ActivityIndicator, StyleSheet, View} from "react-native";

export default function LoadingComponent() {
  return (
    <View
      style={[
        StyleSheet.absoluteFillObject,
        {justifyContent: "center", alignItems: "center"},
      ]}>
      <ActivityIndicator size={"large"} />
    </View>
  );
}
