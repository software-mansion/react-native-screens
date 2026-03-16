import * as React from "react";
import { ScrollView, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const ArticleScreen = () => {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Text style={{ fontSize: 30 }}>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry&apos;s standard dummy text
        ever since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
        Contrary to popular belief, Lorem Ipsum is not simply random text. It
        has roots in a piece of classical Latin literature from 45 BC, making it
        over 2000 years old. Richard McClintock, a Latin professor at
        Hampden-Sydney College in Virginia, looked up one of the more obscure
        Latin words, consectetur, from a Lorem Ipsum passage, and going through
        the cites of the word in classical literature, discovered the
        undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33
        of &quot;de Finibus Bonorum et Malorum&quot; (The Extremes of Good and
        Evil) by Cicero, written in 45 BC. This book is a treatise on the theory
        of ethics, very popular during the Renaissance. The first line of Lorem
        Ipsum, &quot;Lorem ipsum dolor sit amet..&quot;, comes from a line in
        section 1.10.32.
      </Text>
    </ScrollView>
  );
}

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Article"
            component={ArticleScreen}
            options={{
              headerTransparent: true,
              headerBlurEffect: "extraLight",
              headerLargeTitle: true
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
