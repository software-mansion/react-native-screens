import React from 'react';
import { TabsContainer } from './TabsContainer';
import type { TabsContainerProps, TabRouteOptions } from './TabsContainer.types';
import { TabsRouteConfigContext } from './contexts/TabsRouteConfigContext';

/**
 * TabsContainer wrapped in context allowing for modifying options
 * of route configs.
 * See TabsRouteConfigContext.
 *
 * Note: routeConfigs state is initialized once from props and does not sync
 * with subsequent prop changes. This is intentional for now — the component
 * owns the route config state after mount. In the future we may want to
 * consider syncing with prop updates (e.g. via useEffect) if dynamic
 * reconfiguration from the outside becomes a requirement.
 */
export function TabsContainerWithDynamicRouteConfigs(
  props: TabsContainerProps,
) {
  const [routeConfigs, setRouteConfigs] = React.useState(props.routeConfigs);

  const updateRouteConfigWithOptions = React.useCallback(
    (name: string, options: Partial<TabRouteOptions>) => {
      setRouteConfigs(prevConfigs => {
        const routeConfigIndex = prevConfigs.findIndex(
          config => config.name === name,
        );

        if (routeConfigIndex === -1) {
          throw new Error(`[Tabs] Tab with name "${name}" not found`);
        }

        return prevConfigs.toSpliced(routeConfigIndex, 1, {
          ...prevConfigs[routeConfigIndex],
          options: {
            ...prevConfigs[routeConfigIndex].options,
            ...options,
          },
        });
      });
    },
    [],
  );

  return (
    <TabsRouteConfigContext
      value={{
        routeConfigs,
        updateRouteConfigWithOptions,
      }}>
      <TabsContainer {...props} routeConfigs={routeConfigs} />
    </TabsRouteConfigContext>
  );
}
