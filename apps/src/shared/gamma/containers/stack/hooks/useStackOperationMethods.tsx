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
} from '../StackContainerV2.types';

export function useStackOperationMethods(
  dispatch: React.Dispatch<NavigationAction>,
  routeConfigs: StackRouteConfig[],
  routesByName: Record<string, StackRouteConfig>,
): NavigationActionMethods {
  const actionContext: NavigationActionContext = React.useMemo(() => {
    return {
      routeConfigs,
      routesByName,
    };
  }, [routeConfigs, routesByName]);

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

  const aggregateValue = React.useMemo(() => {
    return {
      pushAction,
      popAction,
      popCompletedAction,
      popNativeAction,
    };
  }, [pushAction, popAction, popCompletedAction, popNativeAction]);

  return aggregateValue;
}
