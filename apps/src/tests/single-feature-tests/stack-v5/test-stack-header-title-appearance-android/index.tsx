import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  PlatformColor,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ColorValue,
  type TextStyle,
} from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { SettingsPicker } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import LongText from '@apps/shared/LongText';
import {
  type StackHeaderConfigProps,
  type StackHeaderTypeAndroid,
  ScrollViewMarker,
} from 'react-native-screens';

// `same` resolves title and subtitle to one shared string so we can verify the
// small header keeps them apart by TextView identity, not by text.
const TITLE_TEXT = 'Title';
const SUBTITLE_TEXT = 'Subtitle';
const SAME_TEXT = 'Same';

// A PlatformColor resolved by the OS — distinct from the literal red/blue below.
const PLATFORM_COLOR = PlatformColor('@android:color/holo_green_light');

// Each picker's options are the single source of truth; the option union type is
// derived from the array so the two can never drift apart.
const options = <const T extends string>(...values: T[]): T[] => values;

const TEXT_OPTIONS = options('undefined', 'short', 'same');
const COLOR_OPTIONS = options('default', 'red', 'blue', 'platform');
const SIZE_OPTIONS = options('default', '12', '30');
const FAMILY_OPTIONS = options('default', 'serif', 'monospace');
const WEIGHT_OPTIONS = options('default', '400', '700', 'bold', '900');
const STYLE_OPTIONS = options('default', 'normal', 'italic');
const HEADER_TYPES: StackHeaderTypeAndroid[] = ['small', 'medium', 'large'];

type TextOption = (typeof TEXT_OPTIONS)[number];
type ColorOption = (typeof COLOR_OPTIONS)[number];
type SizeOption = (typeof SIZE_OPTIONS)[number];
type FamilyOption = (typeof FAMILY_OPTIONS)[number];
type WeightOption = (typeof WEIGHT_OPTIONS)[number];
type StyleOption = (typeof STYLE_OPTIONS)[number];

interface SlotAppearance {
  color: ColorOption;
  fontSize: SizeOption;
  fontFamily: FamilyOption;
  fontWeight: WeightOption;
  fontStyle: StyleOption;
}

type SlotKey =
  | 'title'
  | 'subtitle'
  | 'expandedTitle'
  | 'collapsedTitle'
  | 'expandedSubtitle'
  | 'collapsedSubtitle';

interface Config {
  type: StackHeaderTypeAndroid;
  title: TextOption;
  subtitle: TextOption;
  appearance: Record<SlotKey, SlotAppearance>;
}

const TITLE_SLOTS: SlotKey[] = ['title', 'expandedTitle', 'collapsedTitle'];
const SUBTITLE_SLOTS: SlotKey[] = [
  'subtitle',
  'expandedSubtitle',
  'collapsedSubtitle',
];

const DEFAULT_SLOT: SlotAppearance = {
  color: 'default',
  fontSize: 'default',
  fontFamily: 'default',
  fontWeight: 'default',
  fontStyle: 'default',
};

function makeDefaultAppearance(): Record<SlotKey, SlotAppearance> {
  return {
    title: { ...DEFAULT_SLOT },
    subtitle: { ...DEFAULT_SLOT },
    expandedTitle: { ...DEFAULT_SLOT },
    collapsedTitle: { ...DEFAULT_SLOT },
    expandedSubtitle: { ...DEFAULT_SLOT },
    collapsedSubtitle: { ...DEFAULT_SLOT },
  };
}

const DEFAULT_CONFIG: Config = {
  type: 'small',
  title: 'short',
  subtitle: 'short',
  appearance: makeDefaultAppearance(),
};

