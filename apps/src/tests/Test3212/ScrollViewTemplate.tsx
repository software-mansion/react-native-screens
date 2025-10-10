import React from "react";
import { Button, ScrollView, Text } from "react-native";
import { useScrollEdgeEffectsConfigContext } from "./context";

export function ScrollViewTemplate() {
  const emoji = ['😎', '🍏', '👀', '🤖', '👾', '👨‍💻'];
  const { setConfig }  = useScrollEdgeEffectsConfigContext();

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button title="Set effects to hidden" onPress={() => {
        setConfig({ bottom: 'hidden', top: 'hidden', left: 'hidden', right: 'hidden' });
      }}/>
      <Text style={{ fontSize: 21 }}>
        {Array.from({ length: 1000 }).map(_ => emoji[Math.floor(Math.random() * emoji.length)])}
      </Text>
    </ScrollView>
  );
}
