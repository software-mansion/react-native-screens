import React, { useMemo } from 'react';
import type { StackRouteConfig } from '../stack';
import type { TabRouteConfig } from '../tabs';

export const useElementsByName = (
  routeConfigs: StackRouteConfig[] | TabRouteConfig[],
) => {
  return useMemo(() => {
    const map = new Map<string, React.ReactElement>();

    for (const config of routeConfigs) {
      map.set(config.name, config.element);
    }

    return map;
  }, [routeConfigs]);
};
