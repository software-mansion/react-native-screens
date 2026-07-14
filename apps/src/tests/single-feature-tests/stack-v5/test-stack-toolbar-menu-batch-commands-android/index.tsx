import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import { Colors } from '@apps/shared/styling';
import type {
  StackHeaderConfigRef,
  StackHeaderToolbarMenuBaseAndroid,
} from 'react-native-screens/experimental';
import type { PlatformIconAndroid } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';

const FRUIT_IDS = ['apple', 'banana', 'cherry', 'date'] as const;

const FRUIT_ITEMS: { id: string; title: string }[] = [
  { id: 'apple', title: 'Apple' },
  { id: 'banana', title: 'Banana' },
  { id: 'cherry', title: 'Cherry' },
  { id: 'date', title: 'Date' },
];

const VIEW_ITEMS: { id: string; title: string }[] = [
  { id: 'list', title: 'List' },
  { id: 'grid', title: 'Grid' },
];

function buildMenu(
  onGroupChange: (groupId: string, selectedIds: string[]) => void,
): StackHeaderToolbarMenuBaseAndroid {
  return {
    groups: [
      {
        groupId: 'fruits',
        singleSelection: false,
        onSelectionChange: ids => onGroupChange('fruits', ids),
      },
      {
        groupId: 'view',
        singleSelection: true,
        onSelectionChange: ids => onGroupChange('view', ids),
      },
    ],
    children: [
      ...FRUIT_ITEMS.map(({ id, title }) => ({
        type: 'menuItem' as const,
        id,
        title,
        groupId: 'fruits',
        initialToggleState: id === 'apple',
      })),
      ...VIEW_ITEMS.map(({ id, title }) => ({
        type: 'menuItem' as const,
        id,
        title,
        groupId: 'view',
        initialToggleState: id === 'list',
      })),
    ],
  };
}

const HEADER_TITLE = 'Toolbar Menu Batch Commands Test';

function TestStackToolbarMenuBatchCommands() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Main',
          Component: MainScreen,
          options: {
            headerConfig: {
              title: HEADER_TITLE,
              android: { toolbarMenu: buildMenu(() => {}) },
            },
          },
        },
      ]}
    />
  );
}

