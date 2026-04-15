import React from 'react';
import { TabsNavigationContext } from '../contexts/TabsNavigationContext';

export function useTabsNavigationContext() {
  const context = React.useContext(TabsNavigationContext);

  if (!context) {
    throw new Error(
      'useTabsNavigationContext must be used within a TabsNavigationContext Provider',
    );
  }

  return context;
}
