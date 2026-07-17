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
} from 'react-native-screens/experimental';
import { scenarioDescription } from './scenario-description';

const ID_OPTIONS = ['item-1', 'item-2', 'item-3'] as const;
type IdOption = (typeof ID_OPTIONS)[number];

const TITLE_OPTIONS = [
  'Title A',
  'Title B',
  'Title C',
  'Long Title',
  'Changed',
  'undefined',
] as const;
type TitleOption = (typeof TITLE_OPTIONS)[number];

const HIDDEN_OPTIONS = ['true', 'false', 'undefined'] as const;
type HiddenOption = (typeof HIDDEN_OPTIONS)[number];

type CmdTitleOption = TitleOption | 'no change';
type CmdHiddenOption = HiddenOption | 'no change';

const CMD_TITLE_OPTIONS: CmdTitleOption[] = ['no change', ...TITLE_OPTIONS];
const CMD_HIDDEN_OPTIONS: CmdHiddenOption[] = ['no change', ...HIDDEN_OPTIONS];

interface SlotConfig {
  include: boolean;
  id: IdOption;
  title: TitleOption;
  hidden: HiddenOption;
}

type Slots = [SlotConfig, SlotConfig, SlotConfig];

const DEFAULT_SLOTS: Slots = [
  { include: true, id: 'item-1', title: 'Title A', hidden: 'false' },
  { include: true, id: 'item-2', title: 'Title B', hidden: 'false' },
  { include: true, id: 'item-3', title: 'Title C', hidden: 'false' },
];

function resolveTitle(t: TitleOption): string | undefined {
  return t === 'undefined' ? undefined : t;
}

function resolveHidden(h: HiddenOption): boolean | undefined {
  return h === 'undefined' ? undefined : h === 'true';
}

function buildItems(slots: Slots): StackHeaderToolbarMenuElementAndroid[] {
  return slots
    .filter(s => s.include)
    .map(({ id, title, hidden }) => ({
      type: 'menuItem',
      id,
      title: resolveTitle(title),
      hidden: resolveHidden(hidden),
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

const HEADER_TITLE = 'Toolbar Menu Commands Test';

function TestStackToolbarMenuCommands() {
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
      ...(cmdTitle !== 'no change' && { title: resolveTitle(cmdTitle) }),
      ...(cmdHidden !== 'no change' && { hidden: resolveHidden(cmdHidden) }),
    };
    headerConfigRef.current?.android?.updateToolbarMenuElements({
      id: cmdTargetId,
      options,
    });
  }, [cmdTargetId, cmdTitle, cmdHidden]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Send Command</Text>
      <SettingsPicker<IdOption>
        label="target id"
        value={cmdTargetId}
        items={[...ID_OPTIONS]}
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
          <SettingsPicker<TitleOption>
            label="title"
            value={slot.title}
            items={[...TITLE_OPTIONS]}
            onValueChange={v => updateSlot(i, { title: v })}
          />
          <SettingsPicker<HiddenOption>
            label="hidden"
            value={slot.hidden}
            items={[...HIDDEN_OPTIONS]}
            onValueChange={v => updateSlot(i, { hidden: v })}
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
  TestStackToolbarMenuCommands,
  scenarioDescription,
);
