import React from 'react';
import { I18nManager, type NativeSyntheticEvent } from 'react-native';
import {
  type TabSelectedEvent,
  Tabs,
  type TabsHostNavState,
} from 'react-native-screens';
import type {
  SelectTabMethod,
  TabRoute,
  TabRouteConfig,
  TabRouteOptions,
  TabsContainerProps,
  TabsContainerState,
  TabsNavigationAction,
  TabsNavigationMethods,
} from './TabsContainer.types';
import {
  tabsNavigationReducerWithLogging,
  determineInitialTabsContainerState,
} from './reducer';
import { RNSLog } from 'react-native-screens/private';
import { TabsContainerItem } from './TabsContainerItem';

export function TabsContainer(props: TabsContainerProps) {
  RNSLog.info('TabsContainer render');

  const {
    routeConfigs,
    defaultRouteName,
    experimentalControlNavigationStateInJS,
    onTabSelected,
    ...restProps
  } = props;

  useSanitizeRouteConfigs(routeConfigs);

  const [tabsNavState, dispatch]: [
    TabsContainerState,
    React.Dispatch<TabsNavigationAction>,
  ] = React.useReducer(
    tabsNavigationReducerWithLogging,
    { routeConfigs, defaultRouteName },
    determineInitialTabsContainerState,
  );

  const hostNavState = useTabsHostNavState(tabsNavState);

  const onTabSelectedCallback = React.useCallback(
    (event: NativeSyntheticEvent<TabSelectedEvent>) => {
      // First call user provided callback
      onTabSelected?.(event);

      // Perform our logic
      const screenKey = event.nativeEvent.selectedScreenKey;
      console.log(`[Tabs] onTabSelectedCallback: ${screenKey}`);

      // Please note that the `useTransition` hook can not be used here,
      // because it intruduces additional renders, which lead
      // to blank screens / placeholders being visible (on slower render)
      // for a few frames!
      React.startTransition(() => {
        RNSLog.info(`Starting transition to ${screenKey}`);
        dispatch({
          type: 'native-tab-select',
          routeKey: screenKey,
          nativeEvent: event.nativeEvent,
        });
      });
    },
    [onTabSelected],
  );

  const navMethods = useTabsNavigationMethods(dispatch);

  return (
    <Tabs.Host
      // Use controlled tabs by default, but allow to overwrite if user wants to
      navState={hostNavState}
      onTabSelected={onTabSelectedCallback}
      experimentalControlNavigationStateInJS={
        experimentalControlNavigationStateInJS
      }
      direction={I18nManager.isRTL ? 'rtl' : 'ltr'}
      {...restProps}>
      {tabsNavState.routes.map((route: TabRoute) => {
        const isSelected =
          route.routeKey === tabsNavState.confirmedState.selectedRouteKey;
        const pendingForUpdate =
          route.routeKey === tabsNavState.suggestedState.selectedRouteKey;

        return <TabsContainerItem key={route.routeKey} route={route} navMethods={navMethods} isSelected={isSelected} pendingForUpdate={pendingForUpdate} />
      })}
    </Tabs.Host>
  );
}

function useTabsHostNavState(
  tabsNavState: TabsContainerState,
): TabsHostNavState {
  const hostNavState: TabsHostNavState = React.useMemo(() => {
    return {
      selectedScreenKey: tabsNavState.suggestedState.selectedRouteKey,
      provenance: tabsNavState.suggestedState.provenance,
    };
  }, [tabsNavState.suggestedState]);

  return hostNavState;
}

function useSanitizeRouteConfigs(routeConfigs: TabRouteConfig[]) {
  if (routeConfigs.length === 0) {
    throw new Error('[Tabs] There must be at least one tab defined');
  }

  const areNamesUnique = React.useMemo(() => {
    const names = routeConfigs.map(c => c.name);
    return names.length === new Set(names).size;
  }, [routeConfigs]);

  if (!areNamesUnique) {
    throw new Error('[Tabs] All tabs must have unique names');
  }
}

function useTabsNavigationMethods(dispatch: React.Dispatch<TabsNavigationAction>): TabsNavigationMethods {
  const setRouteOptions = React.useCallback(
    (routeKey: string, options: Partial<TabRouteOptions>) => {
      dispatch({ type: 'set-options', routeKey, options });
    },
    [dispatch],
  );

  const selectTab: SelectTabMethod = React.useCallback(
    (routeKey: string) => {
      dispatch({ type: 'tab-select', routeKey });
    },
    [dispatch],
  );


  return React.useMemo(() => ({
    setRouteOptions,
    selectTab
  }), [setRouteOptions, selectTab]);
}
