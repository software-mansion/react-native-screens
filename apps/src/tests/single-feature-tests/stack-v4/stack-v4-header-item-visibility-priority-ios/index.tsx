import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  ScreenStack,
  ScreenStackHeaderRightView,
  ScreenStackItem,
} from 'react-native-screens';
import type {
  HeaderBarButtonItemVisibilityPriority,
  ScreenStackHeaderConfigProps,
} from 'react-native-screens';
import { createScenario } from '@apps/tests/shared/helpers';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';
import { Button } from '@apps/shared';
import { styles } from '@apps/shared/styles';
import { scenarioDescription } from './scenario-description';

const PRIORITIES: HeaderBarButtonItemVisibilityPriority[] = [
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
  visibilityPriority: HeaderBarButtonItemVisibilityPriority,
  videoVisibilityPriority: HeaderBarButtonItemVisibilityPriority,
  searchVisibilityPriority: HeaderBarButtonItemVisibilityPriority,
): ScreenStackHeaderConfigProps {
  return {
    title: 'Visibility priority',
    headerRightBarButtonItems: [
      {
        type: 'button',
        index: 1,
        title: 'Video',
        icon: { type: 'sfSymbol', name: 'video' },
        visibilityPriority: videoVisibilityPriority,
        onPress: () => {},
      },
      {
        type: 'button',
        index: 2,
        title: 'Search',
        icon: { type: 'sfSymbol', name: 'magnifyingglass' },
        visibilityPriority: searchVisibilityPriority,
        onPress: () => {},
      },
    ],
    children: (
      <ScreenStackHeaderRightView visibilityPriority={visibilityPriority}>
        <ResizingItem />
      </ScreenStackHeaderRightView>
    ),
  };
}

export function TestStackV4HeaderItemVisibilityPriorityIOS() {
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

  return (
    <ScreenStack style={styles.flexContainer}>
      <ScreenStackItem
        screenId="home"
        style={StyleSheet.absoluteFill}
        headerConfig={headerConfig}>
        <View>
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
          {/* <Button
            testID="toggle-search-visibility-priority-button"
            title={`search visibilityPriority: ${searchPriority}`}
            onPress={() =>
              setSearchPriorityIndex(index => (index + 1) % PRIORITIES.length)
            }
          /> */}
        </View>
      </ScreenStackItem>
    </ScreenStack>
  );
}

export default createScenario(
  TestStackV4HeaderItemVisibilityPriorityIOS,
  scenarioDescription,
);
