import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { SettingsPicker, SettingsSwitch } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import {
  type PlatformIconAndroid,
  type StackHeaderConfigRef,
  type StackHeaderToolbarMenuBaseAndroid,
  type StackHeaderToolbarMenuElementOptionsAndroid,
  type StackHeaderTypeAndroid,
  type StackHostColorScheme,
  ScrollViewMarker,
} from 'react-native-screens';
import { scenarioDescription } from './scenario-description';

// Long on purpose: `maxLines` only affects the expanded title of a
// `medium` / `large` header, so it needs a title that actually wraps.
const HEADER_TITLE =
  'Toolbar Menu State with a deliberately long header title for maxLines';

const ALL_IDS = [
  'action',
  'filterA',
  'filterB',
  'sortAsc',
  'sortDesc',
  'plain',
] as const;
type AllIds = (typeof ALL_IDS)[number];

const HEADER_TYPES: StackHeaderTypeAndroid[] = ['small', 'medium', 'large'];
const HOST_COLOR_SCHEMES: StackHostColorScheme[] = ['inherit', 'light', 'dark'];
const MAX_LINES: MaxLinesOption[] = ['1', '2'];

type MaxLinesOption = '1' | '2';
type CmdCheckedOption = 'no change' | 'true' | 'false';
type CmdTitleOption = 'no change' | 'Changed' | 'undefined';
type CmdHiddenOption = 'no change' | 'true' | 'false' | 'undefined';
type CmdIconOption = 'no change' | 'search' | 'undefined';

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
const CMD_ICON_OPTIONS: CmdIconOption[] = ['no change', 'search', 'undefined'];

// Deliberately different from the `action` item's prop icon, so which of the
// two is on screen is unambiguous.
const COMMAND_ICON: PlatformIconAndroid = {
  type: 'imageSource',
  imageSource: require('@assets/search_white.png'),
};

// Set on StackContainer, so it has to travel down to the screen rendering the
// controls.
const HostColorSchemeContext = createContext<{
  hostColorScheme: StackHostColorScheme;
  setHostColorScheme: (value: StackHostColorScheme) => void;
}>({ hostColorScheme: 'inherit', setHostColorScheme: () => {} });

function buildMenu(
  menuVersion: number,
  onItemPress: (id: string) => void,
  onGroupChange: (groupId: string, selectedIds: string[]) => void,
): StackHeaderToolbarMenuBaseAndroid {
  return {
    groups: [
      {
        groupId: 'filters',
        onSelectionChange: ids => onGroupChange('filters', ids),
      },
      {
        groupId: 'sort',
        singleSelection: true,
        onSelectionChange: ids => onGroupChange('sort', ids),
      },
    ],
    children: [
      {
        type: 'menuItem',
        id: 'action',
        title: 'Action',
        showAsAction: 'always',
        icon: {
          type: 'imageSource',
          imageSource: require('@assets/trees.jpg'),
        },
        onPress: () => onItemPress('action'),
      },
      {
        type: 'menuItem',
        id: 'filterA',
        title: 'Filter A',
        groupId: 'filters',
        initialToggleState: true,
      },
      {
        type: 'menuItem',
        id: 'filterB',
        title: 'Filter B',
        groupId: 'filters',
      },
      {
        type: 'menuItem',
        id: 'sortAsc',
        title: 'Sort ascending',
        groupId: 'sort',
        initialToggleState: true,
      },
      {
        type: 'menuItem',
        id: 'sortDesc',
        title: 'Sort descending',
        groupId: 'sort',
      },
      {
        type: 'menuItem',
        id: 'plain',
        title: `Plain v${menuVersion}`,
        onPress: () => onItemPress('plain'),
      },
    ],
  };
}

function TestStackToolbarMenuState() {
  const [hostColorScheme, setHostColorScheme] =
    useState<StackHostColorScheme>('inherit');

  return (
    <HostColorSchemeContext.Provider
      value={{ hostColorScheme, setHostColorScheme }}>
      <StackContainer
        colorScheme={hostColorScheme}
        routeConfigs={[
          {
            name: 'Main',
            element: <MainScreen />,
            options: {
              headerConfig: {
                title: HEADER_TITLE,
                android: {
                  toolbarMenu: buildMenu(
                    1,
                    () => {},
                    () => {},
                  ),
                },
              },
            },
          },
        ]}
      />
    </HostColorSchemeContext.Provider>
  );
}

