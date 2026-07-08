import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { ConfigWithNavigation } from './Config';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import { ScrollViewTemplate } from './ScrollViewTemplate';
import {
  SCROLL_EDGE_EFFECT_DEFAULTS,
  ScrollEdgeEffects,
  ScrollEdgeEffectsConfigContext,
} from './context';
import { useState } from 'react';

type StackParamList = {
  Config: undefined;
  Test: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

function ConfigComponent({
  navigation,
}: NativeStackScreenProps<StackParamList, 'Config'>) {
  return (
    <ConfigWithNavigation
      title="Stack / scrollEdgeEffects:"
      onGoPress={() => navigation.navigate('Test')}
    />
  );
}

export function StackScenario() {
  const [config, setConfig] = useState<ScrollEdgeEffects>({
    ...SCROLL_EDGE_EFFECT_DEFAULTS,
  });

  return (
    <NavigationIndependentTree>
      <ScrollEdgeEffectsConfigContext.Provider value={{ config, setConfig }}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              autoHideHomeIndicator: true,
            }}>
            <Stack.Screen name="Config" component={ConfigComponent} />
            <Stack.Screen
              name="Test"
              component={ScrollViewTemplate}
              options={{
                scrollEdgeEffects: config,
                headerSearchBarOptions: {},
                headerTransparent: true,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ScrollEdgeEffectsConfigContext.Provider>
    </NavigationIndependentTree>
  );
}
