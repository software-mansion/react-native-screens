import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import { ToastProvider, useToast } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import type {
  StackHeaderConfigRef,
  StackHeaderToolbarMenuBaseAndroid,
} from 'react-native-screens/experimental';
import type { PlatformIconAndroid } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';

const ITEM_IDS = ['apple', 'banana', 'cherry', 'date'] as const;

const ITEMS_CONFIG: { id: string; title: string }[] = [
  { id: 'apple', title: 'Apple' },
  { id: 'banana', title: 'Banana' },
  { id: 'cherry', title: 'Cherry' },
  { id: 'date', title: 'Date' },
];

const IMAGE_ICON: PlatformIconAndroid = {
  type: 'imageSource',
  imageSource: require('@assets/search_black.png'),
};

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
    ],
    children: ITEMS_CONFIG.map(({ id, title }) => ({
      type: 'menuItem',
      id,
      title,
      groupId: 'fruits',
      initialToggleState: id === 'apple',
    })),
  };
}

const HEADER_TITLE = 'Toolbar Menu Batch Commands Test';

function TestStackToolbarMenuBatchCommands() {
  return (
    <ToastProvider>
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
    </ToastProvider>
  );
}

function MainScreen() {
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [eventCount, setEventCount] = useState(0);

  const headerConfigRef = useRef<StackHeaderConfigRef>(null);
  const { setRouteOptions, routeKey } = useStackNavigationContext();
  const toast = useToast();

  const showToast = useCallback(
    (text: string) => {
      toast.push({ backgroundColor: Colors.GreenDark120, message: text });
    },
    [toast],
  );

  const handleGroupChange = useCallback(
    (groupId: string, selectedIds: string[]) => {
      const msg = `${groupId}: ${JSON.stringify(selectedIds)}`;
      setEventCount(prev => prev + 1);
      setEventLog(prev => [msg, ...prev].slice(0, 6));
      showToast(msg);
    },
    [showToast],
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

  const resetLog = useCallback(() => {
    setEventLog([]);
    setEventCount(0);
  }, []);

  // Case #1: one coalesced event per batch (not one per checked item).
  const selectAll = useCallback(() => {
    headerConfigRef.current?.android?.updateToolbarMenuElements(
      ITEM_IDS.map(id => ({ id, options: { checked: true } })),
    );
  }, []);

  const deselectAll = useCallback(() => {
    headerConfigRef.current?.android?.updateToolbarMenuElements(
      ITEM_IDS.map(id => ({ id, options: { checked: false } })),
    );
  }, []);

  // Case #2: a batch mixing an async image load with a plain check must still emit
  // a single event, only after the image has loaded.
  const batchWithImageLoad = useCallback(() => {
    headerConfigRef.current?.android?.updateToolbarMenuElements([
      { id: 'apple', options: { checked: true, icon: IMAGE_ICON } },
      { id: 'cherry', options: { checked: true } },
    ]);
  }, []);

  // Case #3: two back-to-back commands where the first loads an image (async) and the
  // second does not (sync). With the queue, they are serialized, so the LAST event
  // must reflect the SECOND command (apple absent). Without it, the first command's
  // late image resolution would land last and wrongly re-check apple.
  const runOrderingRace = useCallback(() => {
    const android = headerConfigRef.current?.android;
    android?.updateToolbarMenuElements([
      { id: 'apple', options: { checked: true, icon: IMAGE_ICON } },
    ]);
    android?.updateToolbarMenuElements([
      { id: 'apple', options: { checked: false } },
    ]);
  }, []);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Batch Commands</Text>
      <View style={styles.buttons}>
        <Button title="Select All (1 event)" onPress={selectAll} />
        <Button title="Deselect All (1 event)" onPress={deselectAll} />
        <Button
          title="Batch w/ image load (1 event)"
          onPress={batchWithImageLoad}
        />
        <Button
          title="Ordering race (last: apple absent)"
          onPress={runOrderingRace}
        />
        <Button title="Reset log" onPress={resetLog} />
      </View>

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
