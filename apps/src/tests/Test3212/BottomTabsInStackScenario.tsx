import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { SCROLL_EDGE_EFFECT_DEFAULTS, ScrollEdgeEffects, ScrollEdgeEffectsConfigContext } from "./context";
import { NavigationContainer } from "@react-navigation/native";
import { ConfigWithNavigation } from "./Config";
import { BottomTabsScenario } from "./BottomTabsScenario";

export function BottomTabsInStackScenario() {
  const Stack = createNativeStackNavigator();
  const [config, setConfig] = useState<ScrollEdgeEffects>({ ...SCROLL_EDGE_EFFECT_DEFAULTS });

  return (
    <ScrollEdgeEffectsConfigContext.Provider value={{ config, setConfig }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          autoHideHomeIndicator: true,
        }}>
          <Stack.Screen name="Config" component={ConfigWithNavigation} />
          <Stack.Screen name="Test" component={BottomTabsScenario} options={{ scrollEdgeEffects: config, headerSearchBarOptions: {}, headerTransparent: true }} />
        </Stack.Navigator>
      </NavigationContainer>

    </ScrollEdgeEffectsConfigContext.Provider>
  );
}
