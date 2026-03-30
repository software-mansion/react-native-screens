import React, {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Button,
  useWindowDimensions,
} from 'react-native';
import { Screen, ScreenStack, ScreenStackHeaderConfig } from 'react-native-screens';
import Colors from '../../shared/styling/Colors';
import LongText from '../../shared/LongText';
import { someExtensiveComputation } from './TestBottomTabs/utils';

type ContentType = 'view' | 'scrollViewWithText' | 'scrollViewWithRects';

type RectConfig = {
  height: number;
  gap: number;
};

type ScreenConfig = {
  reactBackground: string;
  isHeavy: 'true' | 'false';
  contentType: ContentType;
  rectConfig: RectConfig;
};

type AppConfig = {
  containerBackground: string;
  screens: Record<ScreenKey, ScreenConfig>;
};

type BackgroundContextType = {
  config: AppConfig;
  setConfig: Dispatch<SetStateAction<AppConfig>>;
  applyPreset: (preset: AppConfig) => void;
};

type ScreenKey = 'ScreenA' | 'ScreenB' | 'ScreenC';

const DEFAULT_RECT_CONFIG: RectConfig = {
  height: 100,
  gap: 20,
};

const DEFAULT_SCREEN_CONFIG: ScreenConfig = {
  reactBackground: Colors.White,
  isHeavy: 'false',
  contentType: 'view',
  rectConfig: DEFAULT_RECT_CONFIG,
};

const INITIAL_CONFIG: AppConfig = {
  containerBackground: Colors.White,
  screens: {
    ScreenA: { ...DEFAULT_SCREEN_CONFIG, contentType: 'view' },
    ScreenB: { ...DEFAULT_SCREEN_CONFIG, contentType: 'scrollViewWithText' },
    ScreenC: { ...DEFAULT_SCREEN_CONFIG, contentType: 'scrollViewWithRects' },
  },
};

const PRESETS: Record<string, AppConfig> = {
  Default: INITIAL_CONFIG,
  ColorfulContainer: {
    containerBackground: Colors.PurpleLight40,
    screens: {
      ScreenA: { ...DEFAULT_SCREEN_CONFIG, contentType: 'view', reactBackground: 'transparent' },
      ScreenB: { ...DEFAULT_SCREEN_CONFIG, contentType: 'scrollViewWithText', reactBackground: 'transparent' },
      ScreenC: { ...DEFAULT_SCREEN_CONFIG, contentType: 'scrollViewWithRects', reactBackground: 'transparent' },
    },
  },
  ColorfulReact: {
    containerBackground: Colors.White,
    screens: {
      ScreenA: {
        ...DEFAULT_SCREEN_CONFIG,
        contentType: 'view',
        reactBackground: Colors.PurpleLight40,
      },
      ScreenB: {
        ...DEFAULT_SCREEN_CONFIG,
        contentType: 'scrollViewWithText',
        reactBackground: Colors.BlueLight40,
      },
      ScreenC: {
        ...DEFAULT_SCREEN_CONFIG,
        contentType: 'scrollViewWithRects',
        reactBackground: Colors.NavyDark140,
        rectConfig: { height: 80, gap: 15 },
      },
    },
  },
  ColorfulContainerReact: {
    containerBackground: Colors.NavyDark140,
    screens: {
      ScreenA: {
        ...DEFAULT_SCREEN_CONFIG,
        contentType: 'view',
        reactBackground: Colors.PurpleLight40,
      },
      ScreenB: {
        ...DEFAULT_SCREEN_CONFIG,
        contentType: 'scrollViewWithText',
        reactBackground: Colors.BlueLight40,
      },
      ScreenC: {
        ...DEFAULT_SCREEN_CONFIG,
        contentType: 'scrollViewWithRects',
        reactBackground: Colors.White,
        rectConfig: { height: 80, gap: 15 },
      },
    },
  },
};

const BackgroundTestContext = createContext<BackgroundContextType | null>(null);

