import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';
import {
  createScenario,
  ScenarioDescription,
} from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import { Colors } from '@apps/shared/styling';
import type { StackHeaderConfigProps } from 'react-native-screens/experimental';

const scenarioDescription: ScenarioDescription = {
  name: 'Stack Toolbar Menu Commands',
  key: 'test-stack-toolbar-menu-commands',
  details: 'Tests changes to toolbar menu in runtime.',
  platforms: ['android'],
};

interface Config {
  // backButtonHidden: boolean;
  // tintColor: TintColorOption;
  // icon: IconOption;
}

const DEFAULT_CONFIG: Config = {
  // backButtonHidden: false,
  // tintColor: 'default',
  // icon: 'default',
};

const ConfigContext = React.createContext<{
  config: Config;
  updateConfig: <K extends keyof Config>(key: K, value: Config[K]) => void;
}>({
  config: DEFAULT_CONFIG,
  updateConfig: () => {},
});

function buildHeaderConfig(config: Config): StackHeaderConfigProps {
  return {
    title: 'Toolbar Menu Commands Test',
    // backButtonHidden: config.backButtonHidden,
    // android: {
    //   backButtonTintColor: resolveTintColor(config.tintColor),
    //   backButtonIcon: resolveIcon(config.icon),
    // },
  };
}

export function App() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);

  const updateConfig = useCallback(
    <K extends keyof Config>(key: K, value: Config[K]) => {
      setConfig(prev => ({ ...prev, [key]: value }));
    },
    [],
  );

  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
      <StackContainer
        routeConfigs={[
          {
            name: 'Root',
            Component: RootScreen,
            options: {},
          },
          {
            name: 'Pushed',
            Component: PushedScreen,
            options: {},
          },
        ]}
      />
    </ConfigContext.Provider>
  );
}

function ConfigControls() {
  const { config, updateConfig } = React.useContext(ConfigContext);

  return (
    <>
      <Text style={styles.heading}>Toolbar Menu</Text>
      {/*<SettingsSwitch
        label="backButtonHidden"
        value={config.backButtonHidden}
        onValueChange={v => updateConfig('backButtonHidden', v)}
      />
      <SettingsPicker<TintColorOption>
        label="tintColor"
        value={config.tintColor}
        onValueChange={v => updateConfig('tintColor', v)}
        items={TINT_COLOR_OPTIONS}
      />
      <SettingsPicker<IconOption>
        label="icon"
        value={config.icon}
        onValueChange={v => updateConfig('icon', v)}
        items={ICON_OPTIONS}
      />*/}
    </>
  );
}

function useApplyHeaderConfig() {
  const { config } = React.useContext(ConfigContext);
  const { setRouteOptions, routeKey } = useStackNavigationContext();
  const headerConfig = useMemo(() => buildHeaderConfig(config), [config]);

  useEffect(() => {
    setRouteOptions(routeKey, { headerConfig });
  }, [headerConfig, setRouteOptions, routeKey]);
}

function RootScreen() {
  const { push } = useStackNavigationContext();
  useApplyHeaderConfig();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <ConfigControls />
      <Text style={styles.heading}>Navigation</Text>
      <Button title="Push screen" onPress={() => push('Pushed')} />
    </ScrollView>
  );
}

function PushedScreen() {
  const { push } = useStackNavigationContext();
  useApplyHeaderConfig();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <ConfigControls />
      <Text style={styles.heading}>Navigation</Text>
      <Button title="Push another" onPress={() => push('Pushed')} />
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
});

export default createScenario(App, scenarioDescription);
