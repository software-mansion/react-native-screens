import React from 'react';
import { TabsContainer } from './TabsContainer';
import type { TabsContainerProps, TabsHostConfig } from './TabsContainer.types';
import { deepMerge } from '../../../utils/deep-merge';
import {
  TabsHostConfigContext,
  type TabsHostConfigContextPayload,
} from './contexts/TabsHostConfigContext';

/**
 * TabsContainer wrapped in context allowing child screens to update host-level
 * props (e.g. colorScheme, direction, android.*) at runtime via useTabsHostConfig.
 *
 * Note: hostConfig state is initialized once from props and does not sync
 * with subsequent prop changes. This is intentional — the component owns
 * the host config state after mount. Runtime updates should go through
 * updateHostConfig (via TabsHostConfigContext) rather than prop changes.
 */
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
      setHostConfig(prev => deepMerge(prev, config));
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

