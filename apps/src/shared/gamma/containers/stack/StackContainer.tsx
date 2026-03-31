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
  RNSLog,
  useRenderDebugInfo,
} from 'react-native-screens/private';
import { useParentNavigationEffect } from './hooks/useParentNavigationEffect';
import { Pressable } from 'react-native';

function ItemBlueComponent() {
  return (
    <Pressable
      style={{ width: 30, height: 30, backgroundColor: 'blue' }}
      onPressIn={() => console.log('blue pressable in')}
      onPress={() => console.log('blue pressable click')}
      onPressOut={() => console.log('blue pressable out')}
    />
  );
}

function HorizontalGreenItem() {
  return (
    <Pressable
      style={{ width: 100, height: 20, backgroundColor: 'green' }}
      onPressIn={() => console.log('green pressable in')}
      onPress={() => console.log('green pressable click')}
      onPressOut={() => console.log('green pressable out')}
    />
  );
}

function HorizontalPinkItem() {
  return (
    <Pressable
      style={{ width: 80, height: 10, backgroundColor: 'pink' }}
      onPressIn={() => console.log('pink pressable in')}
      onPress={() => console.log('pink pressable click')}
      onPressOut={() => console.log('pink pressable out')}
    />
  );
}

function ItemRedComponent() {
  return (
    <Pressable
      style={{
        width: 20,
        height: 20,
        backgroundColor: 'red',
      }}
      onPressIn={() => console.log('red pressable in')}
      onPress={() => console.log('red pressable click')}
      onPressOut={() => console.log('red pressable out')}
    />
  );
}

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
      RNSLog.log(`onScreenDismissed for ${screenKey}`);
      navMethods.popCompletedAction(screenKey);
    },
    [navMethods],
  );

  const onScreenNativelyDismissed = React.useCallback(
    (screenKey: string) => {
      RNSLog.log(`onScreenNativelyDismissed for ${screenKey}`);
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
                <Stack.HeaderConfig
                  title={'Hello World'}
                  largeTitleEnabled={true}
                  titleItem={{ key: 'title', component: HorizontalGreenItem }}
                  subtitleItem={{
                    key: 'subtitle',
                    component: HorizontalPinkItem,
                  }}
                  largeSubtitleItem={{
                    key: 'largeSubtitle',
                    component: HorizontalGreenItem,
                  }}
                  hidden={false}
                  leftItems={[
                    { key: 'left-0', component: ItemRedComponent },
                    { key: 'left-1', spacer: 'fixed', width: 100 },
                    { key: 'left-2', component: ItemRedComponent },
                    { key: 'left-3', component: ItemBlueComponent },
                    { key: 'left-4', label: 'An item' },
                  ]}
                  rightItems={[{ key: 'right-0', component: ItemRedComponent }]}
                />
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
