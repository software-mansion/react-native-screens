import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  I18nManager,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { SettingsPicker, SettingsSwitch } from '@apps/shared';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';
import { Colors } from '@apps/shared/styling';
import LongText from '@apps/shared/LongText';
import {
  type StackHeaderConfigProps,
  type StackHeaderTypeAndroid,
  type StackHeaderTitleHorizontalGravityAndroid,
  type StackHeaderTitleVerticalGravityAndroid,
  type StackHeaderCollapsedTitleGravityModeAndroid,
  type StackHeaderBackgroundSubviewCollapseModeAndroid,
  ScrollViewMarker,
} from 'react-native-screens';

const SHORT_TITLE = I18nManager.isRTL ? 'مرحبا' : 'Hello';
const LONG_TITLE = I18nManager.isRTL
  ? 'عنوان طويل جدا يجب أن يتم اقتطاعه عندما لا تتوفر مساحة كافية لعرضه بالكامل'
  : 'A Very Long Title That Should Ellipsize When There Is Not Enough Space Available';

const SHORT_SUBTITLE = I18nManager.isRTL ? 'عنوان فرعي' : 'Subtitle';
const LONG_SUBTITLE = I18nManager.isRTL
  ? 'عنوان فرعي طويل جدا يجب أن يتم اقتطاعه عندما لا تتوفر مساحة كافية لعرضه'
  : 'A Very Long Subtitle That Should Ellipsize When There Is Not Enough Space';

type SubviewSize = 'none' | 'sm' | 'md' | 'lg' | 'xl';
type HitSlopValue = '0' | '10' | '30';
type PressRetentionValue = '0' | '20' | '50';
type TextOption = 'undefined' | 'short' | 'long';
type ScrollFlagValue = 'undefined' | 'true' | 'false';

interface Config {
  enabled: boolean;
  type: StackHeaderTypeAndroid;
  transparent: boolean;
  hidden: boolean;
  title: TextOption;
  subtitle: TextOption;
  titleCentered: boolean;
  subtitleCentered: boolean;
  expandedTitleHorizontalGravity: StackHeaderTitleHorizontalGravityAndroid;
  expandedTitleVerticalGravity: StackHeaderTitleVerticalGravityAndroid;
  collapsedTitleHorizontalGravity: StackHeaderTitleHorizontalGravityAndroid;
  collapsedTitleVerticalGravity: StackHeaderTitleVerticalGravityAndroid;
  collapsedTitleGravityMode: StackHeaderCollapsedTitleGravityModeAndroid;
  leadingSize: SubviewSize;
  centerSize: SubviewSize;
  trailingSize: SubviewSize;
  backgroundEnabled: boolean;
  backgroundCollapseMode: StackHeaderBackgroundSubviewCollapseModeAndroid;
  hitSlop: HitSlopValue;
  pressRetentionOffset: PressRetentionValue;
  scrollFlagScroll: ScrollFlagValue;
  scrollFlagEnterAlways: ScrollFlagValue;
  scrollFlagEnterAlwaysCollapsed: ScrollFlagValue;
  scrollFlagExitUntilCollapsed: ScrollFlagValue;
  scrollFlagSnap: ScrollFlagValue;
}

const DEFAULT_CONFIG: Config = {
  enabled: true,
  type: 'large',
  transparent: false,
  hidden: false,
  title: 'short',
  subtitle: 'short',
  titleCentered: false,
  subtitleCentered: false,
  expandedTitleHorizontalGravity: 'start',
  expandedTitleVerticalGravity: 'bottom',
  collapsedTitleHorizontalGravity: 'start',
  collapsedTitleVerticalGravity: 'center',
  collapsedTitleGravityMode: 'entireSpace',
  leadingSize: 'none',
  centerSize: 'none',
  trailingSize: 'none',
  backgroundEnabled: false,
  backgroundCollapseMode: 'parallax',
  hitSlop: '0',
  pressRetentionOffset: '0',
  scrollFlagScroll: 'undefined',
  scrollFlagEnterAlways: 'undefined',
  scrollFlagEnterAlwaysCollapsed: 'undefined',
  scrollFlagExitUntilCollapsed: 'undefined',
  scrollFlagSnap: 'undefined',
};

