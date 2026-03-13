import React from 'react';
import { TabsRouteConfigContext } from '../contexts/TabsRouteConfigContext';

export function useTabsRouteConfigContext() {
  const context = React.useContext(TabsRouteConfigContext);

  if (!context) {
    throw new Error(
      'useTabsRouteConfigContext must be used within a TabsContainerWithDynamicRouteConfigs',
    );
  }

  return context;
}
