import React from "react";
import { Stack } from "react-native-screens/experimental";
import type { NavigationAction, StackContainerProps, StackRouteConfig, StackState } from "./StackContainerV2.types";
import { navigationStateReducer } from "./reducer";
import { useStackOperationMethods } from "./hooks/useStackOperationMethods";
import { StackNavigationContext, type StackNavigationContextPayload } from "./contexts/StackNavigationContext";
import { type NativeComponentGenericRef, useRenderDebugInfo } from "react-native-screens/private";

export function StackContainer({ routeConfigs }: StackContainerProps) {
  requireRouteConfigs(routeConfigs);

  const [stackState, navActionDispatch]: [StackState, React.Dispatch<NavigationAction>]
    = React.useReducer(navigationStateReducer, []);

  const routesByName = React.useMemo(() => {
    return Object.fromEntries(routeConfigs.map((route) => [route.name, route]));
  }, [routeConfigs]);

  const navMethods = useStackOperationMethods(navActionDispatch, routeConfigs, routesByName);

  React.useEffect(() => {
    if (stackState.length === 0) {
      navMethods.pushAction(routeConfigs[0].name);
    }
  }, [navMethods, routeConfigs, stackState.length]);

  const hostRef = useRenderDebugInfo<NativeComponentGenericRef>('StackContainer');

  const onScreenDismissed = React.useCallback((screenKey: string) => {
    console.log(`onScreenDismissed for ${screenKey}`);
    navMethods.popCompletedAction(screenKey);
  }, [navMethods]);

  const onScreenNativelyDismissed = React.useCallback((screenKey: string) => {
    console.log(`onScreenNativelyDismissed for ${screenKey}`);
    navMethods.popNativeAction(screenKey);
  }, [navMethods]);

  return (
    <Stack.Host ref={hostRef}>
      {stackState.map(({ Component, options, activityMode, routeKey }) => {
        const stackNavigationContext: StackNavigationContextPayload = {
          routeKey,
          push: navMethods.pushAction,
          pop: navMethods.popAction,
        };

        return (
          <Stack.Screen key={routeKey} {...options} activityMode={activityMode} screenKey={routeKey}
            onDismiss={onScreenDismissed}
            onNativeDismiss={onScreenNativelyDismissed}
          >
            <StackNavigationContext.Provider value={stackNavigationContext}>
              <Component />
            </StackNavigationContext.Provider>
          </Stack.Screen>
        );
      })}
    </Stack.Host>
  );
};

function requireRouteConfigs(routeConfigs?: StackRouteConfig[] | undefined | null) {
  if (!routeConfigs || routeConfigs.length === 0) {
    throw new Error('[RNScreens] There must be at least one route configured');
  }
}


