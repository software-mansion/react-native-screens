import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
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
  type StackHeaderTypeAndroid,
  ScrollViewMarker,
} from 'react-native-screens';
import { SafeAreaView } from 'react-native-screens/experimental';
import LongText from '@apps/shared/LongText';

const HEADER_TYPES: StackHeaderTypeAndroid[] = ['small', 'medium', 'large'];

interface Config {
  hidden: boolean;
  type: StackHeaderTypeAndroid;
  scrollFlagScroll: boolean;
  scrollFlagEnterAlways: boolean;
  scrollFlagEnterAlwaysCollapsed: boolean;
  scrollFlagExitUntilCollapsed: boolean;
  scrollFlagSnap: boolean;
}

const DEFAULT_CONFIG: Config = {
  hidden: false,
  type: 'large',
  scrollFlagScroll: true,
  scrollFlagEnterAlways: false,
  scrollFlagEnterAlwaysCollapsed: false,
  scrollFlagExitUntilCollapsed: true,
  scrollFlagSnap: true,
};

function buildHeaderConfig(config: Config): StackHeaderConfigProps {
  return {
    title: 'Hidden restore',
    hidden: config.hidden,
    android: {
      type: config.type,
      scrollFlagScroll: config.scrollFlagScroll,
      scrollFlagEnterAlways: config.scrollFlagEnterAlways,
      scrollFlagEnterAlwaysCollapsed: config.scrollFlagEnterAlwaysCollapsed,
      scrollFlagExitUntilCollapsed: config.scrollFlagExitUntilCollapsed,
      scrollFlagSnap: config.scrollFlagSnap,
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

  return (
    // Without a header there is nothing keeping the content below the status
    // bar, so the top inset has to take over while `hidden` is set.
    <SafeAreaView edges={{ top: config.hidden }}>
      <ScrollViewMarker style={styles.scrollViewMarker}>
        <ScrollView
          nestedScrollEnabled
          style={styles.scroll}
          contentContainerStyle={styles.content}>
          <Text style={styles.heading}>Scroll flags</Text>
          <SettingsSwitch
            label="scrollFlagScroll"
            value={config.scrollFlagScroll}
            onValueChange={v => updateConfig('scrollFlagScroll', v)}
          />
          <SettingsSwitch
            label="scrollFlagEnterAlways"
            value={config.scrollFlagEnterAlways}
            onValueChange={v => updateConfig('scrollFlagEnterAlways', v)}
          />
          <SettingsSwitch
            label="scrollFlagEnterAlwaysCollapsed"
            value={config.scrollFlagEnterAlwaysCollapsed}
            onValueChange={v =>
              updateConfig('scrollFlagEnterAlwaysCollapsed', v)
            }
          />
          <SettingsSwitch
            label="scrollFlagExitUntilCollapsed"
            value={config.scrollFlagExitUntilCollapsed}
            onValueChange={v => updateConfig('scrollFlagExitUntilCollapsed', v)}
          />
          <SettingsSwitch
            label="scrollFlagSnap"
            value={config.scrollFlagSnap}
            onValueChange={v => updateConfig('scrollFlagSnap', v)}
          />
          <Text style={styles.heading}>Header config</Text>
          <SettingsPicker<StackHeaderTypeAndroid>
            label="type"
            value={config.type}
            onValueChange={v => updateConfig('type', v)}
            items={HEADER_TYPES}
          />
          <SettingsSwitch
            label="hidden"
            value={config.hidden}
            onValueChange={v => updateConfig('hidden', v)}
          />

          <View style={styles.section}>
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
          scrollFlagScroll: true,
          scrollFlagExitUntilCollapsed: true,
          scrollFlagSnap: true,
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
            contentContainerStyle={styles.content}>
            <Text style={styles.text}>
              This screen mounts with its header hidden - the header below has
              never been built when it is first shown.
            </Text>
            <LongText size="sm" />
            <SettingsSwitch
              label="hidden"
              value={hidden}
              onValueChange={setHidden}
            />

            <LongText size="lg" />
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
    gap: 6,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  section: {
    marginVertical: 12,
  },
  text: {
    color: 'gray',
    marginBottom: 10,
  },
});
