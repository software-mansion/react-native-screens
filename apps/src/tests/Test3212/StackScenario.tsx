import React from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ConfigWithNavigation } from "./Config";
import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { ScrollViewTemplate } from './ScrollViewTemplate';
import { SCROLL_EDGE_EFFECT_DEFAULTS, ScrollEdgeEffects, ScrollEdgeEffectsConfigContext } from './context';
import { useState } from 'react';

function ConfigComponent() {
  return (
    <ConfigWithNavigation title='Stack / scrollEdgeEffects:'/>
  );
}

export function StackScenario() {
  const Stack = createNativeStackNavigator();
  const [config, setConfig] = useState<ScrollEdgeEffects>({...SCROLL_EDGE_EFFECT_DEFAULTS});

  return (
    <NavigationIndependentTree>
      <ScrollEdgeEffectsConfigContext.Provider value={{ config, setConfig }}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{
            autoHideHomeIndicator: true,
          }}>
            <Stack.Screen name="Config" component={ConfigComponent} />
            <Stack.Screen name="Test" component={ScrollViewTemplate} options={{ scrollEdgeEffects: config, headerSearchBarOptions: {}, headerTransparent: true }} />
          </Stack.Navigator>
        </NavigationContainer>
      </ScrollEdgeEffectsConfigContext.Provider>
    </NavigationIndependentTree>
  );
}
