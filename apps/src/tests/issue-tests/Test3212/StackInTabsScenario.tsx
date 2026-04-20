import React, { useState } from 'react';
import {
  SCROLL_EDGE_EFFECT_DEFAULTS,
  ScrollEdgeEffects,
  ScrollEdgeEffectsConfigContext,
  useScrollEdgeEffectsConfigContext,
} from './context';
import { NavigationContainer } from '@react-navigation/native';
import { TabsContainer } from '@apps/shared/gamma/containers/tabs';
import { Config } from './Config';
import { StackScenario } from './StackScenario';
import { ScrollView } from 'react-native';
import { ScrollViewMarker } from 'react-native-screens/experimental';

function ConfigComponent() {
  const { config } = useScrollEdgeEffectsConfigContext();

  return (
    <ScrollViewMarker style={{ flex: 1 }} scrollEdgeEffects={config}>
      {/* Add ScrollView for automatic insets which are missing in TabsScreen */}
      <ScrollView>
        <Config title="Outer Tabs / scrollEdgeEffects:" />
      </ScrollView>
    </ScrollViewMarker>
  );
}

export function StackInTabsScenario() {
  const [config, setConfig] = useState<ScrollEdgeEffects>({
    ...SCROLL_EDGE_EFFECT_DEFAULTS,
  });
  return (
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
              Component: StackScenario,
              options: {
                title: 'Stack',
              },
            },
          ]}
        />
      </NavigationContainer>
    </ScrollEdgeEffectsConfigContext.Provider>
  );
}
