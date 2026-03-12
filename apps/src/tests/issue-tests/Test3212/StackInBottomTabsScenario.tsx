import React, { useCallback, useState } from 'react';
import {
  SCROLL_EDGE_EFFECT_DEFAULTS,
  ScrollEdgeEffects,
  ScrollEdgeEffectsConfigContext,
} from './context';
import { NavigationContainer } from '@react-navigation/native';
import { TabsContainer } from '../../../shared/gamma/containers/tabs/TabsContainer';
import { Config } from './Config';
import { StackScenario } from './StackScenario';
import { ScrollView } from 'react-native';

export function StackInBottomTabsScenario() {
  const [config, setConfig] = useState<ScrollEdgeEffects>({
    ...SCROLL_EDGE_EFFECT_DEFAULTS,
  });

  // Add ScrollView for automatic insets which are missing in BottomTabsScreen
  const ConfigComponent = useCallback(
    () => (
      <ScrollView>
        <Config title="Outer BottomTabs / scrollEdgeEffects:" />
      </ScrollView>
    ),
    [],
  );

  return (
    <ScrollEdgeEffectsConfigContext.Provider value={{ config, setConfig }}>
      <NavigationContainer>
        <TabsContainer
          tabConfigs={[
            {
              component: ConfigComponent,
              screenProps: { screenKey: 'config', title: 'Config' },
            },
            {
              component: StackScenario,
              screenProps: {
                screenKey: 'stack',
                title: 'Stack',
                ios: {
                  scrollEdgeEffects: config,
                },
              },
            },
          ]}
        />
      </NavigationContainer>
    </ScrollEdgeEffectsConfigContext.Provider>
  );
}
