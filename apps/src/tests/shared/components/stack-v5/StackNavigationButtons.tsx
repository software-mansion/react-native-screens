import React from 'react';
import { useStackNavigationContext } from '../../../../shared/gamma/containers/stack';
import { Button } from 'react-native';

export function StackNavigationButtons(props: {
  routeNames: string[];
  isPopEnabled: boolean;
}) {
  const navigation = useStackNavigationContext();

  return (
    <>
      {props.routeNames.map(routeName => (
        <Button
          key={routeName}
          title={`Push ${routeName}`}
          onPress={() => navigation.push(routeName)}
        />
      ))}
      {props.isPopEnabled && (
        <Button
          title="Pop"
          onPress={() => navigation.pop(navigation.routeKey)}
        />
      )}
    </>
  );
}
