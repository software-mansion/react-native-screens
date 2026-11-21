import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import {
  SafeAreaView,
  type SafeAreaViewMode,
} from 'react-native-screens/experimental';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
  type StackRouteConfig,
} from '@apps/shared/containers/stack';
import { SettingsPicker } from '@apps/shared';
import { Colors } from '@apps/shared/styling';

type Header = 'shown' | 'hidden';

interface Config {
  mode: SafeAreaViewMode;
  header: Header;
}

const MODES: SafeAreaViewMode[] = ['padding', 'margin'];
const HEADERS: Header[] = ['shown', 'hidden'];
const DEFAULT_CONFIG: Config = { mode: 'padding', header: 'shown' };

const ConfigContext = createContext<{
  config: Config;
  setConfig: (config: Config) => void;
  mode: SafeAreaViewMode;
  toggleMode: () => void;
  launch: () => void;
}>({
  config: DEFAULT_CONFIG,
  setConfig: () => {},
  mode: 'padding',
  toggleMode: () => {},
  launch: () => {},
});

function expectationLines(config: Config): string[] {
  const topBar =
    config.header === 'hidden'
      ? 'the status bar'
      : Platform.OS === 'ios'
      ? 'the header'
      : 'no top bar, the content starts below the inline header on its own';
  const bottomBar =
    Platform.OS === 'ios' ? 'the home indicator' : 'the navigation bar';
  const lines =
    config.mode === 'padding'
      ? [
          `Padding: the SafeAreaView keeps the full screen frame and its yellow background shows under ${bottomBar} and under ${topBar}.`,
          'The white content starts at the bar edge and the red box keeps its size.',
          'The absolute badge is placed against the padded box, so it lands at the very top of the SafeAreaView, under the bar when there is one.',
        ]
      : [
          `Margin: the SafeAreaView shrinks away from ${bottomBar} and from ${topBar}, and the screen background shows in those strips instead of yellow.`,
          'The red box is displaced together with the view and keeps its size.',
          'The absolute badge moves with the view, so it sits just below the bar.',
        ];
  return lines;
}

function ConfigScreen() {
  const { config, setConfig, launch } = useContext(ConfigContext);
  const { push } = useStackNavigationContext();

  return (
    <SafeAreaView edges={{ top: true, bottom: true }} style={styles.config}>
      <SettingsPicker<SafeAreaViewMode>
        label="Mode"
        value={config.mode}
        onValueChange={next => setConfig({ ...config, mode: next })}
        items={MODES}
      />
      <SettingsPicker<Header>
        label="Header"
        value={config.header}
        onValueChange={header => setConfig({ ...config, header })}
        items={HEADERS}
      />
      <View style={styles.card}>
        {expectationLines(config).map(line => (
          <Text key={line} style={styles.line}>
            {'•'} {line}
          </Text>
        ))}
      </View>
      <Button
        title="Launch"
        color={Colors.primary}
        onPress={() => {
          launch();
          push('Mode');
        }}
      />
    </SafeAreaView>
  );
}

function ModeScreen() {
  const { config, mode, toggleMode } = useContext(ConfigContext);
  const { setRouteOptions, routeKey, pop } = useStackNavigationContext();
  const [savFrame, setSavFrame] = useState('');
  const [absTop, setAbsTop] = useState<number | null>(null);

  React.useLayoutEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig:
        config.header === 'hidden'
          ? { hidden: true }
          : { title: 'SafeAreaView mode' },
    });
  }, [config, setRouteOptions, routeKey]);

  const onSavLayout = useCallback((e: LayoutChangeEvent) => {
    const { x, y, width, height } = e.nativeEvent.layout;
    setSavFrame(
      `${Math.round(x)},${Math.round(y)} ${Math.round(width)}x${Math.round(
        height,
      )}`,
    );
  }, []);
  const onAbsLayout = useCallback((e: LayoutChangeEvent) => {
    setAbsTop(Math.round(e.nativeEvent.layout.y));
  }, []);

  return (
    <View style={styles.screen}>
      <SafeAreaView
        mode={mode}
        edges={{
          top: Platform.OS === 'ios' || config.header === 'hidden',
          bottom: true,
          left: true,
          right: true,
        }}
        style={styles.safeArea}
        onLayout={onSavLayout}>
        <View style={styles.content}>
          <Text style={styles.badge}>
            mode {mode}
            {'\n'}SafeAreaView frame {savFrame}
            {'\n'}absolute child top {absTop ?? '…'} (relative to the
            SafeAreaView)
          </Text>
          <View style={styles.fixedBox}>
            <Text style={styles.fixedText}>100 × 100</Text>
          </View>
          <Button title="Toggle mode" onPress={toggleMode} />
          <Button title="Config" onPress={() => pop(routeKey)} />
        </View>
        <View
          style={styles.absolute}
          onLayout={onAbsLayout}
          pointerEvents="none">
          <Text style={styles.absoluteText}>absolute, top 8</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const ROUTE_CONFIGS: StackRouteConfig[] = [
  {
    name: 'Config',
    element: <ConfigScreen />,
    options: { headerConfig: { title: 'SafeAreaView mode' } },
  },
  { name: 'Mode', element: <ModeScreen /> },
];

function Scenario() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [mode, setMode] = useState<SafeAreaViewMode>(DEFAULT_CONFIG.mode);
  const toggleMode = useCallback(
    () => setMode(m => (m === 'padding' ? 'margin' : 'padding')),
    [],
  );
  const launch = useCallback(() => setMode(config.mode), [config.mode]);
  const value = useMemo(
    () => ({ config, setConfig, mode, toggleMode, launch }),
    [config, mode, toggleMode, launch],
  );

  return (
    <ConfigContext.Provider value={value}>
      <StackContainer routeConfigs={ROUTE_CONFIGS} />
    </ConfigContext.Provider>
  );
}

export default createScenario(Scenario, scenarioDescription);

const styles = StyleSheet.create({
  config: { flex: 1, padding: 16, gap: 12 },
  card: {
    padding: 12,
    gap: 6,
    backgroundColor: Colors.NavyLight20,
    borderRadius: 8,
  },
  line: { fontSize: 13, lineHeight: 18 },
  screen: { flex: 1, backgroundColor: Colors.NavyLight40 },
  safeArea: { flex: 1, backgroundColor: Colors.YellowLight20 },
  content: { flex: 1, backgroundColor: 'white', padding: 12, gap: 12 },
  badge: {
    fontSize: 13,
    fontWeight: '600',
    backgroundColor: Colors.GreenLight40,
    padding: 8,
    borderRadius: 8,
  },
  fixedBox: {
    width: 100,
    height: 100,
    backgroundColor: Colors.RedLight100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedText: { color: 'white', fontWeight: '700' },
  absolute: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 6,
    backgroundColor: Colors.NavyLight100,
    borderRadius: 6,
  },
  absoluteText: { color: 'white', fontSize: 12 },
});
