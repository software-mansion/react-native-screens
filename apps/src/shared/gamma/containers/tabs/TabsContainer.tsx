import React from 'react';
import { I18nManager, Platform, type NativeSyntheticEvent } from 'react-native';
import {
  type TabChangeEvent,
  Tabs,
  type TabsHostNavState,
} from 'react-native-screens';
import SafeAreaView from '../../../../../../src/components/safe-area/SafeAreaView';
import type { SafeAreaViewProps } from '../../../../../../src/components/safe-area/SafeAreaView.types';
import type {
  ChangeTabMethod,
  TabRoute,
  TabRouteConfig,
  TabRouteOptions,
  TabsContainerProps,
  TabsContainerState,
  TabsNavigationAction,
} from './TabsContainer.types';
import {
  TabsNavigationContext,
  type TabsNavigationContextPayload,
} from './contexts/TabsNavigationContext';
import {
  tabsNavigationReducerWithLogging,
  determineInitialTabsContainerState,
} from './reducer';
import { RNSLog } from 'react-native-screens/private';

export function TabsContainer(props: TabsContainerProps) {
  RNSLog.info('TabsContainer render');

  const {
    routeConfigs,
    initialFocusedName,
    experimentalControlNavigationStateInJS,
    ...restProps
  } = props;

  useSanitizeRouteConfigs(routeConfigs);

  const [tabsNavState, dispatch]: [
    TabsContainerState,
    React.Dispatch<TabsNavigationAction>,
  ] = React.useReducer(
    tabsNavigationReducerWithLogging,
    { routeConfigs, initialFocusedName },
    determineInitialTabsContainerState,
  );

  const setRouteOptions = React.useCallback(
    (routeKey: string, options: Partial<TabRouteOptions>) => {
      dispatch({ type: 'set-options', routeKey, options });
    },
    [],
  );

  const hostNavState = useTabsHostNavState(tabsNavState);

  const onTabChangeCallback = React.useCallback(
    (event: NativeSyntheticEvent<TabChangeEvent>) => {
      const screenKey = event.nativeEvent.selectedScreenKey;
      console.log(`[Tabs] onTabChangeCallback: ${screenKey}`);

      // Please note that the `useTransition` hook can not be used here,
      // because it intruduces additional renders, which lead
      // to blank screens / placeholders being visible (on slower render)
      // for a few frames!
      React.startTransition(() => {
        RNSLog.info(`Starting transition to ${screenKey}`);
        dispatch({
          type: 'native-tab-change',
          routeKey: screenKey,
          nativeEvent: event.nativeEvent,
        });
      });
    },
    [],
  );

  const tabChangeActionMethod: ChangeTabMethod = React.useCallback(
    (routeKey: string) => {
      dispatch({ type: 'tab-change', routeKey });
    },
    [],
  );

  return (
    <Tabs.Host
      // Use controlled tabs by default, but allow to overwrite if user wants to
      navState={hostNavState}
      onTabChange={onTabChangeCallback}
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

        RNSLog.info(
          `TabsContainer map to component -> ${route.routeKey} ${
            isSelected ? '(selected)' : ''
          }`,
        );

        const tabsNavigationContext: TabsNavigationContextPayload = {
          routeKey: route.routeKey,
          routeOptions: { ...route.options },
          setRouteOptions,
          changeTabTo: tabChangeActionMethod,
          isSelected: isSelected,
          shouldRenderContents: isSelected || pendingForUpdate,
        };

        const { safeAreaConfiguration, ...nativeOptions } = route.options ?? {};

        return (
          <Tabs.Screen
            key={route.routeKey}
            {...nativeOptions}
            screenKey={route.routeKey}>
            <TabsNavigationContext value={tabsNavigationContext}>
              {getContent(route.Component, safeAreaConfiguration)}
            </TabsNavigationContext>
          </Tabs.Screen>
        );
      })}
    </Tabs.Host>
  );
}

function getContent(
  Component: TabRouteConfig['Component'],
  safeAreaConfiguration: SafeAreaViewProps | undefined,
) {
  const safeAreaConfigurationWithDefault = getSafeAreaViewEdges(
    safeAreaConfiguration?.edges,
  );

  const anySAVEdgeSet = Object.values(safeAreaConfigurationWithDefault).some(
    edge => edge === true,
  );

  if (anySAVEdgeSet) {
    return (
      <SafeAreaView {...safeAreaConfiguration}>
        <Component />
      </SafeAreaView>
    );
  }

  return <Component />;
}

function getSafeAreaViewEdges(
  edges?: SafeAreaViewProps['edges'],
): NonNullable<SafeAreaViewProps['edges']> {
  let defaultEdges: SafeAreaViewProps['edges'];

  switch (Platform.OS) {
    case 'android':
      defaultEdges = { bottom: true };
      break;
    default:
      defaultEdges = {};
      break;
  }

  return { ...defaultEdges, ...edges };
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
