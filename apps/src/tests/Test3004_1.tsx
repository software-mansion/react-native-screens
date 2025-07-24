// author: https://github.com/Ubax
// taken from https://snack.expo.dev/@jtkacz/juicy-red-salsa

import React from "react";
import { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { ScreenStack, ScreenStackItem } from "react-native-screens";

export default function App() {
  const [isModalScreenOpen, setIsModalScreenOpen] = useState(false);

  function HomeScreen() {
    return (
      <View style={styles.container}>
        <Text>Home Screen</Text>
        <Button
          title="Open modal screen"
          onPress={() => setIsModalScreenOpen(true)}
        />
      </View>
    );
  }

  function ModalScreen() {
    return (
      <View style={styles.container}>
        <Text>Modal Screen</Text>
        <Button
          title="Close modal screen"
          onPress={() => setIsModalScreenOpen(false)}
        />
      </View>
    );
  }

  return (
    <ScreenStack style={{ flex: 1 }}>
      <ScreenStackItem
        activityState={2}
        screenId="home"
        style={StyleSheet.absoluteFill}
        headerConfig={{
          title: "Home",
        }}
      >
        <HomeScreen />
      </ScreenStackItem>
      <ScreenStackItem
        activityState={isModalScreenOpen ? 2 : 0}
        screenId="modal"
        style={StyleSheet.absoluteFill}
        stackPresentation="modal"
        stackAnimation="slide_from_bottom"
        headerConfig={{
          title: "Modal",
        }}
        onDismissed={() => setIsModalScreenOpen(false)}
      >
        <ModalScreen />
      </ScreenStackItem>
    </ScreenStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
