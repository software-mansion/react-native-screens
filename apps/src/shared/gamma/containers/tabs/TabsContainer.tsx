import React from 'react';
import { I18nManager, Platform, type NativeSyntheticEvent } from 'react-native';
import { Tabs, type NativeFocusChangeEvent } from 'react-native-screens';
import SafeAreaView from '../../../../../../src/components/safe-area/SafeAreaView';
import type { SafeAreaViewProps } from '../../../../../../src/components/safe-area/SafeAreaView.types';
import type {
  TabRoute,
  TabRouteConfig,
  TabRouteOptions,
  TabsContainerProps,
  TabsNavState,
  TabsNavigationAction,
} from './TabsContainer.types';
import {
  TabsNavigationContext,
  type TabsNavigationContextPayload,
} from './contexts/TabsNavigationContext';
import {
  tabsNavigationReducerWithLogging,
  determineInitialTabsNavState,
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
    TabsNavState,
    React.Dispatch<TabsNavigationAction>,
  ] = React.useReducer(
    tabsNavigationReducerWithLogging,
    { routeConfigs, initialFocusedName },
    determineInitialTabsNavState,
  );

  const setRouteOptions = React.useCallback(
    (routeKey: string, options: Partial<TabRouteOptions>) => {
      dispatch({ type: 'set-options', routeKey, options });
    },
    [],
  );

  const onNativeFocusChangeCallback = React.useCallback(
    (event: NativeSyntheticEvent<NativeFocusChangeEvent>) => {
      const screenKey = event.nativeEvent.screenKey;

      // Please note that the `useTransition` hook can not be used here,
      // because it intruduces additional renders, which lead
      // to blank screens / placeholders being visible (on slower render)
      // for a few frames!
      React.startTransition(() => {
        RNSLog.info(`Starting transition to ${screenKey}`);
        dispatch({ type: 'change-tab', routeKey: screenKey });
      });
    },
    [],
  );

  return (
    <Tabs.Host
      // Use controlled tabs by default, but allow to overwrite if user wants to
      onNativeFocusChange={onNativeFocusChangeCallback}
      experimentalControlNavigationStateInJS={
        experimentalControlNavigationStateInJS
      }
      direction={I18nManager.isRTL ? 'rtl' : 'ltr'}
      {...restProps}>
      {tabsNavState.routes.map((route: TabRoute) => {
        const isFocused = route.routeKey === tabsNavState.selectedRouteKey;
        RNSLog.info(
          `TabsContainer map to component -> ${route.routeKey} ${
            isFocused ? '(focused)' : ''
          }`,
        );

        const tabsNavigationContext: TabsNavigationContextPayload = {
          routeKey: route.routeKey,
          routeOptions: { ...route.options },
          setRouteOptions,
        };

        const { safeAreaConfiguration, ...nativeOptions } =
          route.options ?? {};

        return (
          <Tabs.Screen
            key={route.routeKey}
            {...nativeOptions}
            screenKey={route.routeKey}
            isFocused={isFocused} // notice that the value passed by user is overriden here!
          >
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
