import React from 'react';
import { I18nManager, Platform, type NativeSyntheticEvent } from 'react-native';
import {
  Tabs,
  NativeFocusChangeEvent,
} from 'react-native-screens';
import SafeAreaView from '../../../../../../src/components/safe-area/SafeAreaView';
import type { SafeAreaViewProps } from '../../../../../../src/components/safe-area/SafeAreaView.types';
import type { TabRouteConfig, TabsContainerProps } from './TabsContainer.types';
import {
  TabsNavigationContext,
  type TabsNavigationContextPayload,
} from './contexts/TabsNavigationContext';
import { RNSLog } from 'react-native-screens/private';

export function TabsContainer(props: TabsContainerProps) {
  RNSLog.info('TabsContainer render');

  const {
    routeConfigs,
    initialFocusedName,
    experimentalControlNavigationStateInJS,
    ...restProps
  } = props;

  const [focusedScreenKey, setFocusedScreenKey] = React.useState<string>(() => {
    RNSLog.log('TabsContainer focusedStateKey initial state computed');

    if (routeConfigs.length === 0) {
      throw new Error('There must be at least one tab defined');
    }

    if (initialFocusedName != null) {
      return initialFocusedName;
    }

    // Default to first tab
    return routeConfigs[0].name;
  });

  const onNativeFocusChangeCallback = React.useCallback(
    (event: NativeSyntheticEvent<NativeFocusChangeEvent>) => {
      const screenKey = event.nativeEvent.screenKey;

      // Please note that the `useTransition` hook can not be used here,
      // because it intruduces additional renders, which lead
      // to blank screens / placeholders being visible (on slower render)
      // for a few frames!
      const transitionFn = React.startTransition;

      transitionFn(() => {
        RNSLog.info(`Starting transition to ${screenKey}`);
        setFocusedScreenKey(screenKey);
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
      {routeConfigs.map(routeConfig => {
        const screenKey = routeConfig.name;
        const isFocused = screenKey === focusedScreenKey;
        RNSLog.info(
          `TabsContainer map to component -> ${screenKey} ${
            isFocused ? '(focused)' : ''
          }`,
        );

        const tabsNavigationContext: TabsNavigationContextPayload = {
          routeKey: screenKey,
          routeOptions: { ...routeConfig.options },
          setRouteOptions: () => {
            // Route option updates are handled via TabsContainerWithDynamicRouteConfigs
          },
        };

        return (
          <Tabs.Screen
            key={screenKey}
            {...routeConfig.options}
            screenKey={screenKey}
            isFocused={isFocused} // notice that the value passed by user is overriden here!
          >
            <TabsNavigationContext.Provider value={tabsNavigationContext}>
              {getContent(routeConfig)}
            </TabsNavigationContext.Provider>
          </Tabs.Screen>
        );
      })}
    </Tabs.Host>
  );
}

function getContent(routeConfig: TabRouteConfig) {
  const { safeAreaConfiguration, Component } = routeConfig;

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
