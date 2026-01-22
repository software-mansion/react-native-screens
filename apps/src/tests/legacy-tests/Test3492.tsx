import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import {
  BottomTabsContainer,
  type TabConfiguration,
} from '../../shared/gamma/containers/bottom-tabs/BottomTabsContainer';
import Colors from '../../shared/styling/Colors';
import ConfigWrapperContext, {
  Configuration,
  DEFAULT_GLOBAL_CONFIGURATION,
} from '../../shared/gamma/containers/bottom-tabs/ConfigWrapperContext';
import LongText from '../../shared/LongText';
import { someExtensiveComputation } from './TestBottomTabs/utils';

type TabKey = 'Tab2' | 'Tab3' | 'Tab4';

type ContentType = 'view' | 'scrollViewWithText' | 'scrollViewWithRects';

type RectConfig = {
  height: number;
  gap: number;
};

type SingleTabConfig = {
  navBackground: string;
  reactBackground: string;
  isHeavy: 'true' | 'false';
  contentType: ContentType;
  rectConfig: RectConfig;
};

type AppConfig = {
  containerBackground: string;
  tabs: Record<TabKey, SingleTabConfig>;
};

type BackgroundContextType = {
  config: AppConfig;
  setConfig: Dispatch<SetStateAction<AppConfig>>;
  applyPreset: (preset: AppConfig) => void;
};

const DEFAULT_RECT_CONFIG: RectConfig = {
  height: 100,
  gap: 20,
};

const DEFAULT_TAB_CONFIG: SingleTabConfig = {
  navBackground: Colors.White,
  reactBackground: 'transparent',
  isHeavy: 'false',
  contentType: 'view',
  rectConfig: DEFAULT_RECT_CONFIG,
};

const INITIAL_CONFIG: AppConfig = {
  containerBackground: Colors.White,
  tabs: {
    Tab2: { ...DEFAULT_TAB_CONFIG, contentType: 'view' },
    Tab3: { ...DEFAULT_TAB_CONFIG, contentType: 'scrollViewWithText' },
    Tab4: { ...DEFAULT_TAB_CONFIG, contentType: 'scrollViewWithRects' },
  },
};

