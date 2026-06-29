import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import {
  SettingsPicker,
  SettingsSwitch,
  ToastProvider,
  useToast,
} from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import type {
  StackHeaderConfigRef,
  StackHeaderToolbarMenuBaseAndroid,
  StackHeaderToolbarMenuItemOptionsAndroid,
} from 'react-native-screens/experimental';
import { scenarioDescription } from './scenario-description';

const ALL_IDS = [
  'red',
  'green',
  'blue',
  'small',
  'medium',
  'large',
  'share',
  'light',
  'dark',
  'info',
] as const;
type AllIds = (typeof ALL_IDS)[number];

type CmdCheckedOption = 'no change' | 'true' | 'false';
type CmdTitleOption = 'no change' | 'Changed' | 'undefined';
type CmdHiddenOption = 'no change' | 'true' | 'false' | 'undefined';

const CMD_CHECKED_OPTIONS: CmdCheckedOption[] = ['no change', 'true', 'false'];
const CMD_TITLE_OPTIONS: CmdTitleOption[] = [
  'no change',
  'Changed',
  'undefined',
];
const CMD_HIDDEN_OPTIONS: CmdHiddenOption[] = [
  'no change',
  'true',
  'false',
  'undefined',
];

interface MenuConfig {
  singleSelectionOnColors: boolean;
  includeBlue: boolean;
  dividerEnabled: boolean;
}

const DEFAULT_CONFIG: MenuConfig = {
  singleSelectionOnColors: false,
  includeBlue: true,
  dividerEnabled: false,
};

function buildMenu(
  config: MenuConfig,
  onItemPress: (id: string) => void,
  onGroupChange: (groupId: string, selectedIds: string[]) => void,
): StackHeaderToolbarMenuBaseAndroid {
  const colorItems = [
    {
      type: 'menuItem' as const,
      id: 'red',
      title: 'Red',
      groupId: 'colors',
      initialToggleState: true,
    },
    {
      type: 'menuItem' as const,
      id: 'green',
      title: 'Green',
      groupId: 'colors',
    },
    ...(config.includeBlue
      ? [
          {
            type: 'menuItem' as const,
            id: 'blue',
            title: 'Blue',
            groupId: 'colors',
          },
        ]
      : []),
  ];

  return {
    groups: [
      {
        groupId: 'colors',
        singleSelection: config.singleSelectionOnColors,
        onSelectionChange: ids => onGroupChange('colors', ids),
      },
      {
        groupId: 'size',
        singleSelection: true,
        onSelectionChange: ids => onGroupChange('size', ids),
      },
    ],
    children: [
      ...colorItems,
      {
        type: 'menuItem',
        id: 'small',
        title: 'Small',
        groupId: 'size',
      },
      {
        type: 'menuItem',
        id: 'medium',
        title: 'Medium',
        groupId: 'size',
        initialToggleState: true,
      },
      {
        type: 'menuItem',
        id: 'large',
        title: 'Large',
        groupId: 'size',
      },
      {
        type: 'menuItem',
        id: 'share',
        title: 'Share',
        onPress: () => onItemPress('share'),
      },
      {
        type: 'menu',
        id: 'sub',
        title: 'More',
        groups: [
          {
            groupId: 'theme',
            singleSelection: true,
            onSelectionChange: ids => onGroupChange('theme', ids),
          },
        ],
        children: [
          {
            type: 'menuItem',
            id: 'light',
            title: 'Light',
            groupId: 'theme',
            initialToggleState: true,
          },
          {
            type: 'menuItem',
            id: 'dark',
            title: 'Dark',
            groupId: 'theme',
          },
          {
            type: 'menuItem',
            id: 'info',
            title: 'Info',
            onPress: () => onItemPress('info'),
          },
        ],
      },
    ],
  };
}

const HEADER_TITLE = 'Toolbar Menu Groups Test';

function TestStackToolbarMenuGroups() {
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
                android: {
                  toolbarMenu: buildMenu(
                    DEFAULT_CONFIG,
                    () => {},
                    () => {},
                  ),
                },
              },
            },
          },
        ]}
      />
    </ToastProvider>
  );
}

