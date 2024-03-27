import React from "react";
import {StyleSheet, View} from "react-native";
import {useAppStyle} from "../context/AppStyleContext";

interface Props {
  children: React.ReactNode;
}

export default function BackgroundWrapper({children}: Props) {
  const {style} = useAppStyle();

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {backgroundColor: style.backgroundColor},
      ]}>
      {children}
    </View>
  );
}
