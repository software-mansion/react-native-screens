import React from 'react';
import { Button } from 'react-native';
import { ScreenLayout } from './ScreenLayout';
import { useStackNavigation } from '../../shared/gamma/containers/stack/StackContainer';
import { ScreenProps } from 'react-native-screens';

export function generateStackWithNames(screens: {name: string; options?: ScreenProps;}[]) {
  const TestComponent = () => {
    const navigation = useStackNavigation();

    return (
      <ScreenLayout>
        {screens.map(screen => (
          <Button
            onPress={() => navigation.push(screen.name)}
            title={`Push ${screen.name}`}
            key={screen.name}
          />
        ))}
      </ScreenLayout>
    );
  };

  return screens.map(screen => ({
    name: screen.name,
    component: TestComponent,
    options: screen.options,
  }));
}
