import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';
import type { ColorValue } from 'react-native';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import { SettingsPicker, SettingsSwitch } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import type {
  StackHeaderConfigRef,
  StackHeaderToolbarMenuItemAndroid,
  StackHeaderToolbarMenuElementOptionsAndroid,
} from 'react-native-screens/experimental';
import type { PlatformIconAndroid } from 'react-native-screens';
import { scenarioDescription } from './scenario-descriptions';

const ID_OPTIONS = ['item-1', 'item-2', 'item-3'] as const;
type IdOption = (typeof ID_OPTIONS)[number];

const ICON_OPTIONS = ['none', 'imageSource', 'drawableResource'] as const;
type IconOption = (typeof ICON_OPTIONS)[number];

const TINT_COLOR_OPTIONS = [
  'default',
  'purple',
  'red',
  'green',
  'blue',
] as const;
type TintColorOption = (typeof TINT_COLOR_OPTIONS)[number];

const SHOW_AS_ACTION_OPTIONS = ['always', 'never', 'ifRoom'] as const;
type ShowAsActionOption = (typeof SHOW_AS_ACTION_OPTIONS)[number];

type CmdIconOption = 'no change' | IconOption;
type CmdTintColorOption = 'no change' | TintColorOption;
type CmdDisabledOption = 'no change' | 'true' | 'false';

const CMD_ICON_OPTIONS: CmdIconOption[] = ['no change', ...ICON_OPTIONS];
const CMD_TINT_COLOR_OPTIONS: CmdTintColorOption[] = [
  'no change',
  ...TINT_COLOR_OPTIONS,
];
const CMD_DISABLED_OPTIONS: CmdDisabledOption[] = [
  'no change',
  'true',
  'false',
];

interface SlotConfig {
  include: boolean;
  id: IdOption;
  icon: IconOption;
  showAsAction: ShowAsActionOption;
  tintColorNormal: TintColorOption;
  tintColorPressed: TintColorOption;
  tintColorFocused: TintColorOption;
  tintColorDisabled: TintColorOption;
  disabled: boolean;
}

type Slots = [SlotConfig, SlotConfig, SlotConfig];

const SLOT_DEFAULTS: Omit<SlotConfig, 'id'> = {
  include: true,
  icon: 'imageSource',
  showAsAction: 'always',
  tintColorNormal: 'default',
  tintColorPressed: 'default',
  tintColorFocused: 'default',
  tintColorDisabled: 'default',
  disabled: false,
};

const DEFAULT_SLOTS: Slots = [
  { ...SLOT_DEFAULTS, id: 'item-1' },
  { ...SLOT_DEFAULTS, id: 'item-2' },
  { ...SLOT_DEFAULTS, id: 'item-3' },
];

const ITEM_TITLES: Record<IdOption, string> = {
  'item-1': 'Item 1',
  'item-2': 'Item 2',
  'item-3': 'Item 3',
};

function resolveIcon(option: IconOption): PlatformIconAndroid | undefined {
  switch (option) {
    case 'imageSource':
      return {
        type: 'imageSource',
        imageSource: require('@assets/search_black.png'),
      };
    case 'drawableResource':
      return {
        type: 'drawableResource',
        name: 'sym_call_missed',
      };
    default:
      return undefined;
  }
}

function resolveTintColor(option: TintColorOption): ColorValue | undefined {
  switch (option) {
    case 'purple':
      return Colors.PurpleLight100;
    case 'red':
      return Colors.RedLight100;
    case 'green':
      return Colors.GreenLight100;
    case 'blue':
      return Colors.BlueLight100;
    default:
      return undefined;
  }
}

