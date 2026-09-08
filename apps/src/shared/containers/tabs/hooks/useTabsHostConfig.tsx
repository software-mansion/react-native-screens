import React from 'react';
import { TabsHostConfigContext } from '../contexts/TabsHostConfigContext';

export function useTabsHostConfig() {
  const context = React.useContext(TabsHostConfigContext);

  if (context == null) {
    throw new Error(
      '[Tabs] useTabsHostConfig must be used within TabsContainerWithHostConfigContext',
    );
  }

  return context;
}
