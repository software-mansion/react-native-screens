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
  const ConfigComponent = useCallback(() => <ScrollView><Config title='BottomTabs / scrollEdgeEffects:' /></ScrollView>, []);

  return (
    <NavigationIndependentTree>
      <ScrollEdgeEffectsConfigContext.Provider value={{ config, setConfig }}>
        <NavigationContainer>
          <BottomTabsContainer
            tabConfigs={[
              { component: ConfigComponent, tabScreenProps: { tabKey: 'config', title: 'Config' } },
              // Using `freezeContents` for testing purposes, to make the ScrollView searching algorithm's success verifiable
              { component: ScrollViewTemplate, tabScreenProps: { tabKey: 'stack', title: 'Scroll', freezeContents: false, scrollEdgeEffects: config } },
            ]}
          />
        </NavigationContainer>
      </ScrollEdgeEffectsConfigContext.Provider>
    </NavigationIndependentTree>
  );
}
