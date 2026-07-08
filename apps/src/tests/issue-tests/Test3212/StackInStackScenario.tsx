import React, { useCallback, useState } from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  SCROLL_EDGE_EFFECT_DEFAULTS,
  ScrollEdgeEffects,
  ScrollEdgeEffectsConfigContext,
} from './context';
import { ConfigWithNavigation } from './Config';
import { NavigationContainer } from '@react-navigation/native';
import { StackScenario } from './StackScenario';

type StackParamList = {
  Config: undefined;
  Test: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

export function StackInStackScenario() {
  const [config, setConfig] = useState<ScrollEdgeEffects>({
    ...SCROLL_EDGE_EFFECT_DEFAULTS,
  });

  const ConfigComponent = useCallback(
    ({ navigation }: NativeStackScreenProps<StackParamList, 'Config'>) => (
      <ConfigWithNavigation
        title="Outer Stack / scrollEdgeEffects:"
        onGoPress={() => navigation.navigate('Test')}
      />
    ),
    [],
  );

  return (
    <ScrollEdgeEffectsConfigContext.Provider value={{ config, setConfig }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            autoHideHomeIndicator: true,
          }}>
          <Stack.Screen name="Config" component={ConfigComponent} />
          <Stack.Screen
            name="Test"
            component={StackScenario}
            options={{ scrollEdgeEffects: config, headerTransparent: true }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ScrollEdgeEffectsConfigContext.Provider>
  );
}
