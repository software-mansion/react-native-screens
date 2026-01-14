import React from 'react';
import { StackNavigationContext } from '../contexts/StackNavigationContext';

export function useStackNavigationContext() {
  const context = React.useContext(StackNavigationContext);

  if (!context) {
    throw new Error(
      'useStackNavigationContext must be used within a StackNavigationContext Provider',
    );
  }

  return context;
}