const SUBVIEW_SIZES: SubviewSize[] = ['none', 'sm', 'md', 'lg', 'xl'];
const HEADER_TYPES: StackHeaderTypeAndroid[] = ['small', 'medium', 'large'];
const COLLAPSE_MODES: StackHeaderBackgroundSubviewCollapseModeAndroid[] = [
  'off',
  'parallax',
];
const HIT_SLOP_VALUES: HitSlopValue[] = ['0', '10', '30'];
const PRESS_RETENTION_VALUES: PressRetentionValue[] = ['0', '20', '50'];
const TEXT_OPTIONS: TextOption[] = ['undefined', 'short', 'long'];
const SCROLL_FLAG_VALUES: ScrollFlagValue[] = ['undefined', 'true', 'false'];
const HORIZONTAL_GRAVITY_OPTIONS: StackHeaderTitleHorizontalGravityAndroid[] = [
  'start',
  'center',
  'end',
];
const VERTICAL_GRAVITY_OPTIONS: StackHeaderTitleVerticalGravityAndroid[] = [
  'top',
  'center',
  'bottom',
];
const GRAVITY_MODE_OPTIONS: StackHeaderCollapsedTitleGravityModeAndroid[] = [
  'availableSpace',
  'entireSpace',
];

function resolveScrollFlag(value: ScrollFlagValue): boolean | undefined {
  switch (value) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return undefined;
  }
}

function resolveText(
  value: TextOption,
  short: string,
  long: string,
): string | undefined {
  switch (value) {
    case 'short':
      return short;
    case 'long':
      return long;
    default:
      return undefined;
  }
}

function getSubviewDimensions(size: SubviewSize): {
  width: number;
  height: number;
} {
  switch (size) {
    case 'sm':
      return { width: 24, height: 24 };
    case 'md':
      return { width: 24, height: 40 };
    case 'lg':
      return { width: 80, height: 40 };
    case 'xl':
      return { width: 250, height: 40 };
    default:
      return { width: 0, height: 0 };
  }
}

function buildHeaderConfig(config: Config): StackHeaderConfigProps | undefined {
  if (!config.enabled) {
    return undefined;
  }

  const hitSlop = Number(config.hitSlop);
  const pressRetentionOffset = Number(config.pressRetentionOffset);

  const makeToolbarSubview = (size: SubviewSize, label: string) => {
    if (size === 'none') {
      return undefined;
    }
    const dims = getSubviewDimensions(size);
    return {
      render: () => (
        <PressableWithFeedback
          hitSlop={hitSlop}
          pressRetentionOffset={pressRetentionOffset}>
          <View style={{ width: dims.width, height: dims.height }}>
            <Text style={styles.subviewLabel}>{label}</Text>
          </View>
        </PressableWithFeedback>
      ),
    };
  };

  const backgroundSubview = config.backgroundEnabled
    ? {
        collapseMode: config.backgroundCollapseMode,
        render: () => (
          <View style={styles.backgroundContainer}>
            <Image
              source={require('@assets/trees.jpg')}
              style={styles.backgroundImage}
            />
            <View style={styles.backgroundPressable}>
              <PressableWithFeedback
                hitSlop={hitSlop}
                pressRetentionOffset={pressRetentionOffset}>
                <Text style={styles.backgroundPressableText}>BG Pressable</Text>
              </PressableWithFeedback>
            </View>
          </View>
        ),
      }
    : undefined;

  return {
    title: resolveText(config.title, SHORT_TITLE, LONG_TITLE),
    subtitle: resolveText(config.subtitle, SHORT_SUBTITLE, LONG_SUBTITLE),
    hidden: config.hidden,
    transparent: config.transparent,
    android: {
      type: config.type,
      backgroundSubview,
      leadingSubview: makeToolbarSubview(config.leadingSize, 'L'),
      centerSubview: makeToolbarSubview(config.centerSize, 'C'),
      trailingSubview: makeToolbarSubview(config.trailingSize, 'T'),
      titleCentered: config.titleCentered,
      subtitleCentered: config.subtitleCentered,
      expandedTitleHorizontalGravity: config.expandedTitleHorizontalGravity,
      expandedTitleVerticalGravity: config.expandedTitleVerticalGravity,
      collapsedTitleHorizontalGravity: config.collapsedTitleHorizontalGravity,
      collapsedTitleVerticalGravity: config.collapsedTitleVerticalGravity,
      collapsedTitleGravityMode: config.collapsedTitleGravityMode,
      scrollFlagScroll: resolveScrollFlag(config.scrollFlagScroll),
      scrollFlagEnterAlways: resolveScrollFlag(config.scrollFlagEnterAlways),
      scrollFlagEnterAlwaysCollapsed: resolveScrollFlag(
        config.scrollFlagEnterAlwaysCollapsed,
      ),
      scrollFlagExitUntilCollapsed: resolveScrollFlag(
        config.scrollFlagExitUntilCollapsed,
      ),
      scrollFlagSnap: resolveScrollFlag(config.scrollFlagSnap),
    },
  };
}

