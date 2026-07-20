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
  type StackHeaderToolbarMenuElementAndroid,
  type StackHeaderToolbarMenuElementOptionsAndroid,
  ScrollViewMarker,
} from 'react-native-screens';
import { scenarioDescription } from './scenario-description';

const ALL_IDS = [
  'item-top',
  'submenu-1',
  'sub-1-1',
  'sub-1-2',
  'submenu-2',
  'sub-2-1',
  'deep-menu',
  'deep-1',
] as const;
type AllIds = (typeof ALL_IDS)[number];

type TitleOption = 'Title X' | 'undefined';
type HiddenOption = 'true' | 'false' | 'undefined';

type CmdTitleOption = TitleOption | 'no change';
type CmdHiddenOption = HiddenOption | 'no change';

type MenuTitleOption = 'Header X' | 'undefined';
type CmdMenuTitleOption = MenuTitleOption | 'no change';

const SUBMENU1_TITLE_OPTIONS = ['Submenu A', 'Changed', 'undefined'] as const;
type Submenu1TitleOption = (typeof SUBMENU1_TITLE_OPTIONS)[number];

const SUBMENU1_MENU_TITLE_OPTIONS = [
  'Header A',
  'Changed Header',
  'undefined',
] as const;
type Submenu1MenuTitleOption = (typeof SUBMENU1_MENU_TITLE_OPTIONS)[number];

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
const CMD_MENU_TITLE_OPTIONS: CmdMenuTitleOption[] = [
  'no change',
  'Header X',
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

function resolveMenuTitle(
  t: MenuTitleOption | Submenu1MenuTitleOption,
): string | undefined {
  return t === 'undefined' ? undefined : t;
}

interface MenuConfig {
  includeSubmenu1: boolean;
  submenu1Title: Submenu1TitleOption;
  submenu1MenuTitle: Submenu1MenuTitleOption;
  addExtraItem: boolean;
  includeSubmenu2: boolean;
}

const DEFAULT_CONFIG: MenuConfig = {
  includeSubmenu1: true,
  submenu1Title: 'Submenu A',
  submenu1MenuTitle: 'Header A',
  addExtraItem: false,
  includeSubmenu2: true,
};

function buildMenu(
  config: MenuConfig,
  onPress: (id: string) => void,
): StackHeaderToolbarMenuElementAndroid[] {
  const children: StackHeaderToolbarMenuElementAndroid[] = [];

  children.push({
    type: 'menuItem',
    id: 'item-top',
    title: 'Top Item',
    onPress: () => onPress('item-top'),
  });

  if (config.includeSubmenu1) {
    const sub1Children: StackHeaderToolbarMenuElementAndroid[] = [
      {
        type: 'menuItem',
        id: 'sub-1-1',
        title: 'Sub A.1',
        onPress: () => onPress('sub-1-1'),
      },
      {
        type: 'menuItem',
        id: 'sub-1-2',
        title: 'Sub A.2',
        onPress: () => onPress('sub-1-2'),
      },
    ];
    if (config.addExtraItem) {
      sub1Children.push({
        type: 'menuItem',
        id: 'sub-1-3',
        title: 'Sub A.3',
        onPress: () => onPress('sub-1-3'),
      });
    }
    children.push({
      type: 'menu',
      id: 'submenu-1',
      title: resolveTitle(config.submenu1Title),
      menuTitle: resolveMenuTitle(config.submenu1MenuTitle),
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
          type: 'menuItem',
          id: 'sub-2-1',
          title: 'Sub B.1',
          onPress: () => onPress('sub-2-1'),
        },
        {
          type: 'menu',
          id: 'deep-menu',
          title: 'Deep',
          children: [
            {
              type: 'menuItem',
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

function TestStackToolbarNestedMenu() {
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
  const [cmdMenuTitle, setCmdMenuTitle] =
    useState<CmdMenuTitleOption>('no change');

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
    const options: StackHeaderToolbarMenuElementOptionsAndroid = {
      ...(cmdTitle !== 'no change' && { title: resolveTitle(cmdTitle) }),
      ...(cmdHidden !== 'no change' && {
        hidden: resolveHidden(cmdHidden),
      }),
      ...(cmdMenuTitle !== 'no change' && {
        menuTitle: resolveMenuTitle(cmdMenuTitle),
      }),
    };
    headerConfigRef.current?.android?.updateToolbarMenuElements({
      id: cmdTargetId,
      options,
    });
  }, [cmdTargetId, cmdTitle, cmdHidden, cmdMenuTitle]);

  return (
    <ScrollViewMarker>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Result</Text>
        <Text style={styles.result}>Last clicked: {lastClicked ?? '—'}</Text>

        <Text style={styles.heading}>Send Command</Text>
        <SettingsPicker<AllIds>
          label="target id"
          value={cmdTargetId}
          items={[...ALL_IDS]}
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
        <SettingsPicker<CmdMenuTitleOption>
          label="menuTitle"
          value={cmdMenuTitle}
          items={CMD_MENU_TITLE_OPTIONS}
          onValueChange={setCmdMenuTitle}
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
          items={[...SUBMENU1_TITLE_OPTIONS]}
          onValueChange={v => applyConfig({ ...config, submenu1Title: v })}
        />
        <SettingsPicker<Submenu1MenuTitleOption>
          label="submenu-1 menuTitle"
          value={config.submenu1MenuTitle}
          items={[...SUBMENU1_MENU_TITLE_OPTIONS]}
          onValueChange={v => applyConfig({ ...config, submenu1MenuTitle: v })}
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
    </ScrollViewMarker>
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

export default createScenario(TestStackToolbarNestedMenu, scenarioDescription);
