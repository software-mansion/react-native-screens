import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import { SettingsPicker, SettingsSwitch } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import {
  type StackHeaderConfigRef,
  type StackHeaderToolbarMenuElementAndroid,
  type StackHeaderToolbarMenuItemOptionsAndroid,
} from 'react-native-screens/experimental';
import { scenarioDescription } from './scenario-description';

type AllIds =
  | 'item-top'
  | 'submenu-1'
  | 'sub-1-1'
  | 'sub-1-2'
  | 'submenu-2'
  | 'sub-2-1'
  | 'deep-menu'
  | 'deep-1';

type TitleOption = 'Title X' | 'undefined';
type HiddenOption = 'true' | 'false' | 'undefined';

type CmdTitleOption = TitleOption | 'no change';
type CmdHiddenOption = HiddenOption | 'no change';

type Submenu1TitleOption = 'Submenu A' | 'Changed' | 'undefined';

const ALL_IDS: AllIds[] = [
  'item-top',
  'submenu-1',
  'sub-1-1',
  'sub-1-2',
  'submenu-2',
  'sub-2-1',
  'deep-menu',
  'deep-1',
];
const CMD_TITLE_OPTIONS: CmdTitleOption[] = [
  'no change',
  'Title X',
  'undefined',
];
const CMD_HIDDEN_OPTIONS: CmdHiddenOption[] = [
  'no change',
  'true',
  'false',
  'undefined',
];
const SUBMENU1_TITLE_OPTIONS: Submenu1TitleOption[] = [
  'Submenu A',
  'Changed',
  'undefined',
];

function resolveTitle(
  t: TitleOption | Submenu1TitleOption,
): string | undefined {
  return t === 'undefined' ? undefined : t;
}

function resolveHidden(h: HiddenOption): boolean | undefined {
  return h === 'undefined' ? undefined : h === 'true';
}

interface MenuConfig {
  includeSubmenu1: boolean;
  submenu1Title: Submenu1TitleOption;
  addExtraItem: boolean;
  includeSubmenu2: boolean;
}

const DEFAULT_CONFIG: MenuConfig = {
  includeSubmenu1: true,
  submenu1Title: 'Submenu A',
  addExtraItem: false,
  includeSubmenu2: true,
};

function buildMenu(config: MenuConfig, onPress: (id: string) => void) {
  const children: StackHeaderToolbarMenuElementAndroid[] = [];

  children.push({
    type: 'menuItem',
    id: 'item-top',
    title: 'Top Item',
    onPress: () => onPress('item-top'),
  });

  if (config.includeSubmenu1) {
    const sub1Children = [
      {
        type: 'menuItem' as const,
        id: 'sub-1-1',
        title: 'Sub A.1',
        onPress: () => onPress('sub-1-1'),
      },
      {
        type: 'menuItem' as const,
        id: 'sub-1-2',
        title: 'Sub A.2',
        onPress: () => onPress('sub-1-2'),
      },
    ];
    if (config.addExtraItem) {
      sub1Children.push({
        type: 'menuItem' as const,
        id: 'sub-1-3',
        title: 'Sub A.3',
        onPress: () => onPress('sub-1-3'),
      });
    }
    children.push({
      type: 'menu',
      id: 'submenu-1',
      title: resolveTitle(config.submenu1Title),
      children: sub1Children,
    });
  }

  if (config.includeSubmenu2) {
    children.push({
      type: 'menu',
      id: 'submenu-2',
      title: 'Submenu B',
      children: [
        {
          type: 'menuItem' as const,
          id: 'sub-2-1',
          title: 'Sub B.1',
          onPress: () => onPress('sub-2-1'),
        },
        {
          type: 'menu' as const,
          id: 'deep-menu',
          title: 'Deep',
          children: [
            {
              type: 'menuItem' as const,
              id: 'deep-1',
              title: 'Deep.1',
              onPress: () => onPress('deep-1'),
            },
          ],
        },
      ],
    });
  }

  return children;
}

const HEADER_TITLE = 'Toolbar Nested Menu Test';

export function App() {
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
                toolbarMenu: {
                  children: buildMenu(DEFAULT_CONFIG, () => {}),
                },
              },
            },
          },
        },
      ]}
    />
  );
}

function MainScreen() {
  const [config, setConfig] = useState<MenuConfig>(DEFAULT_CONFIG);
  const [lastClicked, setLastClicked] = useState<string | null>(null);

  const [cmdTargetId, setCmdTargetId] = useState<AllIds>('item-top');
  const [cmdTitle, setCmdTitle] = useState<CmdTitleOption>('no change');
  const [cmdHidden, setCmdHidden] = useState<CmdHiddenOption>('no change');

  const headerConfigRef = useRef<StackHeaderConfigRef>(null);
  const { setRouteOptions, routeKey } = useStackNavigationContext();

  useLayoutEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig: {
        title: HEADER_TITLE,
        android: {
          toolbarMenu: {
            children: buildMenu(DEFAULT_CONFIG, setLastClicked),
          },
        },
      },
      headerConfigRef,
    });
  }, [setRouteOptions, routeKey]);

  const applyConfig = useCallback(
    (next: MenuConfig) => {
      setConfig(next);
      setRouteOptions(routeKey, {
        headerConfig: {
          title: HEADER_TITLE,
          android: {
            toolbarMenu: {
              children: buildMenu(next, setLastClicked),
            },
          },
        },
      });
    },
    [setRouteOptions, routeKey],
  );

  const sendCommand = useCallback(() => {
    const options: StackHeaderToolbarMenuItemOptionsAndroid = {
      ...(cmdTitle !== 'no change' && { title: resolveTitle(cmdTitle) }),
      ...(cmdHidden !== 'no change' && {
        hidden: resolveHidden(cmdHidden),
      }),
    };
    headerConfigRef.current?.android?.setToolbarMenuItemOptions(
      cmdTargetId,
      options,
    );
  }, [cmdTargetId, cmdTitle, cmdHidden]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Result</Text>
      <Text style={styles.result}>Last clicked: {lastClicked ?? '—'}</Text>

      <Text style={styles.heading}>Send Command</Text>
      <SettingsPicker<AllIds>
        label="target id"
        value={cmdTargetId}
        items={ALL_IDS}
        onValueChange={setCmdTargetId}
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

      <Text style={styles.heading}>Menu Structure — Props</Text>
      <SettingsSwitch
        label="include submenu-1"
        value={config.includeSubmenu1}
        onValueChange={v => applyConfig({ ...config, includeSubmenu1: v })}
      />
      <SettingsPicker<Submenu1TitleOption>
        label="submenu-1 title"
        value={config.submenu1Title}
        items={SUBMENU1_TITLE_OPTIONS}
        onValueChange={v => applyConfig({ ...config, submenu1Title: v })}
      />
      <SettingsSwitch
        label="add extra item to submenu-1"
        value={config.addExtraItem}
        onValueChange={v => applyConfig({ ...config, addExtraItem: v })}
      />
      <SettingsSwitch
        label="include submenu-2"
        value={config.includeSubmenu2}
        onValueChange={v => applyConfig({ ...config, includeSubmenu2: v })}
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

export default createScenario(App, scenarioDescription);