function MainScreen() {
  const { hostColorScheme, setHostColorScheme } = useContext(
    HostColorSchemeContext,
  );

  const [headerType, setHeaderType] = useState<StackHeaderTypeAndroid>('small');
  const [maxLines, setMaxLines] = useState<MaxLinesOption>('1');
  const [headerHidden, setHeaderHidden] = useState(false);
  const [menuVersion, setMenuVersion] = useState(1);
  // Bumped by "Re-send menu" only, so the effect below rebuilds a deep-equal
  // menu without changing anything in it.
  const [resendCount, setResendCount] = useState(0);

  const [lastEvent, setLastEvent] = useState<string | null>(null);
  const [eventCount, setEventCount] = useState(0);

  const [cmdTargetId, setCmdTargetId] = useState<AllIds>('filterB');
  const [cmdChecked, setCmdChecked] = useState<CmdCheckedOption>('no change');
  const [cmdTitle, setCmdTitle] = useState<CmdTitleOption>('no change');
  const [cmdHidden, setCmdHidden] = useState<CmdHiddenOption>('no change');
  const [cmdIcon, setCmdIcon] = useState<CmdIconOption>('no change');

  const headerConfigRef = useRef<StackHeaderConfigRef>(null);
  const { setRouteOptions, routeKey } = useStackNavigationContext();

  const handleItemPress = useCallback((id: string) => {
    setLastEvent(`Pressed: ${id}`);
    setEventCount(count => count + 1);
  }, []);

  const handleGroupChange = useCallback(
    (groupId: string, selectedIds: string[]) => {
      setLastEvent(`${groupId}: ${JSON.stringify(selectedIds)}`);
      setEventCount(count => count + 1);
    },
    [],
  );

  useLayoutEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig: {
        title: HEADER_TITLE,
        subtitle: 'Menu state survives header rebuilds',
        hidden: headerHidden,
        android: {
          type: headerType,
          maxLines: Number(maxLines),
          toolbarMenu: buildMenu(
            menuVersion,
            handleItemPress,
            handleGroupChange,
          ),
        },
      },
      headerConfigRef,
    });
  }, [
    setRouteOptions,
    routeKey,
    headerType,
    maxLines,
    headerHidden,
    menuVersion,
    resendCount,
    handleItemPress,
    handleGroupChange,
  ]);

  const sendCommand = useCallback(() => {
    const options: StackHeaderToolbarMenuElementOptionsAndroid = {
      ...(cmdChecked !== 'no change' && { checked: cmdChecked === 'true' }),
      ...(cmdTitle !== 'no change' && {
        title: cmdTitle === 'undefined' ? undefined : cmdTitle,
      }),
      ...(cmdHidden !== 'no change' && {
        hidden: cmdHidden === 'undefined' ? undefined : cmdHidden === 'true',
      }),
      ...(cmdIcon !== 'no change' && {
        icon: cmdIcon === 'undefined' ? undefined : COMMAND_ICON,
      }),
    };
    headerConfigRef.current?.android?.updateToolbarMenuElements({
      id: cmdTargetId,
      options,
    });
  }, [cmdTargetId, cmdChecked, cmdTitle, cmdHidden, cmdIcon]);

  return (
    <ScrollViewMarker style={styles.scrollViewMarker}>
      <ScrollView
        testID="toolbar-menu-state-scrollview"
        nestedScrollEnabled
        style={styles.scroll}
        contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Last Event</Text>
        <Text style={styles.result} testID="last-event-text">
          {lastEvent ?? '—'}
        </Text>
        <Text style={styles.result} testID="event-count-text">
          Events: {eventCount}
        </Text>

        <Text style={styles.heading}>Header rebuilds (state must survive)</Text>
        <SettingsPicker<StackHeaderTypeAndroid>
          label="headerType"
          value={headerType}
          items={HEADER_TYPES}
          onValueChange={setHeaderType}
          testID="header-type-picker"
        />
        <SettingsPicker<MaxLinesOption>
          label="maxLines"
          value={maxLines}
          items={MAX_LINES}
          onValueChange={setMaxLines}
          testID="max-lines-picker"
        />
        <SettingsPicker<StackHostColorScheme>
          label="hostColorScheme"
          value={hostColorScheme}
          items={HOST_COLOR_SCHEMES}
          onValueChange={setHostColorScheme}
          testID="host-color-scheme-picker"
        />
        <SettingsSwitch
          label="header hidden"
          value={headerHidden}
          onValueChange={setHeaderHidden}
          testID="header-hidden-switch"
        />

        <Text style={styles.heading}>Menu prop</Text>
        <Button
          title="Re-send menu (deep-equal)"
          onPress={() => setResendCount(count => count + 1)}
          testID="resend-menu-button"
        />
        <Button
          title={`Change toolbarMenu prop (v${menuVersion} → v${
            menuVersion + 1
          })`}
          onPress={() => setMenuVersion(version => version + 1)}
          testID="menu-version-button"
        />

        <Text style={styles.heading}>Send Command</Text>
        <SettingsPicker<AllIds>
          label="target id"
          value={cmdTargetId}
          items={[...ALL_IDS]}
          onValueChange={setCmdTargetId}
          testID="cmd-target-picker"
        />
        <SettingsPicker<CmdCheckedOption>
          label="checked"
          value={cmdChecked}
          items={CMD_CHECKED_OPTIONS}
          onValueChange={setCmdChecked}
          testID="cmd-checked-picker"
        />
        <SettingsPicker<CmdTitleOption>
          label="title"
          value={cmdTitle}
          items={CMD_TITLE_OPTIONS}
          onValueChange={setCmdTitle}
          testID="cmd-title-picker"
        />
        <SettingsPicker<CmdHiddenOption>
          label="hidden"
          value={cmdHidden}
          items={CMD_HIDDEN_OPTIONS}
          onValueChange={setCmdHidden}
          testID="cmd-hidden-picker"
        />
        <SettingsPicker<CmdIconOption>
          label="icon"
          value={cmdIcon}
          items={CMD_ICON_OPTIONS}
          onValueChange={setCmdIcon}
          testID="cmd-icon-picker"
        />
        <Button
          title="Send Command"
          onPress={sendCommand}
          testID="send-command-button"
        />
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

export default createScenario(TestStackToolbarMenuState, scenarioDescription);
