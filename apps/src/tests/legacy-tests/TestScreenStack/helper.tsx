import React from 'react';
import { Button } from 'react-native';
import { ScreenLayout } from './ScreenLayout';
import { useStackNavigation } from '../../../shared/gamma/containers/stack/StackContainer';

export function generateStackWithNames(screenNames: string[]) {
  const TestComponent = () => {
    const navigation = useStackNavigation();

    return (
      <ScreenLayout>
        {screenNames.map(screenName => (
          <Button
            onPress={() => navigation.push(screenName)}
            title={`Push ${screenName}`}
            key={screenName}
          />
        ))}
      </ScreenLayout>
    );
  };

  return screenNames.map(screenName => ({
    name: screenName,
    component: TestComponent,
  }));
}
