import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { SettingsPicker, SettingsSwitch } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import {
  type StackHeaderConfigProps,
  ScrollViewMarker,
} from 'react-native-screens';
import LongText from '@apps/shared/LongText';

type TriState = 'undefined' | 'true' | 'false';

const TRI_STATE_VALUES: TriState[] = ['undefined', 'true', 'false'];

interface Config {
  enabled: boolean;
  liftOnScroll: TriState;
  transparent: boolean;
  hidden: boolean;
}

const DEFAULT_CONFIG: Config = {
  enabled: true,
  liftOnScroll: 'undefined', // -> default (true)
  transparent: false,
  hidden: false,
};

function resolveTriState(value: TriState): boolean | undefined {
  return value === 'undefined' ? undefined : value === 'true';
}

function buildHeaderConfig(config: Config): StackHeaderConfigProps | undefined {
  if (!config.enabled) {
    return undefined;
  }

  return {
    title: 'Lift on scroll',
    hidden: config.hidden,
    transparent: config.transparent,
    android: {
      type: 'small',
      liftOnScroll: resolveTriState(config.liftOnScroll),
    },
  };
}

function TestStackLiftOnScrollAndroid() {
  return (
    <StackContainer
      routeConfigs={[{ name: 'Home', Component: ConfigScreen, options: {} }]}
    />
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
    <ScrollViewMarker>
      <ScrollView
        nestedScrollEnabled
        style={styles.scroll}
        contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Header config</Text>
        <SettingsSwitch
          label="headerConfig enabled (attach/detach)"
          value={config.enabled}
          onValueChange={v => updateConfig('enabled', v)}
        />
        <SettingsPicker<TriState>
          label="liftOnScroll"
          value={config.liftOnScroll}
          onValueChange={v => updateConfig('liftOnScroll', v)}
          items={TRI_STATE_VALUES}
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

        <Text style={styles.heading}>Scroll to observe lift</Text>
        <LongText size="xl" />
      </ScrollView>
    </ScrollViewMarker>
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
});

export default createScenario(
  TestStackLiftOnScrollAndroid,
  scenarioDescription,
);
