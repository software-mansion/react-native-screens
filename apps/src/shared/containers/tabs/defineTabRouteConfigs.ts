import type { TabRouteConfig } from './TabsContainer.types';

/**
 * Preserves literal route names so `defaultRouteName` can be type-checked
 * against `routeConfigs`.
 *
 * A plain array (or `satisfies TabRouteConfig[]`) widens `name` to `string`.
 * Passing the configs through this helper keeps `'A' | 'B' | …`.
 */
export function defineTabRouteConfigs<
  const TRouteConfigs extends readonly TabRouteConfig[],
>(routeConfigs: TRouteConfigs): TRouteConfigs {
  return routeConfigs;
}
