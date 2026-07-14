import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import { SettingsPicker, SettingsSwitch } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import type {
  StackHeaderConfigRef,
  StackHeaderToolbarMenuBaseAndroid,
  StackHeaderToolbarMenuElementOptionsAndroid,
} from 'react-native-screens/experimental';
import type { PlatformIconAndroid } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';

// Every disable-relevant element: a toolbar action button, an overflow
// action item, a checkable group (one item starts checked), and a submenu
// with a leaf item.
const ALL_IDS = [
  'action-bar',
  'action-overflow',
  'opt-a',
  'opt-b',
  'submenu',
  'sub-item',
] as const;
type AllIds = (typeof ALL_IDS)[number];

type CmdDisabledOption = 'no change' | 'true' | 'false' | 'undefined';

const CMD_DISABLED_OPTIONS: CmdDisabledOption[] = [
  'no change',
  'true',
  'false',
  'undefined',
];

type DisabledById = Record<AllIds, boolean>;

const DEFAULT_DISABLED: DisabledById = {
  'action-bar': false,
  'action-overflow': false,
  'opt-a': false,
  'opt-b': false,
  submenu: false,
  'sub-item': false,
};

const ITEM_LABELS: Record<AllIds, string> = {
  'action-bar': 'action-bar (toolbar button)',
  'action-overflow': 'action-overflow',
  'opt-a': 'opt-a (checkable, checked)',
  'opt-b': 'opt-b (checkable)',
  submenu: 'submenu',
  'sub-item': 'sub-item',
};

const SEARCH_ICON: PlatformIconAndroid = {
  type: 'imageSource',
  imageSource: require('@assets/search_black.png'),
};

function buildMenu(
  disabled: DisabledById,
  onItemPress: (id: string) => void,
  onGroupChange: (groupId: string, selectedIds: string[]) => void,
): StackHeaderToolbarMenuBaseAndroid {
  return {
    groups: [
      {
        groupId: 'options',
        singleSelection: false,
        onSelectionChange: ids => onGroupChange('options', ids),
      },
    ],
    children: [
      {
        type: 'menuItem',
        id: 'action-bar',
        title: 'Action Bar',
        showAsAction: 'always',
        icon: SEARCH_ICON,
        iconTintColorNormal: Colors.PurpleLight100,
        iconTintColorDisabled: Colors.PurpleLight60,
        disabled: disabled['action-bar'],
        onPress: () => onItemPress('action-bar'),
      },
      {
        type: 'menuItem',
        id: 'action-overflow',
        title: 'Action Overflow',
        showAsAction: 'never',
        disabled: disabled['action-overflow'],
        onPress: () => onItemPress('action-overflow'),
      },
      {
        type: 'menuItem',
        id: 'opt-a',
        title: 'Option A',
        groupId: 'options',
        initialToggleState: true,
        disabled: disabled['opt-a'],
      },
      {
        type: 'menuItem',
        id: 'opt-b',
        title: 'Option B',
        groupId: 'options',
        disabled: disabled['opt-b'],
      },
      {
        type: 'menu',
        id: 'submenu',
        title: 'More',
        disabled: disabled.submenu,
        children: [
          {
            type: 'menuItem',
            id: 'sub-item',
            title: 'Sub Item',
            disabled: disabled['sub-item'],
            onPress: () => onItemPress('sub-item'),
          },
        ],
      },
    ],
  };
}

const HEADER_TITLE = 'Toolbar Menu Disabled Test';

function TestStackToolbarMenuDisabled() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Main',
          Component: MainScreen,
          options: {
            headerConfig: {
              title: HEADER_TITLE,
              android: {
                toolbarMenu: buildMenu(
                  DEFAULT_DISABLED,
                  () => {},
                  () => {},
                ),
              },
            },
          },
        },
      ]}
    />
  );
}

function MainScreen() {
  const [disabledById, setDisabledById] =
    useState<DisabledById>(DEFAULT_DISABLED);
  const [lastEvent, setLastEvent] = useState<string | null>(null);

  const [cmdTargetId, setCmdTargetId] = useState<AllIds>('action-bar');
  const [cmdDisabled, setCmdDisabled] =
    useState<CmdDisabledOption>('no change');

  const headerConfigRef = useRef<StackHeaderConfigRef>(null);
  const { setRouteOptions, routeKey } = useStackNavigationContext();

  const handleItemPress = useCallback((id: string) => {
    setLastEvent(`Pressed: ${id}`);
  }, []);

  const handleGroupChange = useCallback(
    (groupId: string, selectedIds: string[]) => {
      setLastEvent(`${groupId}: ${JSON.stringify(selectedIds)}`);
    },
    [],
  );

  useLayoutEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig: {
        title: HEADER_TITLE,
        android: {
          toolbarMenu: buildMenu(
            DEFAULT_DISABLED,
            handleItemPress,
            handleGroupChange,
          ),
        },
      },
      headerConfigRef,
    });
  }, [setRouteOptions, routeKey, handleItemPress, handleGroupChange]);

  const applyDisabled = useCallback(
    (next: DisabledById) => {
      setDisabledById(next);
      setRouteOptions(routeKey, {
        headerConfig: {
          title: HEADER_TITLE,
          android: {
            toolbarMenu: buildMenu(next, handleItemPress, handleGroupChange),
          },
        },
      });
    },
    [setRouteOptions, routeKey, handleItemPress, handleGroupChange],
  );

  const sendCommand = useCallback(() => {
    const options: StackHeaderToolbarMenuElementOptionsAndroid = {
      ...(cmdDisabled !== 'no change' && {
        disabled:
          cmdDisabled === 'undefined' ? undefined : cmdDisabled === 'true',
      }),
    };
    headerConfigRef.current?.android?.updateToolbarMenuElements({
      id: cmdTargetId,
      options,
    });
  }, [cmdTargetId, cmdDisabled]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Last Event</Text>
      <Text style={styles.result}>{lastEvent ?? '—'}</Text>

      <Text style={styles.heading}>Send Command</Text>
      <SettingsPicker<AllIds>
        label="target id"
        value={cmdTargetId}
        items={[...ALL_IDS]}
        onValueChange={setCmdTargetId}
      />
      <SettingsPicker<CmdDisabledOption>
        label="disabled"
        value={cmdDisabled}
        items={CMD_DISABLED_OPTIONS}
        onValueChange={setCmdDisabled}
      />
      <Button title="Send Command" onPress={sendCommand} />

      <Text style={styles.heading}>Menu Items — Props</Text>
      {ALL_IDS.map(id => (
        <SettingsSwitch
          key={id}
          label={`disable ${ITEM_LABELS[id]}`}
          value={disabledById[id]}
          onValueChange={v => applyDisabled({ ...disabledById, [id]: v })}
        />
      ))}
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
  result: {
    fontSize: 15,
    paddingHorizontal: 10,
  },
});

export default createScenario(
  TestStackToolbarMenuDisabled,
  scenarioDescription,
);