function buildItems(slots: Slots): StackHeaderToolbarMenuItemAndroid[] {
  return slots
    .filter(s => s.include)
    .map(s => ({
      type: 'menuItem',
      id: s.id,
      title: ITEM_TITLES[s.id],
      showAsAction: s.showAsAction,
      icon: resolveIcon(s.icon),
      iconTintColorNormal: resolveTintColor(s.tintColorNormal),
      iconTintColorPressed: resolveTintColor(s.tintColorPressed),
      iconTintColorFocused: resolveTintColor(s.tintColorFocused),
      iconTintColorDisabled: resolveTintColor(s.tintColorDisabled),
      disabled: s.disabled,
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

const HEADER_TITLE = 'Toolbar Menu Icon Test';

function TestStackToolbarMenuIcon() {
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
  const [cmdTintColorNormal, setCmdTintColorNormal] =
    useState<CmdTintColorOption>('no change');
  const [cmdTintColorPressed, setCmdTintColorPressed] =
    useState<CmdTintColorOption>('no change');
  const [cmdTintColorFocused, setCmdTintColorFocused] =
    useState<CmdTintColorOption>('no change');
  const [cmdTintColorDisabled, setCmdTintColorDisabled] =
    useState<CmdTintColorOption>('no change');
  const [cmdDisabled, setCmdDisabled] =
    useState<CmdDisabledOption>('no change');

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
        icon: cmdIcon === 'none' ? undefined : resolveIcon(cmdIcon),
      }),
      ...(cmdTintColorNormal !== 'no change' && {
        iconTintColorNormal: resolveTintColor(cmdTintColorNormal),
      }),
      ...(cmdTintColorPressed !== 'no change' && {
        iconTintColorPressed: resolveTintColor(cmdTintColorPressed),
      }),
      ...(cmdTintColorFocused !== 'no change' && {
        iconTintColorFocused: resolveTintColor(cmdTintColorFocused),
      }),
      ...(cmdTintColorDisabled !== 'no change' && {
        iconTintColorDisabled: resolveTintColor(cmdTintColorDisabled),
      }),
      ...(cmdDisabled !== 'no change' && {
        disabled: cmdDisabled === 'true',
      }),
    };
    headerConfigRef.current?.android?.updateToolbarMenuElements({
      id: cmdTargetId,
      options,
    });
  }, [
    cmdTargetId,
    cmdIcon,
    cmdTintColorNormal,
    cmdTintColorPressed,
    cmdTintColorFocused,
    cmdTintColorDisabled,
    cmdDisabled,
  ]);

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
      <SettingsPicker<CmdTintColorOption>
        label="tintColorNormal"
        value={cmdTintColorNormal}
        items={CMD_TINT_COLOR_OPTIONS}
        onValueChange={setCmdTintColorNormal}
      />
      <SettingsPicker<CmdTintColorOption>
        label="tintColorPressed"
        value={cmdTintColorPressed}
        items={CMD_TINT_COLOR_OPTIONS}
        onValueChange={setCmdTintColorPressed}
      />
      <SettingsPicker<CmdTintColorOption>
        label="tintColorFocused"
        value={cmdTintColorFocused}
        items={CMD_TINT_COLOR_OPTIONS}
        onValueChange={setCmdTintColorFocused}
      />
      <SettingsPicker<CmdTintColorOption>
        label="tintColorDisabled"
        value={cmdTintColorDisabled}
        items={CMD_TINT_COLOR_OPTIONS}
        onValueChange={setCmdTintColorDisabled}
      />
      <SettingsPicker<CmdDisabledOption>
        label="disabled"
        value={cmdDisabled}
        items={CMD_DISABLED_OPTIONS}
        onValueChange={setCmdDisabled}
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
            Slot {i + 1} ({slot.id})
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
          <SettingsPicker<TintColorOption>
            label="tintColorNormal"
            value={slot.tintColorNormal}
            items={[...TINT_COLOR_OPTIONS]}
            onValueChange={v => updateSlot(i, { tintColorNormal: v })}
          />
          <SettingsPicker<TintColorOption>
            label="tintColorPressed"
            value={slot.tintColorPressed}
            items={[...TINT_COLOR_OPTIONS]}
            onValueChange={v => updateSlot(i, { tintColorPressed: v })}
          />
          <SettingsPicker<TintColorOption>
            label="tintColorFocused"
            value={slot.tintColorFocused}
            items={[...TINT_COLOR_OPTIONS]}
            onValueChange={v => updateSlot(i, { tintColorFocused: v })}
          />
          <SettingsPicker<TintColorOption>
            label="tintColorDisabled"
            value={slot.tintColorDisabled}
            items={[...TINT_COLOR_OPTIONS]}
            onValueChange={v => updateSlot(i, { tintColorDisabled: v })}
          />
          <SettingsSwitch
            label="disabled"
            value={slot.disabled}
            onValueChange={v => updateSlot(i, { disabled: v })}
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

export default createScenario(TestStackToolbarMenuIcon, scenarioDescription);
