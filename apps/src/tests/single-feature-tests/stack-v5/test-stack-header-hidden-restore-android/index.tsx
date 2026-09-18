import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, ScrollView, StyleSheet, View } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
  type StackRouteConfig,
} from '@apps/shared/containers/stack';
import { SettingsPicker, SettingsSwitch } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import {
  type StackHeaderConfigProps,
  type StackHeaderConfigPropsAndroid,
  type StackHeaderTypeAndroid,
  ScrollViewMarker,
} from 'react-native-screens';
import { SafeAreaView } from 'react-native-screens/experimental';
import LongText from '@apps/shared/LongText';

const HEADER_TYPES: StackHeaderTypeAndroid[] = ['small', 'medium', 'large'];

type ScrollFlags = Required<
  Pick<
    StackHeaderConfigPropsAndroid,
    | 'scrollFlagScroll'
    | 'scrollFlagEnterAlways'
    | 'scrollFlagEnterAlwaysCollapsed'
    | 'scrollFlagExitUntilCollapsed'
    | 'scrollFlagSnap'
  >
>;

const ALL_FLAGS_OFF: ScrollFlags = {
  scrollFlagScroll: false,
  scrollFlagEnterAlways: false,
  scrollFlagEnterAlwaysCollapsed: false,
  scrollFlagExitUntilCollapsed: false,
  scrollFlagSnap: false,
};

// Only valid flag combinations: `enterAlwaysCollapsed` requires `enterAlways`,
// and both are meaningful only without `exitUntilCollapsed`.
const SCROLL_FLAG_PRESETS = {
  default: {
    ...ALL_FLAGS_OFF,
    scrollFlagScroll: true,
    scrollFlagExitUntilCollapsed: true,
    scrollFlagSnap: true,
  },
  'no snap': {
    ...ALL_FLAGS_OFF,
    scrollFlagScroll: true,
    scrollFlagExitUntilCollapsed: true,
  },
  'scroll only': { ...ALL_FLAGS_OFF, scrollFlagScroll: true },
  enterAlways: {
    ...ALL_FLAGS_OFF,
    scrollFlagScroll: true,
    scrollFlagEnterAlways: true,
  },
  enterAlwaysCollapsed: {
    ...ALL_FLAGS_OFF,
    scrollFlagScroll: true,
    scrollFlagEnterAlways: true,
    scrollFlagEnterAlwaysCollapsed: true,
  },
  none: ALL_FLAGS_OFF,
} satisfies Record<string, ScrollFlags>;

type ScrollFlagPreset = keyof typeof SCROLL_FLAG_PRESETS;

const SCROLL_FLAG_PRESET_NAMES = Object.keys(
  SCROLL_FLAG_PRESETS,
) as ScrollFlagPreset[];

interface Config {
  hidden: boolean;
  headerConfig: boolean;
  type: StackHeaderTypeAndroid;
  scrollFlags: ScrollFlagPreset;
}

const DEFAULT_CONFIG: Config = {
  hidden: false,
  headerConfig: true,
  type: 'large',
  scrollFlags: 'default',
};

function buildHeaderConfig(config: Config): StackHeaderConfigProps | undefined {
  if (!config.headerConfig) {
    return undefined;
  }

  return {
    title: 'Hidden restore',
    hidden: config.hidden,
    android: {
      type: config.type,
      ...SCROLL_FLAG_PRESETS[config.scrollFlags],
    },
  };
}

function HomeScreen() {
  const { push, setRouteOptions, routeKey } = useStackNavigationContext();
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

  const hasHeader = config.headerConfig && !config.hidden;

  return (
    // Without a header there is nothing keeping the content below the status
    // bar, so the top inset has to take over while the header is gone.
    <SafeAreaView edges={{ top: !hasHeader }}>
      <ScrollViewMarker style={styles.scrollViewMarker}>
        <ScrollView
          nestedScrollEnabled
          style={styles.scroll}
          contentContainerStyle={styles.content}
          // The controls stick below the header so they stay reachable at any
          // scroll offset.
          stickyHeaderIndices={[0]}>
          <View style={styles.controls}>
            <SettingsSwitch
              label="hidden"
              value={config.hidden}
              onValueChange={v => updateConfig('hidden', v)}
            />
            <SettingsSwitch
              label="headerConfig"
              value={config.headerConfig}
              onValueChange={v => updateConfig('headerConfig', v)}
            />
            <SettingsPicker<StackHeaderTypeAndroid>
              label="type"
              value={config.type}
              onValueChange={v => updateConfig('type', v)}
              items={HEADER_TYPES}
            />
            <SettingsPicker<ScrollFlagPreset>
              label="scroll flags"
              value={config.scrollFlags}
              onValueChange={v => updateConfig('scrollFlags', v)}
              items={SCROLL_FLAG_PRESET_NAMES}
            />
            <Button title="Push Details" onPress={() => push('Details')} />
          </View>

          <LongText size="xl" />
        </ScrollView>
      </ScrollViewMarker>
    </SafeAreaView>
  );
}

function DetailsScreen() {
  const { setRouteOptions, routeKey } = useStackNavigationContext();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig: {
        title: 'Details',
        hidden,
        android: {
          type: 'large',
          ...SCROLL_FLAG_PRESETS.default,
        },
      },
    });
  }, [hidden, setRouteOptions, routeKey]);

  return (
    <View style={styles.bg}>
      <SafeAreaView edges={{ top: hidden }}>
        <ScrollViewMarker style={styles.scrollViewMarker}>
          <ScrollView
            nestedScrollEnabled
            style={styles.scroll}
            contentContainerStyle={styles.content}
            stickyHeaderIndices={[0]}>
            <View style={styles.controls}>
              <SettingsSwitch
                label="hidden"
                value={hidden}
                onValueChange={setHidden}
              />
            </View>

            <LongText size="xl" />
          </ScrollView>
        </ScrollViewMarker>
      </SafeAreaView>
    </View>
  );
}

const STACK_ROUTE_CONFIGS: StackRouteConfig[] = [
  {
    name: 'Home',
    element: <HomeScreen />,
  },
  {
    name: 'Details',
    element: <DetailsScreen />,
    options: {
      headerConfig: {
        title: 'Details',
        hidden: true,
      },
    },
  },
];

function TestStackHeaderHiddenRestoreAndroid() {
  return <StackContainer routeConfigs={STACK_ROUTE_CONFIGS} />;
}

export default createScenario(
  TestStackHeaderHiddenRestoreAndroid,
  scenarioDescription,
);

const styles = StyleSheet.create({
  bg: {
    backgroundColor: Colors.cardBackground,
    flex: 1,
  },
  scrollViewMarker: {
    flex: 1,
  },
  scroll: {
    backgroundColor: Colors.cardBackground,
  },
  content: {
    padding: 16,
  },
  controls: {
    gap: 6,
    paddingVertical: 6,
    backgroundColor: Colors.cardBackground,
  },
});
