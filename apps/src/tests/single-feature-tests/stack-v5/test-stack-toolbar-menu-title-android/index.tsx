import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Button, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { SettingsPicker } from '@apps/shared';
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

// The option types are exported for the e2e test covering this screen.
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

const TITLE_CONDENSED_OPTIONS = ['undefined', 'Cond', 'Short'] as const;
export type TitleCondensedOption = (typeof TITLE_CONDENSED_OPTIONS)[number];

// Tooltips are manual-only, so the two types below stay local to the screen.
const TOOLTIP_OPTIONS = ['undefined', 'Tooltip text', 'Hi!'] as const;
type TooltipOption = (typeof TOOLTIP_OPTIONS)[number];

// Title is fixed per id so the condensed/tooltip fallbacks are easy to spot.
const ITEM_TITLES = {
  'item-1': 'First Item',
  'item-2': 'Second Item Title',
  'item-3': 'Third Item Long Title',
} as const satisfies Record<IdOption, string>;

export type ItemTitle = (typeof ITEM_TITLES)[IdOption];

export type CmdTitleOption = 'no change' | 'Cmd Title' | 'undefined';
export type CmdCondensedOption = 'no change' | TitleCondensedOption;
export type CmdTooltipOption = 'no change' | TooltipOption;

const CMD_TITLE_OPTIONS: CmdTitleOption[] = [
  'no change',
  'Cmd Title',
  'undefined',
];
const CMD_CONDENSED_OPTIONS: CmdCondensedOption[] = [
  'no change',
  ...TITLE_CONDENSED_OPTIONS,
];
const CMD_TOOLTIP_OPTIONS: CmdTooltipOption[] = [
  'no change',
  ...TOOLTIP_OPTIONS,
];

interface SlotConfig {
  id: IdOption;
  icon: IconOption;
  showAsAction: ShowAsActionOption;
  titleCondensed: TitleCondensedOption;
  tooltipText: TooltipOption;
}

type Slots = [SlotConfig, SlotConfig, SlotConfig];

const DEFAULT_SLOTS: Slots = [
  {
    id: 'item-1',
    icon: 'searchIcon',
    showAsAction: 'alwaysWithText',
    titleCondensed: 'Cond',
    tooltipText: 'Tooltip text',
  },
  {
    id: 'item-2',
    icon: 'searchIcon',
    showAsAction: 'always',
    titleCondensed: 'undefined',
    tooltipText: 'undefined',
  },
  {
    id: 'item-3',
    icon: 'undefined',
    showAsAction: 'never',
    titleCondensed: 'Short',
    tooltipText: 'undefined',
  },
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

function resolveOptionalString(v: string): string | undefined {
  return v === 'undefined' ? undefined : v;
}

function buildItems(slots: Slots): StackHeaderToolbarMenuElementAndroid[] {
  return slots.map(
    ({ id, icon, showAsAction, titleCondensed, tooltipText }) => ({
      type: 'menuItem',
      id,
      title: ITEM_TITLES[id],
      titleCondensed: resolveOptionalString(titleCondensed),
      tooltipText: resolveOptionalString(tooltipText),
      icon: resolveIcon(icon),
      showAsAction: resolveShowAsAction(showAsAction),
    }),
  );
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

const HEADER_TITLE = 'Title / Condensed / Tooltip';

export type HeaderTitle = typeof HEADER_TITLE;

function TestStackToolbarMenuTitle() {
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
  const [cmdTitle, setCmdTitle] = useState<CmdTitleOption>('no change');
  const [cmdCondensed, setCmdCondensed] =
    useState<CmdCondensedOption>('no change');
  const [cmdTooltip, setCmdTooltip] = useState<CmdTooltipOption>('no change');

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
      ...(cmdTitle !== 'no change' && {
        title: cmdTitle === 'undefined' ? undefined : cmdTitle,
      }),
      ...(cmdCondensed !== 'no change' && {
        titleCondensed: resolveOptionalString(cmdCondensed),
      }),
      ...(cmdTooltip !== 'no change' && {
        tooltipText: resolveOptionalString(cmdTooltip),
      }),
    };
    headerConfigRef.current?.android?.updateToolbarMenuElements({
      id: cmdTargetId,
      options,
    });
  }, [cmdTargetId, cmdTitle, cmdCondensed, cmdTooltip]);

  return (
    // The app draws edge to edge, so without the bottom inset the list's
    // viewport runs under the navigation bar and its lowest row cannot be
    // tapped — neither by hand nor by Detox.
    <SafeAreaView edges={{ bottom: Platform.OS === 'android' }}>
      <ScrollViewMarker style={styles.scrollViewMarker}>
        <ScrollView
          testID="toolbar-menu-title-scrollview"
          style={styles.scroll}
          contentContainerStyle={styles.content}>
          <Text style={styles.heading}>Send Command</Text>
          <SettingsPicker<IdOption>
            label="cmd target id"
            value={cmdTargetId}
            items={[...ID_OPTIONS]}
            onValueChange={setCmdTargetId}
            testID="cmd-target-id-picker"
          />
          <SettingsPicker<CmdTitleOption>
            label="cmd title"
            value={cmdTitle}
            items={CMD_TITLE_OPTIONS}
            onValueChange={setCmdTitle}
            testID="cmd-title-picker"
          />
          <SettingsPicker<CmdCondensedOption>
            label="cmd titleCondensed"
            value={cmdCondensed}
            items={CMD_CONDENSED_OPTIONS}
            onValueChange={setCmdCondensed}
            testID="cmd-titlecondensed-picker"
          />
          <SettingsPicker<CmdTooltipOption>
            label="cmd tooltipText"
            value={cmdTooltip}
            items={CMD_TOOLTIP_OPTIONS}
            onValueChange={setCmdTooltip}
          />
          <Button
            title="Send Command"
            onPress={sendCommand}
            testID="send-command-button"
          />

          <Text style={styles.heading}>Result</Text>
          {/* The e2e test taps this label to dismiss the overflow menu, so it
              must stay non-interactive. */}
          <Text style={styles.result}>Last clicked: {lastClicked ?? '—'}</Text>

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
            Slot {i + 1} ({slot.id}) — title "{ITEM_TITLES[slot.id]}"
          </Text>
          {/* Labels carry the slot number to keep the testIDs `SettingsPicker`
              derives from them unique across slots. */}
          <SettingsPicker<IconOption>
            label={`Slot ${i + 1} icon`}
            value={slot.icon}
            items={[...ICON_OPTIONS]}
            onValueChange={v => updateSlot(i, { icon: v })}
            testID={`slot-${i + 1}-icon-picker`}
          />
          <SettingsPicker<ShowAsActionOption>
            label={`Slot ${i + 1} showAsAction`}
            value={slot.showAsAction}
            items={[...SHOW_AS_ACTION_OPTIONS]}
            onValueChange={v => updateSlot(i, { showAsAction: v })}
            testID={`slot-${i + 1}-showasaction-picker`}
          />
          <SettingsPicker<TitleCondensedOption>
            label={`Slot ${i + 1} titleCondensed`}
            value={slot.titleCondensed}
            items={[...TITLE_CONDENSED_OPTIONS]}
            onValueChange={v => updateSlot(i, { titleCondensed: v })}
            testID={`slot-${i + 1}-titlecondensed-picker`}
          />
          <SettingsPicker<TooltipOption>
            label={`Slot ${i + 1} tooltipText`}
            value={slot.tooltipText}
            items={[...TOOLTIP_OPTIONS]}
            onValueChange={v => updateSlot(i, { tooltipText: v })}
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

export default createScenario(TestStackToolbarMenuTitle, scenarioDescription);
