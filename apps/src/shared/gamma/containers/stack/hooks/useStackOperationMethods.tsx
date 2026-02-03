import React from 'react';
import {
  BatchableNavigationAction,
  BatchActionMethod,
  ClearEffectsActionMethod,
  NavigationAction,
  NavigationActionContext,
  NavigationActionMethods,
  PopActionMethod,
  PopCompletedActionMethod,
  PopNativeActionMethod,
  PreloadActionMethod,
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

  const preloadAction: PreloadActionMethod = React.useCallback(
    (routeName: string) => {
      dispatch({ type: 'preload', routeName, ctx: actionContext });
    },
    [dispatch, actionContext],
  );

  const batchAction: BatchActionMethod = React.useCallback(
    (actions: BatchableNavigationAction[]) => {
      const actionsWithContext = actions.map(action => ({
        ...action,
        ctx: actionContext,
      }));

      dispatch({ type: 'batch', actions: actionsWithContext });
    },
    [dispatch, actionContext],
  );

  const clearEffectsAction: ClearEffectsActionMethod = React.useCallback(() => {
    dispatch({ type: 'clear-effects', ctx: actionContext });
  }, [dispatch, actionContext]);

  const aggregateValue = React.useMemo(() => {
    return {
      pushAction,
      popAction,
      popCompletedAction,
      popNativeAction,
      preloadAction,
      batchAction,
      clearEffectsAction,
    };
  }, [
    pushAction,
    popAction,
    popCompletedAction,
    popNativeAction,
    preloadAction,
    batchAction,
    clearEffectsAction,
  ]);

  return aggregateValue;
}
