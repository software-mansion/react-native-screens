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
  StackHeaderToolbarMenuElementAndroid,
  StackHeaderConfigRef,
  StackHeaderToolbarMenuElementOptionsAndroid,
  StackHeaderToolbarMenuItemShowAsActionAndroid,
} from 'react-native-screens/experimental';
import type { PlatformIconAndroid } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';

const ID_OPTIONS = ['item-1', 'item-2', 'item-3'] as const;
type IdOption = (typeof ID_OPTIONS)[number];

const ICON_OPTIONS = ['undefined', 'searchIcon'] as const;
type IconOption = (typeof ICON_OPTIONS)[number];

const SHOW_AS_ACTION_OPTIONS = [
  'undefined',
  'never',
  'always',
  'alwaysWithText',
  'ifRoom',
  'ifRoomWithText',
] as const;
type ShowAsActionOption = (typeof SHOW_AS_ACTION_OPTIONS)[number];

type CmdIconOption = 'no change' | IconOption;
type CmdShowAsActionOption = 'no change' | ShowAsActionOption;

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

const ITEM_TITLES: Record<IdOption, string> = {
  'item-1': 'I1',
  'item-2': 'Item 2',
  'item-3': 'Item Number Three',
};

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

function TestStackToolbarMenuShowAsAction() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Main',
          Component: MainScreen,
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
    headerConfigRef.current?.android?.setToolbarMenuElementOptions(
      cmdTargetId,
      options,
    );
  }, [cmdTargetId, cmdIcon, cmdShowAsAction]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Send Command</Text>
      <SettingsPicker<IdOption>
        label="target id"
        value={cmdTargetId}
        items={[...ID_OPTIONS]}
        onValueChange={setCmdTargetId}
      />
      <SettingsPicker<CmdIconOption>
        label="icon"
        value={cmdIcon}
        items={CMD_ICON_OPTIONS}
        onValueChange={setCmdIcon}
      />
      <SettingsPicker<CmdShowAsActionOption>
        label="showAsAction"
        value={cmdShowAsAction}
        items={CMD_SHOW_AS_ACTION_OPTIONS}
        onValueChange={setCmdShowAsAction}
      />
      <Button title="Send Command" onPress={sendCommand} />

      <Text style={styles.heading}>Result</Text>
      <Text style={styles.result}>Last clicked: {lastClicked ?? '—'}</Text>

      <Text style={styles.heading}>Menu Items — Props</Text>
      <SlotControls
        slots={slots}
        updateSlot={(i, patch) => applySlots(updateSlotAt(slots, i, patch))}
      />
    </ScrollView>
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
            label="include"
            value={slot.include}
            onValueChange={v => updateSlot(i, { include: v })}
          />
          <SettingsPicker<IconOption>
            label="icon"
            value={slot.icon}
            items={[...ICON_OPTIONS]}
            onValueChange={v => updateSlot(i, { icon: v })}
          />
          <SettingsPicker<ShowAsActionOption>
            label="showAsAction"
            value={slot.showAsAction}
            items={[...SHOW_AS_ACTION_OPTIONS]}
            onValueChange={v => updateSlot(i, { showAsAction: v })}
          />
        </React.Fragment>
      ))}
    </>
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
