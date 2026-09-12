import React from 'react';
import { Button } from 'react-native';
import {
  type StackNavigationContextPayload,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';

/**
 * Hands the navigation context of an enclosing stack down to screens rendered
 * inside a nested container, whose own `useStackNavigationContext()` resolves
 * to the nearest (nested) stack. Render the provider in the element of the
 * outer route that hosts the nested container.
 */
const OuterStackNavigationContext =
  React.createContext<StackNavigationContextPayload | null>(null);

export function OuterStackNavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = useStackNavigationContext();

  return (
    <OuterStackNavigationContext.Provider value={navigation}>
      {children}
    </OuterStackNavigationContext.Provider>
  );
}

/** Pushes `routeName` on the enclosing stack from inside a nested container. */
export function PushOuterStackRouteButton({
  routeName,
}: {
  routeName: string;
}) {
  const navigation = React.useContext(OuterStackNavigationContext);

  if (navigation == null) {
    throw new Error(
      'PushOuterStackRouteButton must be rendered under OuterStackNavigationProvider',
    );
  }

  return (
    <Button
      title={`Push ${routeName} (outer)`}
      onPress={() => navigation.push(routeName)}
    />
  );
}
