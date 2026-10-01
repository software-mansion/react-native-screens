export type RouteNameFromConfigs<
  TRouteConfigs extends readonly { readonly name: string }[],
> = TRouteConfigs[number]['name'];