function TestStackSubviewsAndroid() {
  return <StackSetup />;
}

function StackSetup() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Home',
          Component: ConfigScreen,
          options: {},
        },
      ]}
    />
  );
}

function ConfigScreen() {
  const navigation = useStackNavigationContext();
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);

  const updateConfig = useCallback(
    <K extends keyof Config>(key: K, value: Config[K]) => {
      setConfig(prev => ({ ...prev, [key]: value }));
    },
    [],
  );

  const { setRouteOptions, routeKey, push } = navigation;
  const headerConfig = useMemo(() => buildHeaderConfig(config), [config]);

  useEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig,
    });
  }, [headerConfig, setRouteOptions, routeKey]);

  return (
    <ScrollViewMarker style={styles.scrollViewMarker}>
      <ScrollView
        nestedScrollEnabled
        style={styles.scroll}
        contentContainerStyle={styles.content}>
        <Text style={styles.heading}>General</Text>
        <SettingsSwitch
          label="headerConfig enabled"
          value={config.enabled}
          onValueChange={v => updateConfig('enabled', v)}
        />
        <SettingsPicker<StackHeaderTypeAndroid>
          label="type"
          value={config.type}
          onValueChange={v => updateConfig('type', v)}
          items={HEADER_TYPES}
        />
        <SettingsSwitch
          label="transparent"
          value={config.transparent}
          onValueChange={v => updateConfig('transparent', v)}
        />
        <SettingsSwitch
          label="hidden"
          value={config.hidden}
          onValueChange={v => updateConfig('hidden', v)}
        />
        <SettingsPicker<TextOption>
          label="title"
          value={config.title}
          onValueChange={v => updateConfig('title', v)}
          items={TEXT_OPTIONS}
        />
        <SettingsPicker<TextOption>
          label="subtitle"
          value={config.subtitle}
          onValueChange={v => updateConfig('subtitle', v)}
          items={TEXT_OPTIONS}
        />
        <Text style={styles.heading}>Title Positioning</Text>
        {config.type === 'small' ? (
          <>
            <SettingsSwitch
              label="titleCentered"
              value={config.titleCentered}
              onValueChange={v => updateConfig('titleCentered', v)}
            />
            <SettingsSwitch
              label="subtitleCentered"
              value={config.subtitleCentered}
              onValueChange={v => updateConfig('subtitleCentered', v)}
            />
          </>
        ) : (
          <>
            <View style={styles.row}>
              <View style={styles.rowItem}>
                <SettingsPicker<StackHeaderTitleHorizontalGravityAndroid>
                  label="expanded H"
                  value={config.expandedTitleHorizontalGravity}
                  onValueChange={v =>
                    updateConfig('expandedTitleHorizontalGravity', v)
                  }
                  items={HORIZONTAL_GRAVITY_OPTIONS}
                />
              </View>
              <View style={styles.rowItem}>
                <SettingsPicker<StackHeaderTitleVerticalGravityAndroid>
                  label="expanded V"
                  value={config.expandedTitleVerticalGravity}
                  onValueChange={v =>
                    updateConfig('expandedTitleVerticalGravity', v)
                  }
                  items={VERTICAL_GRAVITY_OPTIONS}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.rowItem}>
                <SettingsPicker<StackHeaderTitleHorizontalGravityAndroid>
                  label="collapsed H"
                  value={config.collapsedTitleHorizontalGravity}
                  onValueChange={v =>
                    updateConfig('collapsedTitleHorizontalGravity', v)
                  }
                  items={HORIZONTAL_GRAVITY_OPTIONS}
                />
              </View>
              <View style={styles.rowItem}>
                <SettingsPicker<StackHeaderTitleVerticalGravityAndroid>
                  label="collapsed V"
                  value={config.collapsedTitleVerticalGravity}
                  onValueChange={v =>
                    updateConfig('collapsedTitleVerticalGravity', v)
                  }
                  items={VERTICAL_GRAVITY_OPTIONS}
                />
              </View>
            </View>
            <SettingsPicker<StackHeaderCollapsedTitleGravityModeAndroid>
              label="collapsedTitleGravityMode"
              value={config.collapsedTitleGravityMode}
              onValueChange={v => updateConfig('collapsedTitleGravityMode', v)}
              items={GRAVITY_MODE_OPTIONS}
            />
          </>
        )}
        <Text style={styles.heading}>Toolbar Subviews</Text>
        <SettingsPicker<SubviewSize>
          label="leading"
          value={config.leadingSize}
          onValueChange={v => updateConfig('leadingSize', v)}
          items={SUBVIEW_SIZES}
        />
        <SettingsPicker<SubviewSize>
          label="center"
          value={config.centerSize}
          onValueChange={v => updateConfig('centerSize', v)}
          items={SUBVIEW_SIZES}
        />
        <SettingsPicker<SubviewSize>
          label="trailing"
          value={config.trailingSize}
          onValueChange={v => updateConfig('trailingSize', v)}
          items={SUBVIEW_SIZES}
        />
        <Text style={styles.heading}>Background Subview</Text>
        <SettingsSwitch
          label="background enabled"
          value={config.backgroundEnabled}
          onValueChange={v => updateConfig('backgroundEnabled', v)}
        />
        <SettingsPicker<StackHeaderBackgroundSubviewCollapseModeAndroid>
          label="collapseMode"
          value={config.backgroundCollapseMode}
          onValueChange={v => updateConfig('backgroundCollapseMode', v)}
          items={COLLAPSE_MODES}
        />
        <Text style={styles.heading}>Scroll Flags</Text>
        <SettingsPicker<ScrollFlagValue>
          label="scrollFlagScroll"
          value={config.scrollFlagScroll}
          onValueChange={v => updateConfig('scrollFlagScroll', v)}
          items={SCROLL_FLAG_VALUES}
        />
        <SettingsPicker<ScrollFlagValue>
          label="scrollFlagEnterAlways"
          value={config.scrollFlagEnterAlways}
          onValueChange={v => updateConfig('scrollFlagEnterAlways', v)}
          items={SCROLL_FLAG_VALUES}
        />
        <SettingsPicker<ScrollFlagValue>
          label="scrollFlagEnterAlwaysCollapsed"
          value={config.scrollFlagEnterAlwaysCollapsed}
          onValueChange={v => updateConfig('scrollFlagEnterAlwaysCollapsed', v)}
          items={SCROLL_FLAG_VALUES}
        />
        <SettingsPicker<ScrollFlagValue>
          label="scrollFlagExitUntilCollapsed"
          value={config.scrollFlagExitUntilCollapsed}
          onValueChange={v => updateConfig('scrollFlagExitUntilCollapsed', v)}
          items={SCROLL_FLAG_VALUES}
        />
        <SettingsPicker<ScrollFlagValue>
          label="scrollFlagSnap"
          value={config.scrollFlagSnap}
          onValueChange={v => updateConfig('scrollFlagSnap', v)}
          items={SCROLL_FLAG_VALUES}
        />
        <Text style={styles.heading}>Pressable Settings</Text>
        <SettingsPicker<HitSlopValue>
          label="hitSlop"
          value={config.hitSlop}
          onValueChange={v => updateConfig('hitSlop', v)}
          items={HIT_SLOP_VALUES}
        />
        <SettingsPicker<PressRetentionValue>
          label="pressRetentionOffset"
          value={config.pressRetentionOffset}
          onValueChange={v => updateConfig('pressRetentionOffset', v)}
          items={PRESS_RETENTION_VALUES}
        />
        <Text style={styles.heading}>Push screen</Text>
        <Button title="Push screen" onPress={() => push('Home')} />

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
  row: {
    flexDirection: 'row',
  },
  rowItem: {
    flex: 1,
  },
  subviewLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  backgroundContainer: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backgroundPressable: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backgroundPressableText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default createScenario(TestStackSubviewsAndroid, scenarioDescription);
