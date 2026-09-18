import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, ScrollView, StyleSheet } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { SettingsSwitch } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import {
  HeaderAppearanceSection,
  buildHeaderAppearance,
  makeDefaultHeaderAppearanceConfig,
  type HeaderAppearanceConfig,
} from '@apps/tests/shared/components/stack-v5/HeaderAppearanceControls';
import type { StackHeaderConfigProps } from 'react-native-screens';

const TITLE_TEXT = 'Title';
const SUBTITLE_TEXT = 'Subtitle';
const LARGE_TITLE_TEXT = 'Large Title';
const LARGE_SUBTITLE_TEXT = 'Large Subtitle';

// Subtitle appearance covers both regular and large subtitle — UIKit
// derives the large subtitle appearance from subtitleTextAttributes.
const SLOTS = ['title', 'largeTitle', 'subtitle'] as const;

type SlotKey = (typeof SLOTS)[number];

type AppearanceKey = 'standard' | 'scrollEdge';

interface Config {
  largeTitleEnabled: boolean;
  standard: HeaderAppearanceConfig<SlotKey>;
  scrollEdge: HeaderAppearanceConfig<SlotKey>;
}

const DEFAULT_CONFIG: Config = {
  largeTitleEnabled: false,
  standard: makeDefaultHeaderAppearanceConfig(SLOTS),
  scrollEdge: makeDefaultHeaderAppearanceConfig(SLOTS),
};

function buildHeaderConfig(config: Config): StackHeaderConfigProps {
  return {
    title: TITLE_TEXT,
    subtitle: SUBTITLE_TEXT,
    ios: {
      largeTitle: LARGE_TITLE_TEXT,
      largeSubtitle: LARGE_SUBTITLE_TEXT,
      largeTitleEnabled: config.largeTitleEnabled,
      standardAppearance: buildHeaderAppearance(config.standard),
      scrollEdgeAppearance: buildHeaderAppearance(config.scrollEdge),
    },
  };
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
    (appearance: AppearanceKey, next: HeaderAppearanceConfig<SlotKey>) => {
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
            standard: makeDefaultHeaderAppearanceConfig(SLOTS),
            scrollEdge: makeDefaultHeaderAppearanceConfig(SLOTS),
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

      <HeaderAppearanceSection
        label="standardAppearance"
        slotKeys={SLOTS}
        value={config.standard}
        onChange={next => updateAppearance('standard', next)}
      />
      <HeaderAppearanceSection
        label="scrollEdgeAppearance"
        slotKeys={SLOTS}
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
});

export default createScenario(
  TestStackHeaderTitleAppearanceIOS,
  scenarioDescription,
);
