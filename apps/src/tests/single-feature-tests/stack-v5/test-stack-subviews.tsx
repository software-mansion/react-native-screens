import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Scenario } from '../../shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '../../../shared/gamma/containers/stack';
import { SettingsPicker, SettingsSwitch } from '../../../shared';
import PressableWithFeedback from '../../../../src/shared/PressableWithFeedback';
import Colors from '../../../../src/shared/styling/Colors';
import LongText from '../../../../src/shared/LongText';
import type {
  StackHeaderConfigProps,
  StackHeaderTypeAndroid,
  StackHeaderBackgroundSubviewCollapseModeAndroid,
} from 'react-native-screens/experimental';
import { NavigationContainer } from '@react-navigation/native';

const SCENARIO: Scenario = {
  name: 'Stack Subviews',
  key: 'test-stack-subviews',
  details: 'Tests header config and subview customization.',
  platforms: ['android'],
  AppComponent: App,
};

export default SCENARIO;

const SHORT_TITLE = 'Hello';
const LONG_TITLE =
  'A Very Long Title That Should Ellipsize When There Is Not Enough Space Available';

type SubviewSize = 'none' | 'sm' | 'md' | 'lg';
type HitSlopValue = '0' | '10' | '30';
type PressRetentionValue = '0' | '20' | '50';
type TitleOption = 'short' | 'long';

interface Config {
  enabled: boolean;
  type: StackHeaderTypeAndroid;
  transparent: boolean;
  hidden: boolean;
  title: TitleOption;
  leadingSize: SubviewSize;
  centerSize: SubviewSize;
  trailingSize: SubviewSize;
  backgroundEnabled: boolean;
  backgroundCollapseMode: StackHeaderBackgroundSubviewCollapseModeAndroid;
  hitSlop: HitSlopValue;
  pressRetentionOffset: PressRetentionValue;
}

const DEFAULT_CONFIG: Config = {
  enabled: true,
  type: 'large',
  transparent: false,
  hidden: false,
  title: 'short',
  leadingSize: 'none',
  centerSize: 'none',
  trailingSize: 'none',
  backgroundEnabled: false,
  backgroundCollapseMode: 'parallax',
  hitSlop: '0',
  pressRetentionOffset: '0',
};

const SUBVIEW_SIZES: SubviewSize[] = ['none', 'sm', 'md', 'lg'];
const HEADER_TYPES: StackHeaderTypeAndroid[] = ['small', 'medium', 'large'];
const COLLAPSE_MODES: StackHeaderBackgroundSubviewCollapseModeAndroid[] = [
  'off',
  'parallax',
];
const HIT_SLOP_VALUES: HitSlopValue[] = ['0', '10', '30'];
const PRESS_RETENTION_VALUES: PressRetentionValue[] = ['0', '20', '50'];
const TITLE_OPTIONS: TitleOption[] = ['short', 'long'];

function getSubviewDimensions(size: SubviewSize): {
  width: number;
  height: number;
} {
  switch (size) {
    case 'sm':
      return { width: 24, height: 24 };
    case 'md':
      return { width: 40, height: 40 };
    case 'lg':
      return { width: 80, height: 40 };
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
      Component: (
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
        Component: (
          <View style={styles.backgroundContainer}>
            <Image
              source={require('../../../../assets/trees.jpg')}
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
    type: config.type,
    title: config.title === 'short' ? SHORT_TITLE : LONG_TITLE,
    hidden: config.hidden,
    transparent: config.transparent,
    backgroundSubview,
    leadingSubview: makeToolbarSubview(config.leadingSize, 'L'),
    centerSubview: makeToolbarSubview(config.centerSize, 'C'),
    trailingSubview: makeToolbarSubview(config.trailingSize, 'T'),
  };
}

export function App() {
  return <StackSetup />;
}

function StackSetup() {
  // TODO: NavigationContainer is used only in order to make SettingsSwitch/Picker work.
  //       Those components shouldn't rely on react-navigation in the future.
  return (
    <NavigationContainer>
      <StackContainer
        routeConfigs={[
          {
            name: 'Home',
            Component: ConfigScreen,
            options: {},
          },
        ]}
      />
    </NavigationContainer>
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

  const { setRouteOptions, routeKey } = navigation;
  const headerConfig = useMemo(() => buildHeaderConfig(config), [config]);

  useEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig,
    });
  }, [headerConfig, setRouteOptions, routeKey]);

  return (
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
      <SettingsPicker<TitleOption>
        label="title"
        value={config.title}
        onValueChange={v => updateConfig('title', v)}
        items={TITLE_OPTIONS}
      />

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

      <Text style={styles.heading}>ScrollView content</Text>
      <LongText size="xl" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
