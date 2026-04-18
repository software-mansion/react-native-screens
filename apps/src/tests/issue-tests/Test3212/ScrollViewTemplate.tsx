import React from "react";
import { Button, ScrollView, Text } from "react-native";
import { ScrollViewMarker } from "react-native-screens/experimental";
import { useScrollEdgeEffectsConfigContext } from "./context";

export function ScrollViewTemplate() {
  const emoji = ['😎', '🍏', '👀', '🤖', '👾', '👨‍💻'];
  const { config, setConfig } = useScrollEdgeEffectsConfigContext();

  return (
    <ScrollViewMarker style={{ flex: 1 }} scrollEdgeEffects={config}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Button title="Set effects to hidden" onPress={() => {
          setConfig({ bottom: 'hidden', top: 'hidden', left: 'hidden', right: 'hidden' });
        }}/>
        <Text style={{ fontSize: 21 }}>
          {Array.from({ length: 1000 }).map(_ => emoji[Math.floor(Math.random() * emoji.length)])}
        </Text>
      </ScrollView>
    </ScrollViewMarker>
  );
}
