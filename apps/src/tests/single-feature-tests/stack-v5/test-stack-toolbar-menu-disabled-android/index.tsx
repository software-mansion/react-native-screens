import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { SettingsPicker, SettingsSwitch } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import {
  type StackHeaderConfigRef,
  type StackHeaderToolbarMenuBaseAndroid,
  type StackHeaderToolbarMenuElementOptionsAndroid,
  ScrollViewMarker,
} from 'react-native-screens';
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

// The types below are exported for the e2e test covering this screen.
export type AllIds = (typeof ALL_IDS)[number];

export type CmdDisabledOption = 'no change' | 'true' | 'false' | 'undefined';

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

// Switch labels, rendered by `SettingsSwitch` as `disable ${label}: ${value}`.
const ITEM_LABELS = {
  'action-bar': 'action-bar (toolbar button)',
  'action-overflow': 'action-overflow',
  'opt-a': 'opt-a (checkable, checked)',
  'opt-b': 'opt-b (checkable)',
  submenu: 'submenu',
  'sub-item': 'sub-item',
} as const satisfies Record<AllIds, string>;

export type ItemLabels = typeof ITEM_LABELS;

// Menu element titles. Kept in one place so the e2e test can address a popup
// row by the same string the menu is built from.
const ELEMENT_TITLES = {
  'action-bar': 'Action Bar',
  'action-overflow': 'Action Overflow',
  'opt-a': 'Option A',
  'opt-b': 'Option B',
  submenu: 'More',
  'sub-item': 'Sub Item',
} as const satisfies Record<AllIds, string>;

export type ElementTitles = typeof ELEMENT_TITLES;

// Shown by **Last Event** until the first `onPress` / `onSelectionChange`.
const NO_EVENT = '—';

export type NoEvent = typeof NO_EVENT;

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
        title: ELEMENT_TITLES['action-bar'],
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
        title: ELEMENT_TITLES['action-overflow'],
        showAsAction: 'never',
        disabled: disabled['action-overflow'],
        onPress: () => onItemPress('action-overflow'),
      },
      {
        type: 'menuItem',
        id: 'opt-a',
        title: ELEMENT_TITLES['opt-a'],
        groupId: 'options',
        initialToggleState: true,
        disabled: disabled['opt-a'],
      },
      {
        type: 'menuItem',
        id: 'opt-b',
        title: ELEMENT_TITLES['opt-b'],
        groupId: 'options',
        disabled: disabled['opt-b'],
      },
      {
        type: 'menu',
        id: 'submenu',
        title: ELEMENT_TITLES.submenu,
        disabled: disabled.submenu,
        children: [
          {
            type: 'menuItem',
            id: 'sub-item',
            title: ELEMENT_TITLES['sub-item'],
            disabled: disabled['sub-item'],
            onPress: () => onItemPress('sub-item'),
          },
        ],
      },
    ],
  };
}

const HEADER_TITLE = 'Toolbar Menu Disabled Test';

export type HeaderTitle = typeof HEADER_TITLE;

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
    <ScrollViewMarker style={styles.scrollViewMarker}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        testID="toolbar-menu-disabled-scrollview">
        <Text style={styles.heading}>Last Event</Text>
        <Text testID="last-event-text" style={styles.result}>
          {lastEvent ?? NO_EVENT}
        </Text>

        <Text style={styles.heading}>Send Command</Text>
        <SettingsPicker<AllIds>
          label="target id"
          value={cmdTargetId}
          items={[...ALL_IDS]}
          onValueChange={setCmdTargetId}
          testID="cmd-target-picker"
        />
        <SettingsPicker<CmdDisabledOption>
          label="disabled"
          value={cmdDisabled}
          items={CMD_DISABLED_OPTIONS}
          onValueChange={setCmdDisabled}
          testID="cmd-disabled-picker"
        />
        <Button
          title="Send Command"
          onPress={sendCommand}
          testID="send-command-button"
        />

        <Text style={styles.heading}>Menu Items — Props</Text>
        {ALL_IDS.map(id => (
          <SettingsSwitch
            key={id}
            label={`disable ${ITEM_LABELS[id]}`}
            value={disabledById[id]}
            onValueChange={v => applyDisabled({ ...disabledById, [id]: v })}
            testID={`disable-${id}-switch`}
          />
        ))}
      </ScrollView>
    </ScrollViewMarker>
  );
}

const styles = StyleSheet.create({
  scrollViewMarker: {
    flex: 1,
  },
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
