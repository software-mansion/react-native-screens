import React from 'react';
import { Stack } from 'react-native-screens/experimental';
import type {
  NavigationAction,
  StackContainerProps,
  StackNavigationState,
  StackRouteConfig,
} from './StackContainer.types';
import {
  determineInitialNavigationState,
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
import { useParentNavigationEffect } from './hooks/useParentNavigationEffect';

export function StackContainer({ routeConfigs }: StackContainerProps) {
  useSanitizeRouteConfigs(routeConfigs);

  const [stackNavState, navActionDispatch]: [
    StackNavigationState,
    React.Dispatch<NavigationAction>,
  ] = React.useReducer(
    navigationStateReducerWithLogging,
    routeConfigs,
    determineInitialNavigationState,
  );

  const navMethods = useStackOperationMethods(navActionDispatch, routeConfigs);

  // If reducer produced a parent action, we need to dispatch it
  // as an effect, because we can not modify the state during the render phase.
  useParentNavigationEffect(navMethods, stackNavState.effects);

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
      {stackNavState.stack.map(
        ({ Component, options, activityMode, routeKey }) => {
          const stackNavigationContext: StackNavigationContextPayload = {
            routeKey,
            routeOptions: { ...options },
            push: navMethods.pushAction,
            pop: navMethods.popAction,
            preload: navMethods.preloadAction,
            batch: navMethods.batchAction,
            setRouteOptions: navMethods.setRouteOptions,
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
        },
      )}
    </Stack.Host>
  );
}

function useSanitizeRouteConfigs(
  routeConfigs?: StackRouteConfig[] | undefined | null,
) {
  if (!routeConfigs || routeConfigs.length === 0) {
    throw new Error('[Stack] There must be at least one route configured');
  }

  // Do not recompute in case the routeConfigs have not changed
  const areNamesUnique = React.useMemo(() => {
    const routeNames = routeConfigs.map(routeConfig => routeConfig.name);
    const uniqueRouteNames = new Set(routeNames);
    return routeNames.length === uniqueRouteNames.size;
  }, [routeConfigs]);

  if (!areNamesUnique) {
    throw new Error('[Stack] All routes must have unique names');
  }
}
