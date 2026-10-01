import type { StackRouteConfig } from './StackContainer.types';

/**
 * Preserves literal route names so `initialRouteNames` can be type-checked
 * against `routeConfigs`.
 *
 * A plain array (or `satisfies StackRouteConfig[]`) widens `name` to `string`.
 * Passing the configs through this helper keeps `'A' | 'B' | …`.
 */
export function defineStackRouteConfigs<
  const TRouteConfigs extends readonly StackRouteConfig[],
>(routeConfigs: TRouteConfigs): TRouteConfigs {
  return routeConfigs;
}
