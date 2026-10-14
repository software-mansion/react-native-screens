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
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';
import { Button } from '@apps/shared';
import { styles } from '@apps/shared/styles';

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
  squareVisibilityPriority: HeaderBarButtonItemVisibilityPriority,
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
      <ScreenStackHeaderRightView visibilityPriority={squareVisibilityPriority}>
        <ResizingItem />
      </ScreenStackHeaderRightView>
    ),
  };
}

export default function Test4709() {
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

  return (
    <ScreenStack style={styles.flexContainer}>
      <ScreenStackItem
        screenId="home"
        style={StyleSheet.absoluteFill}
        headerConfig={headerConfig}>
        <View>
          <Button
            testID="toggle-visibility-priority-button"
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
        </View>
      </ScreenStackItem>
    </ScreenStack>
  );
}
