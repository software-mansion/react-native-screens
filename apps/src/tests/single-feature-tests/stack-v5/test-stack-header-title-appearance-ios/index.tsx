import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  PlatformColor,
  ScrollView,
  StyleSheet,
  Switch,
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
import { SettingsPicker, SettingsSwitch } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import type {
  StackHeaderAppearanceIOS,
  StackHeaderConfigProps,
} from 'react-native-screens';

const TITLE_TEXT = 'Title';
const SUBTITLE_TEXT = 'Subtitle';
const LARGE_TITLE_TEXT = 'Large Title';
const LARGE_SUBTITLE_TEXT = 'Large Subtitle';

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

interface SlotAppearance {
  color: ColorOption;
  fontSize: SizeOption;
  fontFamily: FamilyOption;
  fontWeight: WeightOption;
  fontStyle: StyleOption;
}

// Subtitle appearance covers both regular and large subtitle — UIKit
// derives the large subtitle appearance from subtitleTextAttributes.
type SlotKey = 'title' | 'largeTitle' | 'subtitle';

// One per appearance object — standard and scroll edge are configured
// completely independently. When `enabled` is false, the corresponding
// appearance prop is not passed at all.
interface AppearanceConfig {
  enabled: boolean;
  slots: Record<SlotKey, SlotAppearance>;
}

type AppearanceKey = 'standard' | 'scrollEdge';

interface Config {
  largeTitleEnabled: boolean;
  standard: AppearanceConfig;
  scrollEdge: AppearanceConfig;
}

const SLOTS: SlotKey[] = ['title', 'largeTitle', 'subtitle'];

const DEFAULT_SLOT: SlotAppearance = {
  color: 'default',
  fontSize: 'default',
  fontFamily: 'default',
  fontWeight: 'default',
  fontStyle: 'default',
};

function makeDefaultSlots(): Record<SlotKey, SlotAppearance> {
  return {
    title: { ...DEFAULT_SLOT },
    largeTitle: { ...DEFAULT_SLOT },
    subtitle: { ...DEFAULT_SLOT },
  };
}

function makeDefaultAppearanceConfig(): AppearanceConfig {
  return { enabled: false, slots: makeDefaultSlots() };
}

const DEFAULT_CONFIG: Config = {
  largeTitleEnabled: false,
  standard: makeDefaultAppearanceConfig(),
  scrollEdge: makeDefaultAppearanceConfig(),
};

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

function buildAppearance(
  appearanceConfig: AppearanceConfig,
): StackHeaderAppearanceIOS | undefined {
  if (!appearanceConfig.enabled) {
    return undefined;
  }

  const title = resolveSlot(appearanceConfig.slots.title);
  const largeTitle = resolveSlot(appearanceConfig.slots.largeTitle);
  const subtitle = resolveSlot(appearanceConfig.slots.subtitle);

  return {
    titleFontColor: title.color,
    titleFontSize: title.fontSize,
    titleFontFamily: title.fontFamily,
    titleFontWeight: title.fontWeight,
    titleFontStyle: title.fontStyle,

    largeTitleFontColor: largeTitle.color,
    largeTitleFontSize: largeTitle.fontSize,
    largeTitleFontFamily: largeTitle.fontFamily,
    largeTitleFontWeight: largeTitle.fontWeight,
    largeTitleFontStyle: largeTitle.fontStyle,

    subtitleFontColor: subtitle.color,
    subtitleFontSize: subtitle.fontSize,
    subtitleFontFamily: subtitle.fontFamily,
    subtitleFontWeight: subtitle.fontWeight,
    subtitleFontStyle: subtitle.fontStyle,
  };
}

function buildHeaderConfig(config: Config): StackHeaderConfigProps {
  return {
    title: TITLE_TEXT,
    subtitle: SUBTITLE_TEXT,
    ios: {
      largeTitle: LARGE_TITLE_TEXT,
      largeSubtitle: LARGE_SUBTITLE_TEXT,
      largeTitleEnabled: config.largeTitleEnabled,
      standardAppearance: buildAppearance(config.standard),
      scrollEdgeAppearance: buildAppearance(config.scrollEdge),
    },
  };
}

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

function AppearanceSection({
  label,
  value,
  onChange,
}: {
  label: string;
  value: AppearanceConfig;
  onChange: (next: AppearanceConfig) => void;
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
        SLOTS.map(slot => (
          <AppearanceControls
            key={slot}
            label={slot}
            value={value.slots[slot]}
            onChange={next =>
              onChange({ ...value, slots: { ...value.slots, [slot]: next } })
            }
          />
        ))}
    </>
  );
}

function TestStackHeaderTitleAppearanceIOS() {
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

  const updateAppearance = useCallback(
    (appearance: AppearanceKey, next: AppearanceConfig) => {
      setConfig(prev => ({ ...prev, [appearance]: next }));
    },
    [],
  );

  const { setRouteOptions, routeKey } = navigation;
  const headerConfig = useMemo(() => buildHeaderConfig(config), [config]);

  useEffect(() => {
    setRouteOptions(routeKey, { headerConfig });
  }, [headerConfig, setRouteOptions, routeKey]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic">
      <Button
        title="Reset appearance"
        onPress={() =>
          setConfig(prev => ({
            ...prev,
            standard: makeDefaultAppearanceConfig(),
            scrollEdge: makeDefaultAppearanceConfig(),
          }))
        }
      />

      <SettingsSwitch
        label="largeTitleEnabled"
        value={config.largeTitleEnabled}
        onValueChange={v =>
          setConfig(prev => ({ ...prev, largeTitleEnabled: v }))
        }
      />

      <AppearanceSection
        label="standardAppearance"
        value={config.standard}
        onChange={next => updateAppearance('standard', next)}
      />
      <AppearanceSection
        label="scrollEdgeAppearance"
        value={config.scrollEdge}
        onChange={next => updateAppearance('scrollEdge', next)}
      />
    </ScrollView>
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
    paddingBottom: 400,
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default createScenario(
  TestStackHeaderTitleAppearanceIOS,
  scenarioDescription,
);
