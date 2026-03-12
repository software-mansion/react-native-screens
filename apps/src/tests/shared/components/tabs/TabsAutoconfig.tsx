import React from 'react';
import { TabsContainer } from '../../../../shared/gamma/containers/bottom-tabs/TabsContainer';
import { useTabsConfig } from '../../hooks/tabs-config';

export function TabsAutoconfig() {
  const config = useTabsConfig();

  return <TabsContainer {...config} />;
}
