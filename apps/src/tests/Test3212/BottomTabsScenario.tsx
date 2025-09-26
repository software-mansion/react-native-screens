import React, { useCallback, useState } from "react";
import { SCROLL_EDGE_EFFECT_DEFAULTS, ScrollEdgeEffects, ScrollEdgeEffectsConfigContext } from "./context";
import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { BottomTabsContainer } from "../../shared/gamma/containers/bottom-tabs/BottomTabsContainer"
import { Config } from "./Config";
import { ScrollViewTemplate } from "./ScrollViewTemplate";
import { ScrollView } from "react-native";

export function BottomTabsScenario() {
  const [config, setConfig] = useState<ScrollEdgeEffects>({ ...SCROLL_EDGE_EFFECT_DEFAULTS });

  // Add ScrollView for automatic insets which are missing in BottomTabsScreen
  const ConfigComponent = useCallback(() => <ScrollView><Config /></ScrollView>, []);

  return (
    <NavigationIndependentTree>
      <ScrollEdgeEffectsConfigContext.Provider value={{ config, setConfig }}>
        <NavigationContainer>
          <BottomTabsContainer
            tabConfigs={[
              { component: ConfigComponent, tabScreenProps: { tabKey: 'config', title: 'Config' } },
              { component: ScrollViewTemplate, tabScreenProps: { tabKey: 'stack', title: 'Scroll', scrollEdgeEffects: config } },
            ]}
          />
        </NavigationContainer>
      </ScrollEdgeEffectsConfigContext.Provider>
    </NavigationIndependentTree>
  );
}
