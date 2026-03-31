import React from 'react';
import { Tabs } from "react-native-screens";
import type { TabRoute, TabRouteConfig, TabsNavigationMethods } from './TabsContainer.types';
import { SafeAreaView, type SafeAreaViewProps } from 'react-native-screens/experimental';
import { Platform } from 'react-native';
import { TabsNavigationContext } from './contexts/TabsNavigationContext';
import { RNSLog } from 'react-native-screens/private';

export type TabsContainerItemProps = {
  route: TabRoute;
  navMethods: TabsNavigationMethods;
  isSelected: boolean;
  pendingForUpdate: boolean;
}

export const TabsContainerItem = React.memo(TabsContainerItemImpl);

function TabsContainerItemImpl(props: TabsContainerItemProps) {

  RNSLog.info(
    `TabsContainerItem render: ${props.route.routeKey} ${props.isSelected ? '(selected)' : ''
    } ${props.pendingForUpdate ? '(pending)' : ''}`,
  );

  const tabsNavigationContext = React.useMemo(() => {
    return {
      routeKey: props.route.routeKey,
      routeOptions: { ...props.route.options },
      setRouteOptions: props.navMethods.setRouteOptions,
      selectTab: props.navMethods.selectTab,
      isSelected: props.isSelected,
      shouldRenderContents: props.isSelected || props.pendingForUpdate,
    }
  }, [props.route.routeKey, props.route.options, props.navMethods, props.isSelected, props.pendingForUpdate]);

  const { safeAreaConfiguration, ...nativeOptions } = props.route.options ?? {};

  const screenKey = props.route.routeKey;

  return (
    <Tabs.Screen
      key={screenKey}
      {...nativeOptions}
      screenKey={screenKey}>
      <TabsNavigationContext value={tabsNavigationContext}>
        {getContent(props.route.Component, safeAreaConfiguration)}
      </TabsNavigationContext>
    </Tabs.Screen>
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

