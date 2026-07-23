import React, { useMemo } from 'react';
import type { StackRouteConfig } from '../stack';
import type { TabRouteConfig } from '../tabs';

export const useComponentsByName = (
  routeConfigs: StackRouteConfig[] | TabRouteConfig[],
) => {
  return useMemo(() => {
    const map = new Map<string, React.ComponentType>();

    for (const config of routeConfigs) {
      map.set(config.name, config.Component);
    }

    return map;
  }, [routeConfigs]);
};
