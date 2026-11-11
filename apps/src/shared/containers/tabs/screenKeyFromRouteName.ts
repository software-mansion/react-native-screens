/**
 * Maps a tab route name to the `screenKey` of its `Tabs.Screen`.
 *
 * Tab names are required to be unique (enforced by useSanitizeRouteConfigs),
 * so the name itself serves as a stable unique key.
 */
export function screenKeyFromRouteName(routeName: string): string {
  return routeName;
}
