import React, { useState } from 'react';
import {
  SCROLL_EDGE_EFFECT_DEFAULTS,
  ScrollEdgeEffects,
  ScrollEdgeEffectsConfigContext,
} from './context';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import { TabsContainer } from '@apps/shared/gamma/containers/tabs';
import { Config } from './Config';
import { ScrollViewTemplate } from './ScrollViewTemplate';
import { ScrollView } from 'react-native';

function ConfigComponent() {
  // Add ScrollView for automatic insets which are missing in TabsScreen
  return (
    <ScrollView>
      <Config title="Stack / scrollEdgeEffects:" />
    </ScrollView>
  );
}

export function TabsScenario() {
  const [config, setConfig] = useState<ScrollEdgeEffects>({
    ...SCROLL_EDGE_EFFECT_DEFAULTS,
  });

  return (
    <NavigationIndependentTree>
      <ScrollEdgeEffectsConfigContext.Provider value={{ config, setConfig }}>
        <NavigationContainer>
          <TabsContainer
            routeConfigs={[
              {
                name: 'config',
                Component: ConfigComponent,
                options: { title: 'Config' },
              },
              {
                name: 'stack',
                Component: ScrollViewTemplate,
                options: {
                  title: 'Scroll',
                  ios: {
                    scrollEdgeEffects: config,
                  },
                },
              },
            ]}
          />
        </NavigationContainer>
      </ScrollEdgeEffectsConfigContext.Provider>
    </NavigationIndependentTree>
  );
}
