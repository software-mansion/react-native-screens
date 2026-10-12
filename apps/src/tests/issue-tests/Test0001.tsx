// Requires the TEMPORARY patch of the `react-navigation` submodule that
// forwards the `unstable_safeAreaEdges` screen option to `ScreenStackItem`.
import React, { createContext, useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationOptions,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Button, SettingsPicker, SettingsSwitch } from '@apps/shared';
import { Colors, Palette } from '@apps/shared/styling';

type EdgeValue = 'default' | 'true' | 'false';
type Edge = 'top' | 'right' | 'bottom' | 'left';
type ContentType = 'scrollView' | 'view';
type ScrollContent = 'long' | 'short';
type InsetAdjustment = 'automatic' | 'never';
type SheetDetents = 'fitToContents' | 'medium-large';
type Presentation = 'card' | 'formSheet';

const EDGES: Edge[] = ['top', 'right', 'bottom', 'left'];
const EDGE_VALUES: EdgeValue[] = ['default', 'true', 'false'];
const FIT_TO_CONTENTS_HEIGHT = 300;
const ROW_COUNT: Record<ScrollContent, number> = { long: 30, short: 5 };

interface Config {
  edges: Record<Edge, EdgeValue>;
  contentType: ContentType;
  scrollContent: ScrollContent;
  insetAdjustment: InsetAdjustment;
  headerShown: boolean;
  headerTransparent: boolean;
  headerLargeTitle: boolean;
  presentation: Presentation;
  sheetDetents: SheetDetents;
}

const DEFAULT_CONFIG: Config = {
  edges: {
    top: 'default',
    right: 'default',
    bottom: 'default',
    left: 'default',
  },
  contentType: 'scrollView',
  scrollContent: 'long',
  insetAdjustment: 'automatic',
  headerShown: true,
  headerTransparent: false,
  headerLargeTitle: false,
  presentation: 'card',
  sheetDetents: 'medium-large',
};

type ParamList = {
  Config: undefined;
  Test: undefined;
};

const ConfigContext = createContext<{
  config: Config;
  setConfig: (config: Config) => void;
}>({ config: DEFAULT_CONFIG, setConfig: () => {} });

