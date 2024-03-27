import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {Icon} from "@rneui/base";

interface Props {
  color?: string;
  text?: string;
}

export default function ErrorComponent({text}: Props) {
  return (
    <View style={styles.container}>
      <Icon name={"warning"} color={"yellow"} size={250} />
      <Text style={styles.textStyle}>{text ?? "Unknown Error happened!"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    color: "yellow",
    fontSize: 40,
    marginTop: 25,
  },
});
