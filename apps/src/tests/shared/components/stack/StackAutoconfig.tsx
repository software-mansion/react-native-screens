import React from 'react';
import { useStackConfig } from '../../hooks/stack-config';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationIndependentTree } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export function StackAutoconfig() {
  const config = useStackConfig();

  return (
    <NavigationIndependentTree>
      <Stack.Navigator>
        {config.map(c => (
          <Stack.Screen
            key={c.name}
            name={c.name}
            options={c.options}
            component={c.component as any}
          />
        ))}
      </Stack.Navigator>
    </NavigationIndependentTree>
  );
}
