import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  PlatformColor,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ColorValue,
} from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { SettingsPicker, SettingsSwitch } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import LongText from '@apps/shared/LongText';
import {
  type StackHeaderConfigProps,
  type StackHeaderTypeAndroid,
  ScrollViewMarker,
} from 'react-native-screens';

const PLATFORM_COLOR_LIGHT = PlatformColor('@android:color/holo_green_light');
const PLATFORM_COLOR_DARK = PlatformColor('@android:color/holo_green_dark');

const options = <const T extends string>(...values: T[]): T[] => values;

const HEADER_TYPES: StackHeaderTypeAndroid[] = ['small', 'medium', 'large'];
const COLOR_OPTIONS = options(
  'default',
  'red',
  'green',
  'blue',
  'translucent',
  'transparent',
  'platform',
);

type ColorOption = (typeof COLOR_OPTIONS)[number];

interface Config {
  type: StackHeaderTypeAndroid;
  backgroundColor: ColorOption;
  scrolledBackgroundColor: ColorOption;
  statusBarScrimColor: ColorOption;
  exitUntilCollapsed: boolean;
}

const DEFAULT_CONFIG: Config = {
  type: 'small',
  backgroundColor: 'default',
  scrolledBackgroundColor: 'default',
  statusBarScrimColor: 'default',
  exitUntilCollapsed: false,
};

function resolveBackgroundColor(value: ColorOption): ColorValue | undefined {
  switch (value) {
    case 'red':
      return Colors.RedLight60;
    case 'green':
      return Colors.GreenLight60;
    case 'blue':
      return Colors.BlueLight60;
    case 'translucent':
      return Colors.NavyLightTransparent;
    case 'transparent':
      return 'transparent';
    case 'platform':
      return PLATFORM_COLOR_LIGHT;
    default:
      return undefined;
  }
}

function resolveStrongColor(value: ColorOption): ColorValue | undefined {
  switch (value) {
    case 'red':
      return Colors.RedLight100;
    case 'green':
      return Colors.GreenLight100;
    case 'blue':
      return Colors.BlueLight100;
    case 'translucent':
      return Colors.NavyLightTransparent;
    case 'transparent':
      return 'transparent';
    case 'platform':
      return PLATFORM_COLOR_DARK;
    default:
      return undefined;
  }
}

function buildHeaderConfig(config: Config): StackHeaderConfigProps {
  return {
    title: 'Status bar scrim',
    android: {
      type: config.type,

      // Header content must be able to pass under the status bar to exercise
      // the scrim: the small toolbar scrolls fully off, and medium/large exit
      // fully unless exitUntilCollapsed pins the toolbar below the inset.
      scrollFlagScroll: true,
      scrollFlagEnterAlways: true,
      scrollFlagExitUntilCollapsed:
        config.type === 'small' ? undefined : config.exitUntilCollapsed,

      backgroundColor: resolveBackgroundColor(config.backgroundColor),
      scrolledBackgroundColor: resolveStrongColor(
        config.scrolledBackgroundColor,
      ),
      statusBarScrimColor: resolveStrongColor(config.statusBarScrimColor),
    },
  };
}

function TestStackHeaderStatusBarScrimAndroid() {
  return (
    <View style={styles.backdrop}>
      <StackContainer
        routeConfigs={[{ name: 'Home', element: <ConfigScreen /> }]}
      />
    </View>
  );
}

function ConfigScreen() {
  const { setRouteOptions, routeKey } = useStackNavigationContext();
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);

  const updateConfig = useCallback(
    <K extends keyof Config>(key: K, value: Config[K]) => {
      setConfig(prev => ({ ...prev, [key]: value }));
    },
    [],
  );

  const headerConfig = useMemo(() => buildHeaderConfig(config), [config]);

  useEffect(() => {
    setRouteOptions(routeKey, { headerConfig });
  }, [headerConfig, setRouteOptions, routeKey]);

  return (
    <ScrollViewMarker style={styles.scrollViewMarker}>
      <ScrollView
        testID="header-status-bar-scrim-scrollview"
        nestedScrollEnabled
        style={styles.scroll}
        contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Header config</Text>
        <SettingsPicker<StackHeaderTypeAndroid>
          testID="header-type-picker"
          label="type"
          value={config.type}
          onValueChange={v => updateConfig('type', v)}
          items={HEADER_TYPES}
        />
        <SettingsPicker<ColorOption>
          testID="status-bar-scrim-color-picker"
          label="statusBarScrimColor"
          value={config.statusBarScrimColor}
          onValueChange={v => updateConfig('statusBarScrimColor', v)}
          items={COLOR_OPTIONS}
        />
        <SettingsPicker<ColorOption>
          testID="background-color-picker"
          label="backgroundColor"
          value={config.backgroundColor}
          onValueChange={v => updateConfig('backgroundColor', v)}
          items={COLOR_OPTIONS}
        />
        <SettingsPicker<ColorOption>
          testID="scrolled-background-color-picker"
          label="scrolledBackgroundColor"
          value={config.scrolledBackgroundColor}
          onValueChange={v => updateConfig('scrolledBackgroundColor', v)}
          items={COLOR_OPTIONS}
        />
        <SettingsSwitch
          testID="exit-until-collapsed-switch"
          label="scrollFlagExitUntilCollapsed (medium/large)"
          value={config.exitUntilCollapsed}
          onValueChange={v => updateConfig('exitUntilCollapsed', v)}
        />

        <Text style={styles.heading}>Scroll to move content under the bar</Text>
        <LongText size="xl" />
        <Text testID="header-status-bar-scrim-bottom-marker">
          End of content
        </Text>
      </ScrollView>
    </ScrollViewMarker>
  );
}

const styles = StyleSheet.create({
  // Shows through the header when header is transparent.
  backdrop: {
    flex: 1,
    backgroundColor: Colors.PurpleLight80,
  },
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
});

export default createScenario(
  TestStackHeaderStatusBarScrimAndroid,
  scenarioDescription,
);
