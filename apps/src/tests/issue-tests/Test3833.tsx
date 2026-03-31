import React, { createContext, useContext, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Button,
} from 'react-native';
import {
  Screen,
  ScreenStack,
  ScreenStackHeaderConfig,
} from 'react-native-screens';
import Colors from '../../shared/styling/Colors';
import LongText from '../../shared/LongText';

type ScreenKey = 'ScreenView' | 'ScreenScroll';

type ScreenConfig = {
  nativeBackground: string;
  reactBackground: string;
};

type AppConfig = {
  containerBackground: string;
  screens: Record<ScreenKey, ScreenConfig>;
};

const COLORS = [
  Colors.White,
  Colors.PurpleLight40,
  Colors.BlueLight40,
  Colors.NavyDark140,
  'transparent',
];

const DEFAULT_SCREEN_CONFIG: ScreenConfig = {
  nativeBackground: Colors.White,
  reactBackground: Colors.White,
};

const INITIAL_CONFIG: AppConfig = {
  containerBackground: Colors.White,
  screens: {
    ScreenView: { ...DEFAULT_SCREEN_CONFIG },
    ScreenScroll: { ...DEFAULT_SCREEN_CONFIG },
  },
};

const ConfigContext = createContext<{
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
} | null>(null);

const useConfig = () => {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('Missing ConfigContext');
  return ctx;
};

const ColorPicker = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (c: string) => void;
}) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={{ fontSize: 12, color: 'gray', marginBottom: 4 }}>
      {label}: {value}
    </Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10 }}>
      {COLORS.map(c => (
        <Pressable
          key={c}
          onPress={() => onChange(c)}
          style={{
            padding: 8,
            backgroundColor: 'white',
            borderRadius: 6,
            borderWidth: 2,
            borderColor: c,
          }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: c === value ? 'bold' : undefined,
            }}>
            {c}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  </View>
);

function PushedScreen({
  screenKey,
  onPop,
}: {
  screenKey: ScreenKey;
  onPop: () => void;
}) {
  const { config } = useConfig();
  const screenConfig = config.screens[screenKey];
  const isScroll = screenKey === 'ScreenScroll';
  const Container = isScroll ? ScrollView : View;

  return (
    <Container
      style={{ flex: 1, backgroundColor: screenConfig.reactBackground }}
      contentContainerStyle={isScroll ? { flexGrow: 1 } : undefined}>
      <View style={{ paddingTop: 20, paddingHorizontal: 16 }}>
        <Text>Container BG: {config.containerBackground}</Text>
        <Text>Native BG: {screenConfig.nativeBackground}</Text>
        <Text>React BG: {screenConfig.reactBackground}</Text>
        <Button title="Pop" onPress={onPop} />
      </View>
      {isScroll ? (
        <LongText size="xl" />
      ) : (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>View</Text>
        </View>
      )}
    </Container>
  );
}

function ConfigScreen({ onPush }: { onPush: (s: ScreenKey) => void }) {
  const { config, setConfig } = useConfig();

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        paddingTop: 20,
        paddingBottom: 100,
      }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Stack Background Tester
      </Text>

      <ColorPicker
        label="Container BG (nativeContainerStyle)"
        value={config.containerBackground}
        onChange={c => setConfig(p => ({ ...p, containerBackground: c }))}
      />

      {(Object.keys(config.screens) as ScreenKey[]).map(key => (
        <View key={key} style={{ marginTop: 12 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>{key}</Text>
          <ColorPicker
            label="Native BG (Screen style)"
            value={config.screens[key].nativeBackground}
            onChange={c =>
              setConfig(p => ({
                ...p,
                screens: {
                  ...p.screens,
                  [key]: { ...p.screens[key], nativeBackground: c },
                },
              }))
            }
          />
          <ColorPicker
            label="React View BG"
            value={config.screens[key].reactBackground}
            onChange={c =>
              setConfig(p => ({
                ...p,
                screens: {
                  ...p.screens,
                  [key]: { ...p.screens[key], reactBackground: c },
                },
              }))
            }
          />
          <Button title={`Push ${key}`} onPress={() => onPush(key)} />
        </View>
      ))}
    </ScrollView>
  );
}

export default function App() {
  const [config, setConfig] = useState(INITIAL_CONFIG);
  const [stack, setStack] = useState<ScreenKey[]>([]);

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      <ScreenStack
        style={{ flex: 1 }}
        nativeContainerStyle={{ backgroundColor: config.containerBackground }}>
        <Screen activityState={2} isNativeStack>
          <ScreenStackHeaderConfig title="Config" />
          <ConfigScreen onPush={s => setStack(p => [...p, s])} />
        </Screen>
        {stack.map((screenKey, i) => (
          <Screen
            key={`${screenKey}-${i}`}
            activityState={2}
            isNativeStack
            style={{ backgroundColor: config.screens[screenKey].nativeBackground }}>
            <ScreenStackHeaderConfig title={screenKey} />
            <PushedScreen
              screenKey={screenKey}
              onPop={() => setStack(p => p.slice(0, -1))}
            />
          </Screen>
        ))}
      </ScreenStack>
    </ConfigContext.Provider>
  );
}
