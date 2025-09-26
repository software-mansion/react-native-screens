import React, { ScrollView, Text } from "react-native";

export function ScrollViewTemplate() {
  const emoji = ['😎', '🍏', '👀', '🤖', '👾', '👨‍💻'];

  return (
    <ScrollView>
      <Text style={{ fontSize: 21 }}>
        {Array.from({ length: 1000 }).map(_ => emoji[Math.floor(Math.random() * emoji.length)])}
      </Text>
    </ScrollView>
  );
}
