import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Button, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { SettingsPicker, SettingsSwitch } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import {
  type StackHeaderToolbarMenuElementAndroid,
  type StackHeaderConfigRef,
  type StackHeaderToolbarMenuElementOptionsAndroid,
  type StackHeaderToolbarMenuItemShowAsActionAndroid,
  ScrollViewMarker,
} from 'react-native-screens';
import type { PlatformIconAndroid } from 'react-native-screens';
import { SafeAreaView } from 'react-native-screens/experimental';
import { scenarioDescription } from './scenario-description';

const ID_OPTIONS = ['item-1', 'item-2', 'item-3'] as const;
export type IdOption = (typeof ID_OPTIONS)[number];

const ICON_OPTIONS = ['undefined', 'searchIcon'] as const;
export type IconOption = (typeof ICON_OPTIONS)[number];

const SHOW_AS_ACTION_OPTIONS = [
  'undefined',
  'never',
  'always',
  'alwaysWithText',
  'ifRoom',
  'ifRoomWithText',
] as const;
export type ShowAsActionOption = (typeof SHOW_AS_ACTION_OPTIONS)[number];

export type CmdIconOption = 'no change' | IconOption;
export type CmdShowAsActionOption = 'no change' | ShowAsActionOption;

const CMD_ICON_OPTIONS: CmdIconOption[] = ['no change', ...ICON_OPTIONS];
const CMD_SHOW_AS_ACTION_OPTIONS: CmdShowAsActionOption[] = [
  'no change',
  ...SHOW_AS_ACTION_OPTIONS,
];

interface SlotConfig {
  include: boolean;
  id: IdOption;
  icon: IconOption;
  showAsAction: ShowAsActionOption;
}

type Slots = [SlotConfig, SlotConfig, SlotConfig];

const DEFAULT_SLOTS: Slots = [
  { include: true, id: 'item-1', icon: 'undefined', showAsAction: 'undefined' },
  { include: true, id: 'item-2', icon: 'undefined', showAsAction: 'undefined' },
  { include: true, id: 'item-3', icon: 'undefined', showAsAction: 'undefined' },
];

function resolveIcon(option: IconOption): PlatformIconAndroid | undefined {
  switch (option) {
    case 'searchIcon':
      return {
        type: 'imageSource',
        imageSource: require('@assets/search_black.png'),
      };
    default:
      return undefined;
  }
}

function resolveShowAsAction(
  v: ShowAsActionOption,
): StackHeaderToolbarMenuItemShowAsActionAndroid | undefined {
  return v === 'undefined' ? undefined : v;
}

const ITEM_TITLES = {
  'item-1': 'I1',
  'item-2': 'Item 2',
  'item-3': 'Item Number Three',
} as const satisfies Record<IdOption, string>;
export type ItemTitle = (typeof ITEM_TITLES)[IdOption];

function buildItems(slots: Slots): StackHeaderToolbarMenuElementAndroid[] {
  return slots
    .filter(s => s.include)
    .map(({ id, icon, showAsAction }) => ({
      type: 'menuItem',
      id,
      title: ITEM_TITLES[id],
      icon: resolveIcon(icon),
      showAsAction: resolveShowAsAction(showAsAction),
    }));
}

function withOnPress(
  items: ReturnType<typeof buildItems>,
  onPress: (id: string) => void,
) {
  return items.map(item => ({
    ...item,
    onPress: () => onPress(item.id),
  }));
}

function updateSlotAt(
  slots: Slots,
  index: number,
  patch: Partial<SlotConfig>,
): Slots {
  return slots.map((s, i) => (i === index ? { ...s, ...patch } : s)) as Slots;
}

const HEADER_TITLE = 'Show As Action Test';
export type HeaderTitle = typeof HEADER_TITLE;

function TestStackToolbarMenuShowAsAction() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Main',
          element: <MainScreen />,
          options: {
            headerConfig: {
              title: HEADER_TITLE,
              android: { toolbarMenu: { children: buildItems(DEFAULT_SLOTS) } },
            },
          },
        },
      ]}
    />
  );
}

