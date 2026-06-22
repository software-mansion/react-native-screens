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
  type StackHeaderToolbarMenuItemOptionsAndroid,
  type StackHeaderToolbarMenuItemShowAsActionAndroid,
} from 'react-native-screens/experimental';
import { scenarioDescription } from './scenario-descriptions';

type IdOption = 'item-1' | 'item-2' | 'item-3';
type ShowAsActionOption =
  | 'undefined'
  | 'never'
  | 'always'
  | 'alwaysWithText'
  | 'ifRoom'
  | 'ifRoomWithText';
type CmdShowAsActionOption = 'no change' | ShowAsActionOption;

const ID_OPTIONS: IdOption[] = ['item-1', 'item-2', 'item-3'];
const SHOW_AS_ACTION_OPTIONS: ShowAsActionOption[] = [
  'undefined',
  'never',
  'always',
  'alwaysWithText',
  'ifRoom',
  'ifRoomWithText',
];
const CMD_SHOW_AS_ACTION_OPTIONS: CmdShowAsActionOption[] = [
  'no change',
  ...SHOW_AS_ACTION_OPTIONS,
];

interface SlotConfig {
  include: boolean;
  id: IdOption;
  showAsAction: ShowAsActionOption;
}

type Slots = [SlotConfig, SlotConfig, SlotConfig];

const DEFAULT_SLOTS: Slots = [
  { include: true, id: 'item-1', showAsAction: 'undefined' },
  { include: true, id: 'item-2', showAsAction: 'undefined' },
  { include: true, id: 'item-3', showAsAction: 'undefined' },
];

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

function buildItems(slots: Slots) {
  return slots
    .filter(s => s.include)
    .map(({ id, showAsAction }) => ({
      id,
      title: ITEM_TITLES[id],
      showAsAction: resolveShowAsAction(showAsAction),
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

export function TestStackToolbarMenuShowAsAction() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Main',
          Component: MainScreen,
          options: {
            headerConfig: {
              title: HEADER_TITLE,
              android: { toolbarMenuItems: buildItems(DEFAULT_SLOTS) },
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
  const [cmdShowAsAction, setCmdShowAsAction] =
    useState<CmdShowAsActionOption>('no change');

  const headerConfigRef = useRef<StackHeaderConfigRef>(null);
  const { setRouteOptions, routeKey } = useStackNavigationContext();

  useLayoutEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig: {
        title: HEADER_TITLE,
        android: {
          toolbarMenuItems: buildItems(DEFAULT_SLOTS),
          onToolbarMenuItemClicked: event =>
            setLastClicked(event.nativeEvent.id),
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
            toolbarMenuItems: buildItems(next),
            onToolbarMenuItemClicked: event =>
              setLastClicked(event.nativeEvent.id),
          },
        },
      });
    },
    [setRouteOptions, routeKey],
  );

  const sendCommand = useCallback(() => {
    const options: StackHeaderToolbarMenuItemOptionsAndroid = {
      ...(cmdShowAsAction !== 'no change' && {
        showAsAction: resolveShowAsAction(cmdShowAsAction),
      }),
    };
    headerConfigRef.current?.android?.setToolbarMenuItemOptions(
      cmdTargetId,
      options,
    );
  }, [cmdTargetId, cmdShowAsAction]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Send Command</Text>
      <SettingsPicker<IdOption>
        label="target id"
        value={cmdTargetId}
        items={ID_OPTIONS}
        onValueChange={setCmdTargetId}
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
          <SettingsPicker<ShowAsActionOption>
            label="showAsAction"
            value={slot.showAsAction}
            items={SHOW_AS_ACTION_OPTIONS}
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

export default createScenario(TestStackToolbarMenuShowAsAction, scenarioDescription);