const PRESETS: Record<string, AppConfig> = {
  Default: INITIAL_CONFIG,
  ColorfulTab: {
    containerBackground: Colors.White,
    tabs: {
      Tab2: {
        ...DEFAULT_TAB_CONFIG,
        contentType: 'view',
        navBackground: Colors.PurpleLight40,
        reactBackground: 'transparent',
      },
      Tab3: {
        ...DEFAULT_TAB_CONFIG,
        contentType: 'scrollViewWithText',
        navBackground: Colors.BlueLight40,
        reactBackground: 'transparent',
      },
      Tab4: {
        ...DEFAULT_TAB_CONFIG,
        contentType: 'scrollViewWithRects',
        navBackground: Colors.NavyDark140,
        reactBackground: 'transparent',
        rectConfig: { height: 80, gap: 15 },
      },
    },
  },
  ColorfulReact: {
    containerBackground: Colors.White,
    tabs: {
      Tab2: {
        ...DEFAULT_TAB_CONFIG,
        contentType: 'view',
        navBackground: 'transparent',
        reactBackground: Colors.PurpleLight40,
      },
      Tab3: {
        ...DEFAULT_TAB_CONFIG,
        contentType: 'scrollViewWithText',
        navBackground: 'transparent',
        reactBackground: Colors.BlueLight40,
      },
      Tab4: {
        ...DEFAULT_TAB_CONFIG,
        contentType: 'scrollViewWithRects',
        navBackground: 'transparent',
        reactBackground: Colors.NavyDark140,
        rectConfig: { height: 80, gap: 15 },
      },
    },
  },
  ColorfulTabReact: {
    containerBackground: Colors.White,
    tabs: {
      Tab2: {
        ...DEFAULT_TAB_CONFIG,
        contentType: 'view',
        navBackground: Colors.White,
        reactBackground: Colors.PurpleLight40,
      },
      Tab3: {
        ...DEFAULT_TAB_CONFIG,
        contentType: 'scrollViewWithText',
        navBackground: Colors.White,
        reactBackground: Colors.BlueLight40,
      },
      Tab4: {
        ...DEFAULT_TAB_CONFIG,
        contentType: 'scrollViewWithRects',
        navBackground: Colors.White,
        reactBackground: Colors.NavyDark140,
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

const TestScreenRenderer = ({ tabKey }: { tabKey: TabKey }) => {
  const { config } = useBackgroundTestContext();
  const tabConfig = config.tabs[tabKey];

  const Container = tabConfig.contentType === 'view' ? View : ScrollView;

  if (tabConfig.isHeavy === 'true') {
    someExtensiveComputation();
  }

  return (
    <Container
      style={{ flex: 1, backgroundColor: tabConfig.reactBackground }}
      contentContainerStyle={
        tabConfig.contentType !== 'view' ? { flexGrow: 1 } : undefined
      }>
      {tabConfig.contentType === 'view' && (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
            Hello {tabKey}
          </Text>
          <Text>Bg: {tabConfig.reactBackground}</Text>
        </View>
      )}

      {tabConfig.contentType === 'scrollViewWithText' && <LongText size="xl" />}

      {tabConfig.contentType === 'scrollViewWithRects' && (
        <RectsGenerator config={tabConfig.rectConfig} />
      )}
    </Container>
  );
};

function ConfigScreen() {
  const { config, setConfig, applyPreset } = useBackgroundTestContext();

  const updateTab = (key: TabKey, update: Partial<SingleTabConfig>) => {
    setConfig(prev => ({
      ...prev,
      tabs: {
        ...prev.tabs,
        [key]: { ...prev.tabs[key], ...update },
      },
    }));
  };

  const updateRects = (key: TabKey, update: Partial<RectConfig>) => {
    setConfig(prev => ({
      ...prev,
      tabs: {
        ...prev.tabs,
        [key]: {
          ...prev.tabs[key],
          rectConfig: { ...prev.tabs[key].rectConfig, ...update },
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
        paddingTop: 60,
        paddingBottom: 100,
      }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Background Tester
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

      <ConfigSection title="Global Container">
        <SimplePicker
          type="color"
          label="Native Container Style BG"
          value={config.containerBackground}
          options={colors}
          onChange={(c: string) =>
            setConfig(p => ({ ...p, containerBackground: c }))
          }
        />
      </ConfigSection>

      {(Object.keys(config.tabs) as TabKey[]).map(key => {
        const tConfig = config.tabs[key];
        return (
          <ConfigSection key={key} title={`Config: ${key}`}>
            <SimplePicker
              type="color"
              label="Tab Props Style BG"
              value={tConfig.navBackground}
              options={colors}
              onChange={(c: string) => updateTab(key, { navBackground: c })}
            />
            <SimplePicker
              type="color"
              label="React View BG"
              value={tConfig.reactBackground}
              options={colors}
              onChange={(c: string) => updateTab(key, { reactBackground: c })}
            />
            <SimplePicker
              label="Heavy Render"
              value={String(tConfig.isHeavy)}
              options={['true', 'false']}
              onChange={(c: string) =>
                updateTab(key, { isHeavy: c === 'true' ? 'true' : 'false' })
              }
            />
            <SimplePicker
              label="Content Type"
              value={tConfig.contentType}
              options={contentTypes}
              onChange={(c: any) => updateTab(key, { contentType: c })}
            />
            {tConfig.contentType === 'scrollViewWithRects' && (
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
                  value={String(tConfig.rectConfig.height)}
                  options={['50', '100', '200']}
                  onChange={(v: string) =>
                    updateRects(key, { height: parseFloat(v) })
                  }
                />
                <SimplePicker
                  label="Gap Size"
                  value={String(tConfig.rectConfig.gap)}
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

function ScreenTab2() {
  return <TestScreenRenderer tabKey="Tab2" />;
}
function ScreenTab3() {
  return <TestScreenRenderer tabKey="Tab3" />;
}
function ScreenTab4() {
  return <TestScreenRenderer tabKey="Tab4" />;
}

function Tabs() {
  const [tabsConfig, setTabsConfig] = React.useState<Configuration>(
    DEFAULT_GLOBAL_CONFIGURATION,
  );
  const { config } = useBackgroundTestContext();

  const dynamicTabConfigs = useMemo<TabConfiguration[]>(
    () => [
      {
        tabScreenProps: {
          tabKey: 'Tab1',
          title: 'Config',
          icon: {
            ios: { type: 'sfSymbol', name: 'gear' },
          },
          style: { backgroundColor: Colors.White },
        },
        component: ConfigScreen,
      },
      {
        tabScreenProps: {
          tabKey: 'Tab2',
          title: 'Tab 2',
          icon: { ios: { type: 'sfSymbol', name: 'square' } },
          style: { backgroundColor: config.tabs.Tab2.navBackground },
        },
        component: ScreenTab2,
      },
      {
        tabScreenProps: {
          tabKey: 'Tab3',
          title: 'Tab 3',
          icon: { ios: { type: 'sfSymbol', name: 'triangle' } },
          style: { backgroundColor: config.tabs.Tab3.navBackground },
        },
        component: ScreenTab3,
      },
      {
        tabScreenProps: {
          tabKey: 'Tab4',
          title: 'Tab 4',
          icon: { ios: { type: 'sfSymbol', name: 'circle' } },
          style: { backgroundColor: config.tabs.Tab4.navBackground },
        },
        component: ScreenTab4,
      },
    ],
    [config],
  );

  return (
    <ConfigWrapperContext.Provider
      value={{
        config: tabsConfig,
        setConfig: setTabsConfig,
      }}>
      <BottomTabsContainer
        tabConfigs={dynamicTabConfigs}
        nativeContainerStyle={{ backgroundColor: config.containerBackground }}
      />
    </ConfigWrapperContext.Provider>
  );
}

function App() {
  const [config, setConfig] = useState<AppConfig>(INITIAL_CONFIG);

  return (
    <NavigationContainer>
      <BackgroundTestContext.Provider
        value={{
          config,
          setConfig,
          applyPreset: newConfig => setConfig(newConfig),
        }}>
        <Tabs />
      </BackgroundTestContext.Provider>
    </NavigationContainer>
  );
}

export default App;