function MainScreen() {
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [eventCount, setEventCount] = useState(0);
  const [appleInToolbar, setAppleInToolbar] = useState(false);

  const headerConfigRef = useRef<StackHeaderConfigRef>(null);
  const { setRouteOptions, routeKey } = useStackNavigationContext();

  const handleGroupChange = useCallback(
    (groupId: string, selectedIds: string[]) => {
      const msg = `${groupId}: ${JSON.stringify(selectedIds)}`;
      setEventCount(prev => prev + 1);
      setEventLog(prev => [msg, ...prev].slice(0, 6));
    },
    [],
  );

  useLayoutEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig: {
        title: HEADER_TITLE,
        android: {
          toolbarMenu: buildMenu(handleGroupChange),
        },
      },
      headerConfigRef,
    });
  }, [setRouteOptions, routeKey, handleGroupChange]);

  // A large image with a random seed each call, so every download is unique and
  // uncached (even across app restarts) and the async load stays visibly slow.
  // Requires network access. The icon is only visible while Apple is shown in
  // the toolbar (overflow menu items don't render icons).
  const nextPhotoIcon = useCallback((): PlatformIconAndroid => {
    const seed = Math.floor(Math.random() * 1_000_000_000);
    return {
      type: 'imageSource',
      imageSource: {
        uri: `https://picsum.photos/seed/rns-${seed}/5000`,
      },
    };
  }, []);

  const resetLog = useCallback(() => {
    setEventLog([]);
    setEventCount(0);
  }, []);

  // Case #1: a multi-element batch fires one coalesced event per affected
  // group (not one per checked item).
  const selectAll = useCallback(() => {
    headerConfigRef.current?.android?.updateToolbarMenuElements(
      FRUIT_IDS.map(id => ({ id, options: { checked: true } })),
    );
  }, []);

  const deselectAll = useCallback(() => {
    headerConfigRef.current?.android?.updateToolbarMenuElements(
      FRUIT_IDS.map(id => ({ id, options: { checked: false } })),
    );
  }, []);

  // Case #2: one batch touching two groups emits one coalesced event PER
  // affected group, in update order (fruits, then view).
  const batchAcrossGroups = useCallback(() => {
    headerConfigRef.current?.android?.updateToolbarMenuElements([
      { id: 'cherry', options: { checked: true } },
      { id: 'grid', options: { checked: true } },
    ]);
  }, []);

  // Case #3: a single-object (non-array) argument is normalized to a
  // one-element batch.
  const singleObjectUpdate = useCallback(() => {
    headerConfigRef.current?.android?.updateToolbarMenuElements({
      id: 'banana',
      options: { checked: true },
    });
  }, []);

  // showAsAction is updatable via the view command — moves Apple between the
  // toolbar (icon visible) and the overflow menu (checkbox visible) at runtime.
  const toggleAppleShowAsAction = useCallback(() => {
    headerConfigRef.current?.android?.updateToolbarMenuElements({
      id: 'apple',
      options: { showAsAction: appleInToolbar ? 'never' : 'always' },
    });
    setAppleInToolbar(prev => !prev);
  }, [appleInToolbar]);

  // Case #4: a batch mixing an async image load (Apple) with a plain check
  // (cherry) is applied atomically — the icon appears and the single fruits
  // event fires together, only after the image has loaded, never cherry first
  // and Apple later.
  const batchWithImageLoad = useCallback(() => {
    headerConfigRef.current?.android?.updateToolbarMenuElements([
      { id: 'apple', options: { checked: true, icon: nextPhotoIcon() } },
      { id: 'cherry', options: { checked: true } },
    ]);
  }, [nextPhotoIcon]);

  // Case #5: two back-to-back commands on Apple. The first loads a slow remote
  // image alongside checked:true; the second unchecks Apple synchronously. With
  // the queue they are serialized, so the LAST event reflects the SECOND
  // command (Apple absent). Without it, the first command's late download would
  // land last and wrongly re-check Apple.
  const runOrderingRace = useCallback(() => {
    const android = headerConfigRef.current?.android;
    android?.updateToolbarMenuElements([
      { id: 'apple', options: { checked: true, icon: nextPhotoIcon() } },
    ]);
    android?.updateToolbarMenuElements([
      { id: 'apple', options: { checked: false } },
    ]);
  }, [nextPhotoIcon]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Batch Commands</Text>
      <View style={styles.buttons}>
        <Button title="Select All (1 event)" onPress={selectAll} />
        <Button title="Deselect All (1 event)" onPress={deselectAll} />
        <Button
          title="Batch across groups (2 events)"
          onPress={batchAcrossGroups}
        />
        <Button
          title="Single object update (1 event)"
          onPress={singleObjectUpdate}
        />
        <Button
          title={
            appleInToolbar ? 'Move Apple to overflow' : 'Move Apple to toolbar'
          }
          onPress={toggleAppleShowAsAction}
        />
        <Button
          title="Batch: image + check (atomic)"
          onPress={batchWithImageLoad}
        />
        <Button
          title="Ordering race (last: Apple absent)"
          onPress={runOrderingRace}
        />
        <Button title="Reset log (menu state kept)" onPress={resetLog} />
      </View>

      <Text style={styles.hint}>
        Move Apple to the toolbar to see its loaded icon (overflow items
        don&apos;t render icons); its checkbox is only visible in the overflow
        menu. Icon &amp; showAsAction changes emit no events. Menu checked state
        persists across taps — Reset log clears only the counter and log.
      </Text>

      <Text style={styles.heading}>Events received: {eventCount}</Text>
      <Text style={styles.subheading}>Newest first</Text>
      {eventLog.length === 0 ? (
        <Text style={styles.result}>—</Text>
      ) : (
        eventLog.map((entry, i) => (
          <Text key={`${i}-${entry}`} style={styles.result}>
            {i === 0 ? '▶ ' : '  '}
            {entry}
          </Text>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: Colors.cardBackground,
  },
  content: {
    padding: 10,
    paddingBottom: 50,
    gap: 6,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  subheading: {
    fontSize: 13,
    color: Colors.primary,
  },
  hint: {
    fontSize: 13,
    color: Colors.primary,
    marginTop: 8,
  },
  buttons: {
    gap: 8,
  },
  result: {
    fontSize: 15,
    paddingHorizontal: 10,
  },
});

export default createScenario(
  TestStackToolbarMenuBatchCommands,
  scenarioDescription,
);