function MainScreen() {
  const [slots, setSlots] = useState<Slots>(DEFAULT_SLOTS);
  const [lastClicked, setLastClicked] = useState<string | null>(null);

  const [cmdTargetId, setCmdTargetId] = useState<IdOption>('item-1');
  const [cmdIcon, setCmdIcon] = useState<CmdIconOption>('no change');
  const [cmdShowAsAction, setCmdShowAsAction] =
    useState<CmdShowAsActionOption>('no change');

  const headerConfigRef = useRef<StackHeaderConfigRef>(null);
  const { setRouteOptions, routeKey } = useStackNavigationContext();

  useLayoutEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig: {
        title: HEADER_TITLE,
        android: {
          toolbarMenu: {
            children: withOnPress(buildItems(DEFAULT_SLOTS), setLastClicked),
          },
        },
      },
      headerConfigRef,
    });
  }, [setRouteOptions, routeKey]);

  const applySlots = useCallback(
    (next: Slots) => {
      setSlots(next);
      setRouteOptions(routeKey, {
        headerConfig: {
          title: HEADER_TITLE,
          android: {
            toolbarMenu: {
              children: withOnPress(buildItems(next), setLastClicked),
            },
          },
        },
      });
    },
    [setRouteOptions, routeKey],
  );

  const sendCommand = useCallback(() => {
    const options: StackHeaderToolbarMenuElementOptionsAndroid = {
      ...(cmdIcon !== 'no change' && {
        icon: resolveIcon(cmdIcon),
      }),
      ...(cmdShowAsAction !== 'no change' && {
        showAsAction: resolveShowAsAction(cmdShowAsAction),
      }),
    };
    headerConfigRef.current?.android?.updateToolbarMenuElements({
      id: cmdTargetId,
      options,
    });
  }, [cmdTargetId, cmdIcon, cmdShowAsAction]);

  return (
    // The app draws edge to edge, so without the bottom inset the list's
    // viewport runs under the navigation bar and its lowest row cannot be
    // tapped — neither by hand nor by Detox.
    <SafeAreaView edges={{ bottom: Platform.OS === 'android' }}>
      <ScrollViewMarker style={styles.scrollViewMarker}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          testID="toolbar-menu-show-as-action-scrollview">
          <Text style={styles.heading}>Send Command</Text>
          <SettingsPicker<IdOption>
            label="target id"
            value={cmdTargetId}
            items={[...ID_OPTIONS]}
            onValueChange={setCmdTargetId}
            testID="cmd-target-picker"
          />
          <SettingsPicker<CmdIconOption>
            label="cmd icon"
            value={cmdIcon}
            items={CMD_ICON_OPTIONS}
            onValueChange={setCmdIcon}
            testID="cmd-icon-picker"
          />
          <SettingsPicker<CmdShowAsActionOption>
            label="cmd showAsAction"
            value={cmdShowAsAction}
            items={CMD_SHOW_AS_ACTION_OPTIONS}
            onValueChange={setCmdShowAsAction}
            testID="cmd-show-as-action-picker"
          />
          <Button
            title="Send Command"
            onPress={sendCommand}
            testID="send-command-button"
          />

          <Text style={styles.heading}>Result</Text>
          <Text testID="last-clicked-text" style={styles.result}>
            Last clicked: {lastClicked ?? '—'}
          </Text>

          <Text style={styles.heading}>Menu Items — Props</Text>
          <SlotControls
            slots={slots}
            updateSlot={(i, patch) => applySlots(updateSlotAt(slots, i, patch))}
          />
        </ScrollView>
      </ScrollViewMarker>
    </SafeAreaView>
  );
}

interface SlotControlsProps {
  slots: Slots;
  updateSlot: (index: number, patch: Partial<SlotConfig>) => void;
}

function SlotControls({ slots, updateSlot }: SlotControlsProps) {
  return (
    <>
      {slots.map((slot, i) => (
        <React.Fragment key={i}>
          <Text style={styles.slotLabel}>
            Slot {i + 1} (item-{i + 1})
          </Text>
          <SettingsSwitch
            label={`slot ${i + 1} include`}
            value={slot.include}
            onValueChange={v => updateSlot(i, { include: v })}
            testID={`slot-${i + 1}-include-switch`}
          />
          <SettingsPicker<IconOption>
            label={`slot ${i + 1} icon`}
            value={slot.icon}
            items={[...ICON_OPTIONS]}
            onValueChange={v => updateSlot(i, { icon: v })}
            testID={`slot-${i + 1}-icon-picker`}
          />
          <SettingsPicker<ShowAsActionOption>
            label={`slot ${i + 1} showAsAction`}
            value={slot.showAsAction}
            items={[...SHOW_AS_ACTION_OPTIONS]}
            onValueChange={v => updateSlot(i, { showAsAction: v })}
            testID={`slot-${i + 1}-show-as-action-picker`}
          />
        </React.Fragment>
      ))}
    </>
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
  slotLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  result: {
    fontSize: 15,
    paddingHorizontal: 10,
  },
});

export default createScenario(
  TestStackToolbarMenuShowAsAction,
  scenarioDescription,
);
