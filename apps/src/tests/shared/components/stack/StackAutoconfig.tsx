import React, { useMemo } from 'react';
import { useStackConfig } from '../../hooks/stack-config';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationIndependentTree } from '@react-navigation/native';

export function StackAutoconfig() {
  const config = useStackConfig();
  const Stack = useMemo(() => createNativeStackNavigator(), []);

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
