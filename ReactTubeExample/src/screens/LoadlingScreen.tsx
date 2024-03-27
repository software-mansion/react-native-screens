import React from "react";
import {Platform, StyleSheet, Text, View} from "react-native";
import FastImage from "react-native-fast-image";

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <FastImage
        style={[styles.logo, Platform.isTV ? styles.logoTV : undefined]}
        source={require("../../assets/icon-512-maskable.png")}
      />
      <Text style={[styles.text, Platform.isTV ? styles.textTV : undefined]}>
        ReactTube
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    borderRadius: 25,
    width: 200,
    height: 200,
  },
  logoTV: {
    height: 400,
    width: 400,
  },
  text: {
    marginTop: 10,
    fontSize: 20,
    color: "white",
  },
  textTV: {
    fontSize: 28,
    marginTop: 20,
  },
});
