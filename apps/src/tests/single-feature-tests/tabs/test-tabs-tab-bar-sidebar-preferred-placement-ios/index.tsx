import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  useTabsHostConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/containers/tabs';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import React, { useState } from 'react';
import { Button, ScrollView, Text } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { SettingsPicker } from '@apps/shared';
import type {
  TabBarControllerMode,
  TabBarSidebarPreferredPlacement,
} from 'react-native-screens';
import { SafeAreaView } from 'react-native-screens/experimental';
import type { StackHeaderConfigProps } from 'react-native-screens/components/stack/header';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';

// Header items copied from `test-stack-subviews-ios` (default: 2 leading + 2 trailing).
function ResizingItem() {
  const [large, setLarge] = useState<boolean>(false);

  return (
    <PressableWithFeedback
      onPress={() => setLarge(lg => !lg)}
      style={{
        width: large ? 60 : 20,
        height: large ? 30 : 20,
      }}
    />
  );
}

function buildHeaderConfig(title: string): StackHeaderConfigProps {
  return {
    title,
    ios: {
      leadingItems: [
        { type: 'item', id: 'leading-0', render: () => <ResizingItem /> },
        { type: 'spacer', id: 'spacer-leading-1', sizing: 'fixed', width: 100 },
        { type: 'item', id: 'leading-1', render: () => <ResizingItem /> },
      ],
      trailingItems: [
        { type: 'item', id: 'trailing-0', render: () => <ResizingItem /> },
        { type: 'spacer', id: 'spacer-trailing-1', sizing: 'flexible' },
        { type: 'item', id: 'trailing-1', render: () => <ResizingItem /> },
      ],
    },
  };
}

function ConfigScreen() {
  const { hostConfig, updateHostConfig } = useTabsHostConfig();
  const { push } = useStackNavigationContext();
  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={{ left: true, right: true, bottom: true }}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <SettingsPicker<TabBarSidebarPreferredPlacement>
          testID="tab-bar-sidebar-preferred-placement-picker"
          label="tabBarSidebarPreferredPlacement"
          value={hostConfig.ios?.tabBarSidebarPreferredPlacement ?? 'automatic'}
          onValueChange={value =>
            updateHostConfig({
              ios: { tabBarSidebarPreferredPlacement: value },
            })
          }
          items={['automatic', 'sidebar', 'tabBar']}
        />
        <SettingsPicker<TabBarControllerMode>
          testID="tab-bar-controller-mode-picker"
          value={hostConfig.ios?.tabBarControllerMode ?? 'automatic'}
          label="tabBarControllerMode"
          onValueChange={value =>
            updateHostConfig({ ios: { tabBarControllerMode: value } })
          }
          items={['automatic', 'tabBar', 'tabSidebar']}
        />
        <Button title="Push screen" onPress={() => push('Details')} />
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailsScreen() {
  const { routeKey, push, pop } = useStackNavigationContext();
  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={{ left: true, right: true, bottom: true }}>
      <CenteredLayoutView>
        <Text>{routeKey}</Text>
        <Button title="Push screen" onPress={() => push('Details')} />
        <Button title="Pop screen" onPress={() => pop(routeKey)} />
      </CenteredLayoutView>
    </SafeAreaView>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = ['Tab1', 'Tab2', 'Tab3'].map(name => ({
  name,
  element: (
    <StackContainer
      routeConfigs={[
        {
          name,
          element: <ConfigScreen />,
          options: { headerConfig: buildHeaderConfig(name) },
        },
        {
          name: 'Details',
          element: <DetailsScreen />,
          options: { headerConfig: buildHeaderConfig('Details') },
        },
      ]}
    />
  ),
  options: {
    ...DEFAULT_TAB_ROUTE_OPTIONS,
    title: name,
  },
}));

function TestTabsTabBarSidebarPreferredPlacement() {
  return <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />;
}

export default createScenario(
  TestTabsTabBarSidebarPreferredPlacement,
  scenarioDescription,
);
