import React from 'react';
import { Stack } from 'react-native-screens/experimental';
import type {
  NavigationAction,
  StackContainerProps,
  StackRouteConfig,
  StackState,
} from './StackContainer.types';
import {
  createRouteFromConfig,
  navigationStateReducerWithLogging,
} from './reducer';
import { useStackOperationMethods } from './hooks/useStackOperationMethods';
import {
  StackNavigationContext,
  type StackNavigationContextPayload,
} from './contexts/StackNavigationContext';
import {
  type NativeComponentGenericRef,
  useRenderDebugInfo,
} from 'react-native-screens/private';

export function StackContainer({ routeConfigs }: StackContainerProps) {
  useSanitizeRouteConfigs(routeConfigs);

  const [stackState, navActionDispatch]: [
    StackState,
    React.Dispatch<NavigationAction>,
  ] = React.useReducer(
    navigationStateReducerWithLogging,
    routeConfigs,
    determineFirstRoute,
  );

  const navMethods = useStackOperationMethods(navActionDispatch, routeConfigs);

  const hostRef =
    useRenderDebugInfo<NativeComponentGenericRef>('StackContainer');

  const onScreenDismissed = React.useCallback(
    (screenKey: string) => {
      console.log(`onScreenDismissed for ${screenKey}`);
      navMethods.popCompletedAction(screenKey);
    },
    [navMethods],
  );

  const onScreenNativelyDismissed = React.useCallback(
    (screenKey: string) => {
      console.log(`onScreenNativelyDismissed for ${screenKey}`);
      navMethods.popNativeAction(screenKey);
    },
    [navMethods],
  );

  return (
    <Stack.Host ref={hostRef}>
      {stackState.map(({ Component, options, activityMode, routeKey }) => {
        const stackNavigationContext: StackNavigationContextPayload = {
          routeKey,
          push: navMethods.pushAction,
          pop: navMethods.popAction,
          preload: navMethods.preloadAction,
        };

        return (
          <Stack.Screen
            key={routeKey}
            {...options}
            activityMode={activityMode}
            screenKey={routeKey}
            onDismiss={onScreenDismissed}
            onNativeDismiss={onScreenNativelyDismissed}>
            <StackNavigationContext.Provider value={stackNavigationContext}>
              <Component />
            </StackNavigationContext.Provider>
          </Stack.Screen>
        );
      })}
    </Stack.Host>
  );
}

function useSanitizeRouteConfigs(
  routeConfigs?: StackRouteConfig[] | undefined | null,
) {
  if (!routeConfigs || routeConfigs.length === 0) {
    throw new Error('[RNScreens] There must be at least one route configured');
  }

  // Do not recompute in case the routeConfigs have hot changed
  const areNamesUnique = React.useMemo(() => {
    const routeNames = routeConfigs.map(routeConfig => routeConfig.name);
    const uniqueRouteNames = new Set(routeNames);
    return routeNames.length === uniqueRouteNames.size;
  }, [routeConfigs]);

  if (!areNamesUnique) {
    throw new Error('[RNScreens] All routes must have unique names');
  }
}

function determineFirstRoute(routeConfigs: StackRouteConfig[]): StackState {
  const firstRoute = createRouteFromConfig(routeConfigs[0]);
  firstRoute.activityMode = 'attached';
  return [firstRoute];
}