function toSafeAreaEdges(
  edges: Config['edges'],
): NativeStackNavigationOptions['unstable_safeAreaEdges'] {
  const result: Partial<Record<Edge, boolean>> = {};
  for (const edge of EDGES) {
    if (edges[edge] !== 'default') {
      result[edge] = edges[edge] === 'true';
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

function toTestScreenOptions(config: Config): NativeStackNavigationOptions {
  return {
    title: 'Test screen',
    headerShown: config.headerShown,
    // Passed explicitly also when `false`, as `headerLargeTitle` makes the header translucent unless
    // `headerTransparent` is `false`.
    headerTransparent: config.headerTransparent,
    headerLargeTitle: config.headerLargeTitle,
    presentation: config.presentation,
    sheetAllowedDetents:
      config.sheetDetents === 'fitToContents' ? 'fitToContents' : [0.5, 1],
    contentStyle: styles.redBackground,
    unstable_safeAreaEdges: toSafeAreaEdges(config.edges),
  };
}

function ConfigScreen({
  navigation,
}: NativeStackScreenProps<ParamList, 'Config'>) {
  const { config, setConfig } = useContext(ConfigContext);
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.configContent}>
      <Text style={styles.title}>unstable_safeAreaEdges</Text>
      {EDGES.map(edge => (
        <SettingsPicker<EdgeValue>
          key={edge}
          label={edge}
          value={config.edges[edge]}
          onValueChange={value =>
            setConfig({ ...config, edges: { ...config.edges, [edge]: value } })
          }
          items={EDGE_VALUES}
        />
      ))}
      <Text style={styles.title}>Content</Text>
      <SettingsPicker<ContentType>
        label="content"
        value={config.contentType}
        onValueChange={value => setConfig({ ...config, contentType: value })}
        items={['scrollView', 'view']}
      />
      <SettingsPicker<ScrollContent>
        label="scroll content"
        value={config.scrollContent}
        onValueChange={value => setConfig({ ...config, scrollContent: value })}
        items={['long', 'short']}
      />
      <SettingsPicker<InsetAdjustment>
        label="contentInsetAdjustment"
        value={config.insetAdjustment}
        onValueChange={value =>
          setConfig({ ...config, insetAdjustment: value })
        }
        items={['automatic', 'never']}
      />
      <Text style={styles.title}>Header</Text>
      <SettingsSwitch
        label="headerShown"
        value={config.headerShown}
        onValueChange={value => setConfig({ ...config, headerShown: value })}
      />
      <SettingsSwitch
        label="headerTransparent"
        value={config.headerTransparent}
        onValueChange={value =>
          setConfig({ ...config, headerTransparent: value })
        }
      />
      <SettingsSwitch
        label="headerLargeTitle"
        value={config.headerLargeTitle}
        onValueChange={value =>
          setConfig({ ...config, headerLargeTitle: value })
        }
      />
      <Text style={styles.title}>Presentation</Text>
      <SettingsPicker<Presentation>
        label="presentation"
        value={config.presentation}
        onValueChange={value => setConfig({ ...config, presentation: value })}
        items={['card', 'formSheet']}
      />
      <SettingsPicker<SheetDetents>
        label="sheetAllowedDetents"
        value={config.sheetDetents}
        onValueChange={value => setConfig({ ...config, sheetDetents: value })}
        items={['medium-large', 'fitToContents']}
      />
      <Button
        title="Open test screen"
        onPress={() => navigation.navigate('Test')}
      />
    </ScrollView>
  );
}

function Marker({ label }: { label: string }) {
  return (
    <View style={styles.marker}>
      <Text style={styles.markerText}>{label}</Text>
    </View>
  );
}

function Rows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <Text key={index} style={styles.row}>
          Row {index + 1}
        </Text>
      ))}
    </>
  );
}

function TestScreen({ navigation }: NativeStackScreenProps<ParamList, 'Test'>) {
  const { config } = useContext(ConfigContext);
  const close = () => navigation.goBack();
  const isFitToContents =
    config.presentation === 'formSheet' &&
    config.sheetDetents === 'fitToContents';
  // `fitToContents` sheets derive their height from the content, so it must not flex.
  const fitToContentsStyle = { height: FIT_TO_CONTENTS_HEIGHT };
  const containerStyle = isFitToContents ? fitToContentsStyle : styles.fill;

  if (config.contentType === 'view') {
    return (
      <View style={[containerStyle, styles.content]}>
        <Marker label="Content top" />
        <Button title="Close" onPress={close} />
        <View style={styles.fill} />
        <Marker label="Content bottom" />
      </View>
    );
  }

  // In a `fitToContents` sheet, a long scroll view gets a fixed height (otherwise it would grow to
  // its whole content), a short one sizes to its content.
  const scrollViewStyle =
    isFitToContents && config.scrollContent === 'long'
      ? fitToContentsStyle
      : styles.fill;

  return (
    <ScrollView
      style={[scrollViewStyle, styles.content]}
      contentInsetAdjustmentBehavior={config.insetAdjustment}>
      <Marker label="Content top" />
      <Button title="Close" onPress={close} />
      <Rows count={ROW_COUNT[config.scrollContent]} />
      <Marker label="Content bottom" />
    </ScrollView>
  );
}

const Stack = createNativeStackNavigator<ParamList>();

export default function Test0001() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Config"
            component={ConfigScreen}
            options={{ title: 'Safe area edges' }}
          />
          <Stack.Screen
            name="Test"
            component={TestScreen}
            options={toTestScreenOptions(config)}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ConfigContext.Provider>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  configContent: {
    padding: 16,
    gap: 5,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 10,
  },
  redBackground: {
    backgroundColor: 'red',
  },
  content: {
    backgroundColor: Colors.cardBackground,
  },
  marker: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Palette.GreenLight100,
  },
  markerText: {
    fontWeight: 'bold',
  },
  row: {
    padding: 12,
  },
});
