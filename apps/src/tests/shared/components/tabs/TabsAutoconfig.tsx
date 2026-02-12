import React from 'react';
import { BottomTabsContainer } from '../../../../shared/gamma/containers/bottom-tabs/BottomTabsContainer';
import { useTabsConfig } from '../../hooks/tabs-config';

export function TabsAutoconfig() {
  const config = useTabsConfig();

  return <BottomTabsContainer {...config} />;
}
