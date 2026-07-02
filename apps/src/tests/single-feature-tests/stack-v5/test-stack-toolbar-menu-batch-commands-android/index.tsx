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
import { scenarioDescription } from './scenario-description';

const ITEM_IDS = ['apple', 'banana', 'cherry', 'date'] as const;

const ITEMS_CONFIG: { id: string; title: string }[] = [
  { id: 'apple', title: 'Apple' },
  { id: 'banana', title: 'Banana' },
  { id: 'cherry', title: 'Cherry' },
  { id: 'date', title: 'Date' },
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
  const [lastEvent, setLastEvent] = useState<string | null>(null);

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
      setLastEvent(msg);
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

  const selectAppleAndCherry = useCallback(() => {
    headerConfigRef.current?.android?.updateToolbarMenuElements([
      { id: 'apple', options: { checked: true } },
      { id: 'banana', options: { checked: false } },
      { id: 'cherry', options: { checked: true } },
      { id: 'date', options: { checked: false } },
    ]);
  }, []);

  const selectBananaSingle = useCallback(() => {
    headerConfigRef.current?.android?.updateToolbarMenuElements({
      id: 'banana',
      options: { checked: true },
    });
  }, []);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Batch Commands</Text>
      <View style={styles.buttons}>
        <Button title="Select All" onPress={selectAll} />
        <Button title="Deselect All" onPress={deselectAll} />
        <Button title="Select Apple & Cherry" onPress={selectAppleAndCherry} />
        <Button
          title="Select Banana (single object)"
          onPress={selectBananaSingle}
        />
      </View>

      <Text style={styles.heading}>Last Event</Text>
      <Text style={styles.result}>{lastEvent ?? '—'}</Text>
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
