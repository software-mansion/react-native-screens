import React, { useCallback, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SCROLL_EDGE_EFFECT_DEFAULTS, ScrollEdgeEffects, ScrollEdgeEffectsConfigContext } from "./context";
import { ConfigWithNavigation } from "./Config";
import { NavigationContainer } from "@react-navigation/native";
import { StackScenario } from "./StackScenario";

export function StackInStackScenario() {
  const Stack = createNativeStackNavigator();
  const [config, setConfig] = useState<ScrollEdgeEffects>({ ...SCROLL_EDGE_EFFECT_DEFAULTS });

  const ConfigComponent = useCallback(() => <ConfigWithNavigation title='Outer Stack / scrollEdgeEffects:'/>, []);

  return (
    <ScrollEdgeEffectsConfigContext.Provider value={{ config, setConfig }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          autoHideHomeIndicator: true,
        }}>
          <Stack.Screen name="Config" component={ConfigComponent} />
          <Stack.Screen name="Test" component={StackScenario} options={{ scrollEdgeEffects: config, headerTransparent: true }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ScrollEdgeEffectsConfigContext.Provider>
  )
}
