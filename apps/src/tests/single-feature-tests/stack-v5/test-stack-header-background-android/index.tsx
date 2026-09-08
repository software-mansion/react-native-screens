import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
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
  backgroundSubview: boolean;
}

const DEFAULT_CONFIG: Config = {
  type: 'small',
  backgroundColor: 'default',
  scrolledBackgroundColor: 'default',
  backgroundSubview: false,
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

function resolveScrolledBackgroundColor(
  value: ColorOption,
): ColorValue | undefined {
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

// The image fills only the trailing part of the header so the background color
// stays visible next to it (and behind it through the scrim when collapsed).
function TreesBackground() {
  return (
    <View style={styles.backgroundSubview}>
      <Image
        source={require('@assets/trees.jpg')}
        resizeMode="cover"
        style={styles.backgroundImage}
      />
    </View>
  );
}

function buildHeaderConfig(config: Config): StackHeaderConfigProps {
  return {
    title: 'Header background',
    android: {
      type: config.type,

      // Collapsing headers re-expand as soon as the user scrolls up, so the
      // tester can compare expanded/collapsed appearance from any scroll offset.
      scrollFlagEnterAlways: config.type === 'small' ? undefined : true,

      backgroundColor: resolveBackgroundColor(config.backgroundColor),
      scrolledBackgroundColor: resolveScrolledBackgroundColor(
        config.scrolledBackgroundColor,
      ),

      // The background subview is supported only for collapsing header types.
      backgroundSubview:
        config.backgroundSubview && config.type !== 'small'
          ? { collapseMode: 'parallax', render: () => <TreesBackground /> }
          : undefined,
    },
  };
}

function TestStackHeaderBackgroundAndroid() {
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
        testID="header-background-scrollview"
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
          testID="background-subview-switch"
          label="backgroundSubview (medium/large)"
          value={config.backgroundSubview}
          onValueChange={v => updateConfig('backgroundSubview', v)}
        />

        <Text style={styles.heading}>Scroll to observe color changes</Text>
        <LongText size="xl" />
        <Text testID="header-background-bottom-marker">End of content</Text>
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
  backgroundSubview: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backgroundImage: {
    height: '100%',
    width: '50%',
  },
});

export default createScenario(
  TestStackHeaderBackgroundAndroid,
  scenarioDescription,
);
