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
import { TabsContainer } from '../../../shared/gamma/containers/tabs/TabsContainer';
import { Config } from './Config';
import { ScrollViewTemplate } from './ScrollViewTemplate';
import { ScrollView } from 'react-native';

function ConfigComponent() {
  // Add ScrollView for automatic insets which are missing in BottomTabsScreen
  return (
    <ScrollView>
      <Config title="Stack / scrollEdgeEffects:" />
    </ScrollView>
  );
}

export function BottomTabsScenario() {
  const [config, setConfig] = useState<ScrollEdgeEffects>({
    ...SCROLL_EDGE_EFFECT_DEFAULTS,
  });

  return (
    <NavigationIndependentTree>
      <ScrollEdgeEffectsConfigContext.Provider value={{ config, setConfig }}>
        <NavigationContainer>
          <TabsContainer
            tabConfigs={[
              {
                component: ConfigComponent,
                screenProps: { screenKey: 'config', title: 'Config' },
              },
              {
                component: ScrollViewTemplate,
                screenProps: {
                  screenKey: 'stack',
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