function resolveText(value: TextOption, short: string): string | undefined {
  switch (value) {
    case 'short':
      return short;
    case 'same':
      return SAME_TEXT;
    default:
      return undefined;
  }
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

function resolveSlot(slot: SlotAppearance) {
  return {
    color: resolveColor(slot.color),
    fontSize: resolveSize(slot.fontSize),
    fontFamily: resolveFamily(slot.fontFamily),
    fontWeight: resolveWeight(slot.fontWeight),
    fontStyle: resolveStyle(slot.fontStyle),
  };
}

function buildHeaderConfig(config: Config): StackHeaderConfigProps {
  const a = config.appearance;
  const title = resolveSlot(a.title);
  const subtitle = resolveSlot(a.subtitle);
  const expandedTitle = resolveSlot(a.expandedTitle);
  const collapsedTitle = resolveSlot(a.collapsedTitle);
  const expandedSubtitle = resolveSlot(a.expandedSubtitle);
  const collapsedSubtitle = resolveSlot(a.collapsedSubtitle);

  return {
    title: resolveText(config.title, TITLE_TEXT),
    subtitle: resolveText(config.subtitle, SUBTITLE_TEXT),
    android: {
      type: config.type,

      // Collapsing headers re-expand as soon as the user scrolls up, so the
      // tester can compare expanded/collapsed appearance from any scroll offset.
      scrollFlagEnterAlways: config.type === 'small' ? undefined : true,

      titleColor: title.color,
      titleFontSize: title.fontSize,
      titleFontFamily: title.fontFamily,
      titleFontWeight: title.fontWeight,
      titleFontStyle: title.fontStyle,

      subtitleColor: subtitle.color,
      subtitleFontSize: subtitle.fontSize,
      subtitleFontFamily: subtitle.fontFamily,
      subtitleFontWeight: subtitle.fontWeight,
      subtitleFontStyle: subtitle.fontStyle,

      expandedTitleColor: expandedTitle.color,
      expandedTitleFontSize: expandedTitle.fontSize,
      expandedTitleFontFamily: expandedTitle.fontFamily,
      expandedTitleFontWeight: expandedTitle.fontWeight,
      expandedTitleFontStyle: expandedTitle.fontStyle,

      collapsedTitleColor: collapsedTitle.color,
      collapsedTitleFontSize: collapsedTitle.fontSize,
      collapsedTitleFontFamily: collapsedTitle.fontFamily,
      collapsedTitleFontWeight: collapsedTitle.fontWeight,
      collapsedTitleFontStyle: collapsedTitle.fontStyle,

      expandedSubtitleColor: expandedSubtitle.color,
      expandedSubtitleFontSize: expandedSubtitle.fontSize,
      expandedSubtitleFontFamily: expandedSubtitle.fontFamily,
      expandedSubtitleFontWeight: expandedSubtitle.fontWeight,
      expandedSubtitleFontStyle: expandedSubtitle.fontStyle,

      collapsedSubtitleColor: collapsedSubtitle.color,
      collapsedSubtitleFontSize: collapsedSubtitle.fontSize,
      collapsedSubtitleFontFamily: collapsedSubtitle.fontFamily,
      collapsedSubtitleFontWeight: collapsedSubtitle.fontWeight,
      collapsedSubtitleFontStyle: collapsedSubtitle.fontStyle,
    },
  };
}

function setSlotsColor(
  appearance: Record<SlotKey, SlotAppearance>,
  slots: SlotKey[],
  color: ColorOption,
): Record<SlotKey, SlotAppearance> {
  const next = { ...appearance };
  for (const slot of slots) {
    next[slot] = { ...next[slot], color };
  }
  return next;
}

function withColors(
  titleColor: ColorOption,
  subtitleColor: ColorOption,
): Record<SlotKey, SlotAppearance> {
  return setSlotsColor(
    setSlotsColor(makeDefaultAppearance(), TITLE_SLOTS, titleColor),
    SUBTITLE_SLOTS,
    subtitleColor,
  );
}

const PRESETS: { label: string; apply: (prev: Config) => Config }[] = [
  {
    label: 'Reset appearance',
    apply: prev => ({ ...prev, appearance: makeDefaultAppearance() }),
  },
  {
    label: 'Differentiation',
    apply: prev => ({
      ...prev,
      title: 'same',
      subtitle: 'same',
      appearance: withColors('red', 'blue'),
    }),
  },
  {
    label: 'PlatformColor',
    apply: prev => ({
      ...prev,
      title: 'short',
      subtitle: 'short',
      appearance: withColors('platform', 'platform'),
    }),
  },
];

function AppearanceControls({
  label,
  value,
  onChange,
}: {
  label: string;
  value: SlotAppearance;
  onChange: (next: SlotAppearance) => void;
}) {
  return (
    <>
      <Text style={styles.subheading}>{label}</Text>
      <SettingsPicker<ColorOption>
        label={`${label} color`}
        value={value.color}
        onValueChange={v => onChange({ ...value, color: v })}
        items={COLOR_OPTIONS}
      />
      <SettingsPicker<SizeOption>
        label={`${label} fontSize`}
        value={value.fontSize}
        onValueChange={v => onChange({ ...value, fontSize: v })}
        items={SIZE_OPTIONS}
      />
      <SettingsPicker<FamilyOption>
        label={`${label} fontFamily`}
        value={value.fontFamily}
        onValueChange={v => onChange({ ...value, fontFamily: v })}
        items={FAMILY_OPTIONS}
      />
      <SettingsPicker<WeightOption>
        label={`${label} fontWeight`}
        value={value.fontWeight}
        onValueChange={v => onChange({ ...value, fontWeight: v })}
        items={WEIGHT_OPTIONS}
      />
      <SettingsPicker<StyleOption>
        label={`${label} fontStyle`}
        value={value.fontStyle}
        onValueChange={v => onChange({ ...value, fontStyle: v })}
        items={STYLE_OPTIONS}
      />
    </>
  );
}

function TestStackHeaderTitleAppearanceAndroid() {
  return <StackSetup />;
}

function StackSetup() {
  return (
    <StackContainer
      routeConfigs={[{ name: 'Home', element: <ConfigScreen />, options: {} }]}
    />
  );
}

function ConfigScreen() {
  const navigation = useStackNavigationContext();
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);

  const updateSlot = useCallback((slot: SlotKey, next: SlotAppearance) => {
    setConfig(prev => ({
      ...prev,
      appearance: { ...prev.appearance, [slot]: next },
    }));
  }, []);

  const { setRouteOptions, routeKey } = navigation;
  const headerConfig = useMemo(() => buildHeaderConfig(config), [config]);

  useEffect(() => {
    setRouteOptions(routeKey, { headerConfig });
  }, [headerConfig, setRouteOptions, routeKey]);

  const isSmall = config.type === 'small';

  return (
    <ScrollViewMarker style={styles.scrollViewMarker}>
      <ScrollView
        nestedScrollEnabled
        style={styles.scroll}
        contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Presets</Text>
        <View style={styles.presetRow}>
          {PRESETS.map(preset => (
            <View key={preset.label} style={styles.presetItem}>
              <Button
                title={preset.label}
                onPress={() => setConfig(prev => preset.apply(prev))}
              />
            </View>
          ))}
        </View>

        <Text style={styles.heading}>General</Text>
        <SettingsPicker<StackHeaderTypeAndroid>
          label="type"
          value={config.type}
          onValueChange={v => setConfig(prev => ({ ...prev, type: v }))}
          items={HEADER_TYPES}
        />
        <SettingsPicker<TextOption>
          label="title"
          value={config.title}
          onValueChange={v => setConfig(prev => ({ ...prev, title: v }))}
          items={TEXT_OPTIONS}
        />
        <SettingsPicker<TextOption>
          label="subtitle"
          value={config.subtitle}
          onValueChange={v => setConfig(prev => ({ ...prev, subtitle: v }))}
          items={TEXT_OPTIONS}
        />

        <Text style={styles.heading}>Appearance</Text>
        {isSmall ? (
          <>
            <AppearanceControls
              label="title"
              value={config.appearance.title}
              onChange={next => updateSlot('title', next)}
            />
            <AppearanceControls
              label="subtitle"
              value={config.appearance.subtitle}
              onChange={next => updateSlot('subtitle', next)}
            />
          </>
        ) : (
          <>
            <AppearanceControls
              label="expandedTitle"
              value={config.appearance.expandedTitle}
              onChange={next => updateSlot('expandedTitle', next)}
            />
            <AppearanceControls
              label="collapsedTitle"
              value={config.appearance.collapsedTitle}
              onChange={next => updateSlot('collapsedTitle', next)}
            />
            <AppearanceControls
              label="expandedSubtitle"
              value={config.appearance.expandedSubtitle}
              onChange={next => updateSlot('expandedSubtitle', next)}
            />
            <AppearanceControls
              label="collapsedSubtitle"
              value={config.appearance.collapsedSubtitle}
              onChange={next => updateSlot('collapsedSubtitle', next)}
            />
          </>
        )}

        <Text style={styles.heading}>ScrollView content</Text>
        <LongText size="xl" />
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
    padding: 16,
    gap: 6,
  },
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
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetItem: {
    flexGrow: 1,
  },
});

export default createScenario(
  TestStackHeaderTitleAppearanceAndroid,
  scenarioDescription,
);
