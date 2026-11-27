import React from 'react';
import type { NativeSyntheticEvent } from 'react-native';
import {
  Stack,
  type StackNavStateChangedEvent,
  type StackNavStateRequestRejectedEvent,
  type StackScreensReleasedEvent,
} from 'react-native-screens';
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
  RNSLog,
  useRenderDebugInfo,
} from 'react-native-screens/private';
import { useParentNavigationEffect } from './hooks/useParentNavigationEffect';
import { useElementsByName } from '../shared/use-elements-by-name';

export function StackContainer<
  const TRouteConfigs extends readonly StackRouteConfig[],
>(props: StackContainerProps<TRouteConfigs>) {
  const {
    routeConfigs,
    initialRouteNames,
    onNavStateChanged,
    onNavStateRequestRejected,
    onScreensReleased,
    ...restProps
  } = props;
  useSanitizeRouteConfigs(routeConfigs);

  const elementsByName = useElementsByName(routeConfigs);

  const [stackNavState, navActionDispatch]: [
    StackNavigationState,
    React.Dispatch<NavigationAction>,
  ] = React.useReducer(
    navigationStateReducerWithLogging,
    { routeConfigs, initialRouteNames },
    determineInitialNavigationState,
  );

  const navMethods = useStackOperationMethods(navActionDispatch, routeConfigs);

  // If reducer produced a parent action, we need to dispatch it
  // as an effect, because we can not modify the state during the render phase.
  useParentNavigationEffect(navMethods, stackNavState.effects);

  const hostRef =
    useRenderDebugInfo<NativeComponentGenericRef>('StackContainer');

  const onNavStateChangedCallback = React.useCallback(
    (event: NativeSyntheticEvent<StackNavStateChangedEvent>) => {
      onNavStateChanged?.(event);
      RNSLog.log(
        `[Stack] onNavStateChanged: ${JSON.stringify(event.nativeEvent)}`,
      );
      navActionDispatch({
        type: 'nav-state-changed',
        event: event.nativeEvent,
      });
    },
    [onNavStateChanged],
  );

  const onNavStateRequestRejectedCallback = React.useCallback(
    (event: NativeSyntheticEvent<StackNavStateRequestRejectedEvent>) => {
      onNavStateRequestRejected?.(event);
      RNSLog.log(
        `[Stack] onNavStateRequestRejected: ${JSON.stringify(
          event.nativeEvent,
        )}`,
      );
      navActionDispatch({
        type: 'nav-state-request-rejected',
        event: event.nativeEvent,
      });
    },
    [onNavStateRequestRejected],
  );

  const onScreensReleasedCallback = React.useCallback(
    (event: NativeSyntheticEvent<StackScreensReleasedEvent>) => {
      onScreensReleased?.(event);
      RNSLog.log(
        `[Stack] onScreensReleased: ${JSON.stringify(event.nativeEvent)}`,
      );
      navActionDispatch({
        type: 'screens-released',
        event: event.nativeEvent,
      });
    },
    [onScreensReleased],
  );

  // Children are a pool of screens: whether a screen is in the stack is
  // decided by the request only. They are rendered in the order the routes
  // were created, so no child ever moves; their order carries no meaning.
  return (
    <Stack.Host
      ref={hostRef}
      {...restProps}
      navStateRequest={stackNavState.request}
      onNavStateChanged={onNavStateChangedCallback}
      onNavStateRequestRejected={onNavStateRequestRejectedCallback}
      onScreensReleased={onScreensReleasedCallback}>
      {stackNavState.routes.map(
        ({
          options: { headerConfig, headerConfigRef, ...options } = {},
          routeKey,
          name,
        }) => {
          const stackNavigationContext: StackNavigationContextPayload = {
            routeKey,
            routeOptions: { ...options },
            push: navMethods.pushAction,
            pop: navMethods.popAction,
            preload: navMethods.preloadAction,
            batch: navMethods.batchAction,
            setRouteOptions: navMethods.setRouteOptions,
          };

          const element = elementsByName.get(name);
          if (!element) {
            throw new Error(
              `[Stack] No config matches the "${name}" route name`,
            );
          }

          return (
            <Stack.Screen key={routeKey} {...options} screenKey={routeKey}>
              <StackNavigationContext.Provider value={stackNavigationContext}>
                {element}
                {headerConfig !== undefined && (
                  <Stack.HeaderConfig ref={headerConfigRef} {...headerConfig} />
                )}
              </StackNavigationContext.Provider>
            </Stack.Screen>
          );
        },
      )}
    </Stack.Host>
  );
}

function useSanitizeRouteConfigs(
  routeConfigs?: readonly StackRouteConfig[] | undefined | null,
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
