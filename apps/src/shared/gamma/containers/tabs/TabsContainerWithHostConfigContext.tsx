import React from 'react';
import { TabsContainer } from './TabsContainer';
import type { TabsContainerProps, TabsHostConfig } from './TabsContainer.types';
import {
  TabsHostConfigContext,
  type TabsHostConfigContextPayload,
} from './contexts/TabsHostConfigContext';

export function TabsContainerWithHostConfigContext(props: TabsContainerProps) {
  const {
    routeConfigs,
    initialFocusedName,
    experimentalControlNavigationStateInJS,
    ...hostProps
  } = props;

  const [hostConfig, setHostConfig] = React.useState<TabsHostConfig>(hostProps);

  const updateHostConfig = React.useCallback(
    (config: Partial<TabsHostConfig>) => {
      setHostConfig(prev => ({ ...prev, ...config }));
    },
    [],
  );

  const tabsHostConfigContext: TabsHostConfigContextPayload = React.useMemo(
    () => ({ hostConfig, updateHostConfig }),
    [hostConfig, updateHostConfig],
  );

  return (
    <TabsHostConfigContext value={tabsHostConfigContext}>
      <TabsContainer
        routeConfigs={routeConfigs}
        initialFocusedName={initialFocusedName}
        experimentalControlNavigationStateInJS={
          experimentalControlNavigationStateInJS
        }
        {...hostConfig}
      />
    </TabsHostConfigContext>
  );
}
