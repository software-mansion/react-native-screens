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

function SquareItem() {
  const [large, setLarge] = useState(false);

  return (
    <PressableWithFeedback
      testID="header-square-item"
      onPress={() => setLarge(value => !value)}
      style={{ width: large ? 300 : 30, height: 30 }}
    />
  );
}

function buildHeaderConfig(
  squareVisibilityPriority: StackHeaderItemVisibilityPriorityIOS,
  videoVisibilityPriority: StackHeaderItemVisibilityPriorityIOS,
  searchVisibilityPriority: StackHeaderItemVisibilityPriorityIOS,
): StackHeaderConfigProps {
  return {
    title: 'Visibility priority',
    ios: {
      trailingItems: [
        {
          type: 'item',
          id: 'square',
          visibilityPriority: squareVisibilityPriority,
          render: () => <SquareItem />,
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
  const [squarePriorityIndex, setSquarePriorityIndex] = useState(0);
  const [videoPriorityIndex, setVideoPriorityIndex] = useState(0);
  const [searchPriorityIndex, setSearchPriorityIndex] = useState(0);
  const squarePriority = PRIORITIES[squarePriorityIndex]!;
  const videoPriority = PRIORITIES[videoPriorityIndex]!;
  const searchPriority = PRIORITIES[searchPriorityIndex]!;

  const headerConfig = useMemo(
    () => buildHeaderConfig(squarePriority, videoPriority, searchPriority),
    [squarePriority, videoPriority, searchPriority],
  );

  useLayoutEffect(() => {
    setRouteOptions(routeKey, { headerConfig });
  }, [headerConfig, setRouteOptions, routeKey]);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button
        testID="toggle-square-visibility-priority-button"
        title={`square visibilityPriority: ${squarePriority}`}
        onPress={() =>
          setSquarePriorityIndex(index => (index + 1) % PRIORITIES.length)
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
