import React from 'react';
import { StackRouteConfigContext } from '../contexts/StackRouteConfigContext';

export function useStackRouteConfigContext() {
  const context = React.useContext(StackRouteConfigContext);

  if (!context) {
    throw new Error(
      'useStackRouteConfigContext must be used within a StackContainerWithContext',
    );
  }

  return context;
}
