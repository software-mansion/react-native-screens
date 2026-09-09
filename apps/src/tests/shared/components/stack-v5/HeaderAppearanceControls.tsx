import React from 'react';
import {
  PlatformColor,
  StyleSheet,
  Switch,
  Text,
  View,
  type ColorValue,
  type TextStyle,
} from 'react-native';
import { SettingsPicker } from '@apps/shared';
import type { StackHeaderAppearanceIOS } from 'react-native-screens';

// A PlatformColor resolved by the OS — distinct from the literal red/blue below.
const PLATFORM_COLOR = PlatformColor('systemGreenColor');

// Each picker's options are the single source of truth; the option union type is
// derived from the array so the two can never drift apart.
const options = <const T extends string>(...values: T[]): T[] => values;

const COLOR_OPTIONS = options('default', 'red', 'blue', 'platform');
const SIZE_OPTIONS = options('default', '12', '30');
const FAMILY_OPTIONS = options('default', 'Courier New', 'Times New Roman');
const WEIGHT_OPTIONS = options('default', '400', '700', 'bold', '900');
const STYLE_OPTIONS = options('default', 'normal', 'italic');

type ColorOption = (typeof COLOR_OPTIONS)[number];
type SizeOption = (typeof SIZE_OPTIONS)[number];
type FamilyOption = (typeof FAMILY_OPTIONS)[number];
type WeightOption = (typeof WEIGHT_OPTIONS)[number];
type StyleOption = (typeof STYLE_OPTIONS)[number];

export interface HeaderAppearanceSlot {
  color: ColorOption;
  fontSize: SizeOption;
  fontFamily: FamilyOption;
  fontWeight: WeightOption;
  fontStyle: StyleOption;
}

export type HeaderAppearanceSlotKey =
  | 'title'
  | 'largeTitle'
  | 'subtitle'
  | 'button'
  | 'buttonHighlighted'
  | 'buttonDisabled'
  | 'buttonFocused'
  | 'prominentButton'
  | 'prominentButtonHighlighted'
  | 'prominentButtonDisabled'
  | 'prominentButtonFocused';

export interface HeaderAppearanceConfig<K extends HeaderAppearanceSlotKey> {
  enabled: boolean;
  slots: Record<K, HeaderAppearanceSlot>;
}

const DEFAULT_SLOT: HeaderAppearanceSlot = {
  color: 'default',
  fontSize: 'default',
  fontFamily: 'default',
  fontWeight: 'default',
  fontStyle: 'default',
};

export function makeDefaultHeaderAppearanceConfig<
  K extends HeaderAppearanceSlotKey,
>(slotKeys: readonly K[]): HeaderAppearanceConfig<K> {
  return {
    enabled: false,
    slots: Object.fromEntries(
      slotKeys.map(slot => [slot, { ...DEFAULT_SLOT }]),
    ) as Record<K, HeaderAppearanceSlot>,
  };
}

function resolveColor(value: ColorOption): ColorValue | undefined {
  switch (value) {
    case 'red':
      return 'red';
    case 'blue':
      return 'blue';
    case 'platform':
      return PLATFORM_COLOR;
    default:
      return undefined;
  }
}

function resolveSize(value: SizeOption): number | undefined {
  return value === 'default' ? undefined : Number(value);
}

function resolveFamily(value: FamilyOption): string | undefined {
  return value === 'default' ? undefined : value;
}

function resolveWeight(value: WeightOption): TextStyle['fontWeight'] {
  switch (value) {
    case '400':
      return 400;
    case '700':
      return 700;
    case '900':
      return 900;
    case 'bold':
      return 'bold';
    default:
      return undefined;
  }
}

function resolveStyle(value: StyleOption): TextStyle['fontStyle'] {
  return value === 'default' ? undefined : value;
}

export function buildHeaderAppearance<K extends HeaderAppearanceSlotKey>(
  config: HeaderAppearanceConfig<K>,
): StackHeaderAppearanceIOS | undefined {
  if (!config.enabled) {
    return undefined;
  }

  const appearance: Record<string, unknown> = {};
  for (const slot of Object.keys(config.slots) as K[]) {
    const value = config.slots[slot];
    appearance[`${slot}FontColor`] = resolveColor(value.color);
    appearance[`${slot}FontSize`] = resolveSize(value.fontSize);
    appearance[`${slot}FontFamily`] = resolveFamily(value.fontFamily);
    appearance[`${slot}FontWeight`] = resolveWeight(value.fontWeight);
    appearance[`${slot}FontStyle`] = resolveStyle(value.fontStyle);
  }
  return appearance as StackHeaderAppearanceIOS;
}

const SLOT_STATE_SUFFIXES = ['Highlighted', 'Disabled', 'Focused'] as const;

function formatSlotLabel(slot: HeaderAppearanceSlotKey): string {
  for (const state of SLOT_STATE_SUFFIXES) {
    if (slot.endsWith(state)) {
      return `${slot.slice(0, -state.length)} (${state.toLowerCase()})`;
    }
  }
  return slot;
}

export function HeaderAppearanceSlotControls({
  slot,
  value,
  onChange,
}: {
  slot: HeaderAppearanceSlotKey;
  value: HeaderAppearanceSlot;
  onChange: (next: HeaderAppearanceSlot) => void;
}) {
  // Picker labels are slot-prefixed because SettingsPicker derives option
  // testIDs from the label — bare labels would collide across slots.
  return (
    <>
      <Text style={styles.subheading}>{formatSlotLabel(slot)}</Text>
      <SettingsPicker<ColorOption>
        label={`${slot} color`}
        value={value.color}
        onValueChange={v => onChange({ ...value, color: v })}
        items={COLOR_OPTIONS}
      />
      <SettingsPicker<SizeOption>
        label={`${slot} fontSize`}
        value={value.fontSize}
        onValueChange={v => onChange({ ...value, fontSize: v })}
        items={SIZE_OPTIONS}
      />
      <SettingsPicker<FamilyOption>
        label={`${slot} fontFamily`}
        value={value.fontFamily}
        onValueChange={v => onChange({ ...value, fontFamily: v })}
        items={FAMILY_OPTIONS}
      />
      <SettingsPicker<WeightOption>
        label={`${slot} fontWeight`}
        value={value.fontWeight}
        onValueChange={v => onChange({ ...value, fontWeight: v })}
        items={WEIGHT_OPTIONS}
      />
      <SettingsPicker<StyleOption>
        label={`${slot} fontStyle`}
        value={value.fontStyle}
        onValueChange={v => onChange({ ...value, fontStyle: v })}
        items={STYLE_OPTIONS}
      />
    </>
  );
}

export function HeaderAppearanceSection<K extends HeaderAppearanceSlotKey>({
  label,
  slotKeys,
  value,
  onChange,
}: {
  label: string;
  slotKeys: readonly K[];
  value: HeaderAppearanceConfig<K>;
  onChange: (next: HeaderAppearanceConfig<K>) => void;
}) {
  return (
    <>
      <View style={styles.switchRow}>
        <Text style={styles.heading}>{label}</Text>
        <Switch
          value={value.enabled}
          onValueChange={enabled => onChange({ ...value, enabled })}
        />
      </View>
      {value.enabled &&
        slotKeys.map(slot => (
          <HeaderAppearanceSlotControls
            key={slot}
            slot={slot}
            value={value.slots[slot]}
            onChange={next =>
              onChange({ ...value, slots: { ...value.slots, [slot]: next } })
            }
          />
        ))}
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  subheading: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 8,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
