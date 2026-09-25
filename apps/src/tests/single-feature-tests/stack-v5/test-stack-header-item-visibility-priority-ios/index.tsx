import React, { useLayoutEffect, useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import type {
  StackHeaderConfigProps,
  StackHeaderItemVisibilityPriorityIOS,
} from 'react-native-screens/components/stack/header';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';
import { Button } from '@apps/shared';
import { scenarioDescription } from './scenario-description';

const PRIORITIES: StackHeaderItemVisibilityPriorityIOS[] = [
  'standard',
  'high',
  'low',
];

function ResizingItem() {
  const [large, setLarge] = useState(false);

  return (
    <PressableWithFeedback
      testID="header-resizing-item"
      onPress={() => setLarge(value => !value)}
      style={{ width: large ? 300 : 30, height: 30 }}
    />
  );
}

function buildHeaderConfig(
  visibilityPriority: StackHeaderItemVisibilityPriorityIOS,
  videoVisibilityPriority: StackHeaderItemVisibilityPriorityIOS,
  searchVisibilityPriority: StackHeaderItemVisibilityPriorityIOS,
): StackHeaderConfigProps {
  return {
    title: 'Visibility priority',
    ios: {
      trailingItems: [
        {
          type: 'item',
          id: 'resizing',
          visibilityPriority,
          render: () => <ResizingItem />,
        },
        {
          type: 'item',
          id: 'video',
          title: 'Video',
          icon: { type: 'sfSymbol', name: 'video' },
          visibilityPriority: videoVisibilityPriority,
        },
        {
          type: 'item',
          id: 'search',
          title: 'Search',
          icon: { type: 'sfSymbol', name: 'magnifyingglass' },
          visibilityPriority: searchVisibilityPriority,
        },
      ],
    },
  };
}

function PriorityScreen() {
  const { setRouteOptions, routeKey } = useStackNavigationContext();
  const [priorityIndex, setPriorityIndex] = useState(0);
  const [videoPriorityIndex, setVideoPriorityIndex] = useState(0);
  const [searchPriorityIndex, setSearchPriorityIndex] = useState(0);
  const priority = PRIORITIES[priorityIndex]!;
  const videoPriority = PRIORITIES[videoPriorityIndex]!;
  const searchPriority = PRIORITIES[searchPriorityIndex]!;

  const headerConfig = useMemo(
    () => buildHeaderConfig(priority, videoPriority, searchPriority),
    [priority, videoPriority, searchPriority],
  );

  useLayoutEffect(() => {
    setRouteOptions(routeKey, { headerConfig });
  }, [headerConfig, setRouteOptions, routeKey]);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button
        testID="toggle-visibility-priority-button"
        title={`square visibilityPriority: ${priority}`}
        onPress={() =>
          setPriorityIndex(index => (index + 1) % PRIORITIES.length)
        }
      />
      <Button
        testID="toggle-video-visibility-priority-button"
        title={`video visibilityPriority: ${videoPriority}`}
        onPress={() =>
          setVideoPriorityIndex(index => (index + 1) % PRIORITIES.length)
        }
      />
      <Button
        testID="toggle-search-visibility-priority-button"
        title={`search visibilityPriority: ${searchPriority}`}
        onPress={() =>
          setSearchPriorityIndex(index => (index + 1) % PRIORITIES.length)
        }
      />
    </ScrollView>
  );
}

export function TestStackHeaderItemVisibilityPriorityIOS() {
  return (
    <StackContainer
      routeConfigs={[{ name: 'Home', element: <PriorityScreen /> }]}
    />
  );
}

export default createScenario(
  TestStackHeaderItemVisibilityPriorityIOS,
  scenarioDescription,
);
