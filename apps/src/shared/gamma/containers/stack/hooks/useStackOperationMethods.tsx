import React from 'react';
import {
  NavigationAction,
  NavigationActionContext,
  NavigationActionMethods,
  PopActionMethod,
  PopCompletedActionMethod,
  PopNativeActionMethod,
  PushActionMethod,
  StackRouteConfig,
} from '../StackContainer.types';

export function useStackOperationMethods(
  dispatch: React.Dispatch<NavigationAction>,
  routeConfigs: StackRouteConfig[],
): NavigationActionMethods {
  const actionContext: NavigationActionContext = React.useMemo(() => {
    return {
      routeConfigs,
    };
  }, [routeConfigs]);

  const pushAction: PushActionMethod = React.useCallback(
    (routeName: string) => {
      dispatch({ type: 'push', routeName, ctx: actionContext });
    },
    [dispatch, actionContext],
  );

  const popAction: PopActionMethod = React.useCallback(
    (routeKey: string) => {
      dispatch({ type: 'pop', routeKey, ctx: actionContext });
    },
    [dispatch, actionContext],
  );

  const popCompletedAction: PopCompletedActionMethod = React.useCallback(
    (routeKey: string) => {
      dispatch({
        type: 'pop-completed',
        routeKey,
        ctx: actionContext,
      });
    },
    [dispatch, actionContext],
  );

  const popNativeAction: PopNativeActionMethod = React.useCallback(
    (routeKey: string) => {
      dispatch({ type: 'pop-native', routeKey, ctx: actionContext });
    },
    [dispatch, actionContext],
  );

  const preloadAction = React.useCallback((routeKey: string) => {
    dispatch({ type: 'preload', routeName: routeKey, ctx: actionContext });
  }, [dispatch, actionContext]);

  const aggregateValue = React.useMemo(() => {
    return {
      pushAction,
      popAction,
      popCompletedAction,
      popNativeAction,
      preloadAction,
    };
  }, [pushAction, popAction, popCompletedAction, popNativeAction, preloadAction]);

  return aggregateValue;
}