const useBackgroundTestContext = () => {
  const context = useContext(BackgroundTestContext);
  if (!context)
    throw new Error('useBackgroundTestContext must be used within provider');
  return context;
};

const ConfigSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View
    style={{
      marginBottom: 20,
      padding: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
    }}>
    <Text style={{ fontWeight: 'bold', marginBottom: 10, fontSize: 16 }}>
      {title}
    </Text>
    {children}
  </View>
);

const SimplePicker = ({
  label,
  value,
  options,
  onChange,
  type = 'normal',
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (option: string) => void;
  type?: 'normal' | 'color';
}) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={{ fontSize: 12, color: 'gray' }}>
      {label}: {value}
    </Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        gap: 12,
        padding: 5,
      }}>
      {options.map((opt: string) => (
        <Pressable
          key={opt}
          onPress={() => onChange(opt)}
          style={{
            padding: 8,
            backgroundColor: 'white',
            borderRadius: 6,
            borderWidth: 2,
            borderColor: type === 'color' ? opt : '#ddd',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 12,
              fontWeight: opt === value ? 'bold' : undefined,
            }}>
            {opt}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  </View>
);

const RectsGenerator = ({ config }: { config: RectConfig }) => {
  const { width } = useWindowDimensions();
  const sidePadding = 30;

  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        gap: config.gap,
        paddingVertical: config.gap,
      }}>
      {[...Array(20).keys()].map(i => (
        <View
          key={i}
          style={{
            width: width - sidePadding * 2,
            height: config.height,
            backgroundColor: Colors.PurpleLight80,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 4,
          }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>{i + 1}</Text>
        </View>
      ))}
    </View>
  );
};

