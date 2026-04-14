import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';
import { Scenario } from '../../shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '../../../shared/gamma/containers/stack';
import { SettingsPicker, SettingsSwitch } from '../../../shared';
import Colors from '../../../shared/styling/Colors';
import type {
  StackHeaderConfigProps,
  StackHeaderConfigPropsAndroid,
} from 'react-native-screens/experimental';

const SCENARIO: Scenario = {
  name: 'Stack Back Button',
  key: 'test-stack-back-button',
  details: 'Tests back button customization: hidden, tint color, custom icon.',
  platforms: ['android'],
  AppComponent: App,
};

export default SCENARIO;

type TintColorOption = 'default' | 'purple' | 'red' | 'green';
type IconOption = 'default' | 'imageSource' | 'drawableResource';

const TINT_COLOR_OPTIONS: TintColorOption[] = [
  'default',
  'purple',
  'red',
  'green',
];

const ICON_OPTIONS: IconOption[] = [
  'default',
  'imageSource',
  'drawableResource',
];

interface Config {
  backButtonHidden: boolean;
  tintColor: TintColorOption;
  icon: IconOption;
}

const DEFAULT_CONFIG: Config = {
  backButtonHidden: false,
  tintColor: 'default',
  icon: 'default',
};

const ConfigContext = React.createContext<{
  config: Config;
  updateConfig: <K extends keyof Config>(key: K, value: Config[K]) => void;
}>({
  config: DEFAULT_CONFIG,
  updateConfig: () => {},
});

function resolveTintColor(
  option: TintColorOption,
): StackHeaderConfigPropsAndroid['backButtonTintColor'] {
  switch (option) {
    case 'purple':
      return Colors.PurpleLight100;
    case 'red':
      return Colors.RedLight100;
    case 'green':
      return Colors.GreenLight100;
    default:
      return undefined;
  }
}

function resolveIcon(
  option: IconOption,
): StackHeaderConfigPropsAndroid['backButtonIcon'] {
  switch (option) {
    case 'imageSource':
      return {
        type: 'imageSource',
        imageSource: require('../../../../assets/backButton.png'),
      };
    case 'drawableResource':
      return {
        type: 'drawableResource',
        name: 'sym_call_missed',
      };
    default:
      return undefined;
  }
}

function buildHeaderConfig(config: Config): StackHeaderConfigProps {
  return {
    title: 'Back Button Test',
    backButtonHidden: config.backButtonHidden,
    android: {
      backButtonTintColor: resolveTintColor(config.tintColor),
      backButtonIcon: resolveIcon(config.icon),
    },
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
      <StackSetup config={config} updateConfig={updateConfig} />
    </ConfigContext.Provider>
  );
}

function StackSetup({
  config,
  updateConfig,
}: {
  config: Config;
  updateConfig: <K extends keyof Config>(key: K, value: Config[K]) => void;
}) {
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
      <Text style={styles.heading}>Back Button</Text>
      <SettingsSwitch
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
      />
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
