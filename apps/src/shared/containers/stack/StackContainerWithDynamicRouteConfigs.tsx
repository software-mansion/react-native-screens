import React from 'react';
import { StackContainer } from './StackContainer';
import {
  StackContainerProps,
  StackRouteConfig,
  StackRouteOptions,
} from './StackContainer.types';
import { StackRouteConfigContext } from './contexts/StackRouteConfigContext';

/**
 * StackContainer wrapped in context allowing for modifying options
 * of route configs.
 * See StackRouteConfigContext.
 *
 * Note: routeConfigs state is initialized once from props and does not sync
 * with subsequent prop changes. This is intentional for now — the component
 * owns the route config state after mount. In the future we may want to
 * consider syncing with prop updates (e.g. via useEffect) if dynamic
 * reconfiguration from the outside becomes a requirement.
 */
export function StackContainerWithDynamicRouteConfigs<
  const TRouteConfigs extends readonly StackRouteConfig[],
>(props: StackContainerProps<TRouteConfigs>) {
  const { initialRouteNames } = props;

  const [routeConfigs, setRouteConfigs] = React.useState<StackRouteConfig[]>(
    () => [...props.routeConfigs],
  );

  const updateRouteConfigWithOptions = React.useCallback(
    (routeName: string, options: Partial<StackRouteOptions>) => {
      setRouteConfigs(prevConfigs => {
        const routeConfigIndex = prevConfigs.findIndex(
          config => config.name === routeName,
        );

        if (routeConfigIndex === -1) {
          throw new Error(`[Stack] Route with name "${routeName}" not found`);
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
    <StackRouteConfigContext
      value={{
        routeConfigs,
        updateRouteConfigWithOptions,
      }}>
      <StackContainer
        routeConfigs={routeConfigs}
        initialRouteNames={initialRouteNames}
      />
    </StackRouteConfigContext>
  );
}