const TestScreenContent = ({
  screenKey,
  onPop,
}: {
  screenKey: ScreenKey;
  onPop: () => void;
}) => {
  const { config } = useBackgroundTestContext();
  const screenConfig = config.screens[screenKey];

  const Container = screenConfig.contentType === 'view' ? View : ScrollView;

  if (screenConfig.isHeavy === 'true') {
    someExtensiveComputation();
  }

  return (
    <Container
      style={{ flex: 1, backgroundColor: screenConfig.reactBackground }}
      contentContainerStyle={
        screenConfig.contentType !== 'view' ? { flexGrow: 1 } : undefined
      }>
      <View style={{ paddingTop: 20, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{screenKey}</Text>
        <Text>React BG: {screenConfig.reactBackground}</Text>
        <Text>Container BG: {config.containerBackground}</Text>
        <View style={{ marginTop: 16, gap: 8 }}>
          <Button title="Pop" onPress={onPop} />
        </View>
      </View>

      {screenConfig.contentType === 'scrollViewWithText' && (
        <LongText size="xl" />
      )}

      {screenConfig.contentType === 'scrollViewWithRects' && (
        <RectsGenerator config={screenConfig.rectConfig} />
      )}
    </Container>
  );
};

function ConfigScreenContent({
  onPush,
}: {
  onPush: (screen: ScreenKey) => void;
}) {
  const { config, setConfig, applyPreset } = useBackgroundTestContext();

  const updateScreen = (key: ScreenKey, update: Partial<ScreenConfig>) => {
    setConfig(prev => ({
      ...prev,
      screens: {
        ...prev.screens,
        [key]: { ...prev.screens[key], ...update },
      },
    }));
  };

  const updateRects = (key: ScreenKey, update: Partial<RectConfig>) => {
    setConfig(prev => ({
      ...prev,
      screens: {
        ...prev.screens,
        [key]: {
          ...prev.screens[key],
          rectConfig: { ...prev.screens[key].rectConfig, ...update },
        },
      },
    }));
  };

  const colors = [
    Colors.White,
    Colors.PurpleLight40,
    Colors.BlueLight40,
    Colors.NavyDark140,
    'transparent',
  ];
  const contentTypes = ['view', 'scrollViewWithText', 'scrollViewWithRects'];

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

      <ConfigSection title="Presets">
        <ScrollView horizontal contentContainerStyle={{ gap: 10 }}>
          {Object.keys(PRESETS).map(name => (
            <Pressable
              key={name}
              style={{
                padding: 8,
                backgroundColor: 'white',
                borderRadius: 6,
                borderWidth: 1,
                borderColor: '#ddd',
              }}
              onPress={() => applyPreset(PRESETS[name])}>
              <Text>{name}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </ConfigSection>

      <ConfigSection title="Container (ScreenStack)">
        <SimplePicker
          type="color"
          label="Container BG (style.backgroundColor)"
          value={config.containerBackground}
          options={colors}
          onChange={(c: string) =>
            setConfig(p => ({ ...p, containerBackground: c }))
          }
        />
      </ConfigSection>

      <ConfigSection title="Push Screens">
        <View style={{ gap: 8 }}>
          <Button
            title="Push Screen A (view)"
            onPress={() => onPush('ScreenA')}
          />
          <Button
            title="Push Screen B (scrollText)"
            onPress={() => onPush('ScreenB')}
          />
          <Button
            title="Push Screen C (scrollRects)"
            onPress={() => onPush('ScreenC')}
          />
        </View>
      </ConfigSection>

      {(Object.keys(config.screens) as ScreenKey[]).map(key => {
        const sConfig = config.screens[key];
        return (
          <ConfigSection key={key} title={`Config: ${key}`}>
            <SimplePicker
              type="color"
              label="React View BG"
              value={sConfig.reactBackground}
              options={colors}
              onChange={(c: string) =>
                updateScreen(key, { reactBackground: c })
              }
            />
            <SimplePicker
              label="Heavy Render"
              value={String(sConfig.isHeavy)}
              options={['true', 'false']}
              onChange={(c: string) =>
                updateScreen(key, {
                  isHeavy: c === 'true' ? 'true' : 'false',
                })
              }
            />
            <SimplePicker
              label="Content Type"
              value={sConfig.contentType}
              options={contentTypes}
              onChange={(c: any) => updateScreen(key, { contentType: c })}
            />
            {sConfig.contentType === 'scrollViewWithRects' && (
              <View
                style={{
                  marginTop: 10,
                  padding: 10,
                  backgroundColor: '#fff',
                  borderRadius: 4,
                }}>
                <Text style={{ fontWeight: 'bold' }}>Rect Configs:</Text>
                <SimplePicker
                  label="Item Height"
                  value={String(sConfig.rectConfig.height)}
                  options={['50', '100', '200']}
                  onChange={(v: string) =>
                    updateRects(key, { height: parseFloat(v) })
                  }
                />
                <SimplePicker
                  label="Gap Size"
                  value={String(sConfig.rectConfig.gap)}
                  options={['20', '50', '100']}
                  onChange={(v: string) =>
                    updateRects(key, { gap: parseFloat(v) })
                  }
                />
              </View>
            )}
          </ConfigSection>
        );
      })}
    </ScrollView>
  );
}

export default function App() {
  const [config, setConfig] = useState<AppConfig>(INITIAL_CONFIG);
  const [stack, setStack] = useState<ScreenKey[]>([]);

  const push = (screen: ScreenKey) => {
    setStack(prev => [...prev, screen]);
  };

  const pop = () => {
    setStack(prev => prev.slice(0, -1));
  };

  return (
    <BackgroundTestContext.Provider
      value={{
        config,
        setConfig,
        applyPreset: newConfig => setConfig(newConfig),
      }}>
      <ScreenStack
        style={{ flex: 1 }}
        nativeContainerStyle={{ backgroundColor: config.containerBackground }}>
        <Screen activityState={2} isNativeStack>
          <ScreenStackHeaderConfig title="Config" />
          <ConfigScreenContent onPush={push} />
        </Screen>
        {stack.map((screenKey, index) => (
          <Screen key={`${screenKey}-${index}`} activityState={2} isNativeStack>
            <ScreenStackHeaderConfig title={screenKey} />
            <TestScreenContent screenKey={screenKey} onPop={pop} />
          </Screen>
        ))}
      </ScreenStack>
    </BackgroundTestContext.Provider>
  );
}