function MainScreen() {
  const [config, setConfig] = useState<MenuConfig>(DEFAULT_CONFIG);
  const [lastEvent, setLastEvent] = useState<string | null>(null);

  const [cmdTargetId, setCmdTargetId] = useState<AllIds>('red');
  const [cmdChecked, setCmdChecked] = useState<CmdCheckedOption>('no change');
  const [cmdTitle, setCmdTitle] = useState<CmdTitleOption>('no change');
  const [cmdHidden, setCmdHidden] = useState<CmdHiddenOption>('no change');

  const headerConfigRef = useRef<StackHeaderConfigRef>(null);
  const { setRouteOptions, routeKey } = useStackNavigationContext();
  const toast = useToast();

  const showToast = useCallback(
    (text: string) => {
      toast.push({ backgroundColor: Colors.GreenDark120, message: text });
    },
    [toast],
  );

  const handleItemPress = useCallback(
    (id: string) => {
      const msg = `Pressed: ${id}`;
      setLastEvent(msg);
      showToast(msg);
    },
    [showToast],
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
          toolbarMenu: buildMenu(config, handleItemPress, handleGroupChange),
          toolbarMenuGroupDividerEnabled: config.dividerEnabled,
        },
      },
      headerConfigRef,
    });
  }, [setRouteOptions, routeKey, handleItemPress, handleGroupChange, config]);

  const applyConfig = useCallback(
    (next: MenuConfig) => {
      setConfig(next);
      setRouteOptions(routeKey, {
        headerConfig: {
          title: HEADER_TITLE,
          android: {
            toolbarMenu: buildMenu(next, handleItemPress, handleGroupChange),
            toolbarMenuGroupDividerEnabled: next.dividerEnabled,
          },
        },
      });
    },
    [setRouteOptions, routeKey, handleItemPress, handleGroupChange],
  );

  const sendCommand = useCallback(() => {
    const options: StackHeaderToolbarMenuItemOptionsAndroid = {
      ...(cmdChecked !== 'no change' && { checked: cmdChecked === 'true' }),
      ...(cmdTitle !== 'no change' && {
        title: cmdTitle === 'undefined' ? undefined : cmdTitle,
      }),
      ...(cmdHidden !== 'no change' && {
        hidden: cmdHidden === 'undefined' ? undefined : cmdHidden === 'true',
      }),
    };
    headerConfigRef.current?.android?.setToolbarMenuItemOptions(
      cmdTargetId,
      options,
    );
  }, [cmdTargetId, cmdChecked, cmdTitle, cmdHidden]);

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
      <SettingsPicker<CmdCheckedOption>
        label="checked"
        value={cmdChecked}
        items={CMD_CHECKED_OPTIONS}
        onValueChange={setCmdChecked}
      />
      <SettingsPicker<CmdTitleOption>
        label="title"
        value={cmdTitle}
        items={CMD_TITLE_OPTIONS}
        onValueChange={setCmdTitle}
      />
      <SettingsPicker<CmdHiddenOption>
        label="hidden"
        value={cmdHidden}
        items={CMD_HIDDEN_OPTIONS}
        onValueChange={setCmdHidden}
      />
      <Button title="Send Command" onPress={sendCommand} />

      <Text style={styles.heading}>Menu Config — Props</Text>
      <SettingsSwitch
        label="singleSelection on colors"
        value={config.singleSelectionOnColors}
        onValueChange={v =>
          applyConfig({ ...config, singleSelectionOnColors: v })
        }
      />
      <SettingsSwitch
        label="include Blue"
        value={config.includeBlue}
        onValueChange={v => applyConfig({ ...config, includeBlue: v })}
      />
      <SettingsSwitch
        label="divider enabled"
        value={config.dividerEnabled}
        onValueChange={v => applyConfig({ ...config, dividerEnabled: v })}
      />
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

export default createScenario(TestStackToolbarMenuGroups, scenarioDescription);
