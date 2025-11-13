import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import {
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LongText from '../shared/LongText';
import {
  ScreenStack,
  ScreenStackHeaderSearchBarView,
  ScreenStackItem,
  SearchBar,
  SearchBarPlacement,
  StackPresentationTypes,
} from 'react-native-screens';
import Colors from '../shared/styling/Colors';
import { SettingsPicker, SettingsSwitch } from '../shared';
import { NavigationContainer } from '@react-navigation/native';
import ConfigWrapperContext, {
  Configuration,
  DEFAULT_GLOBAL_CONFIGURATION,
} from '../shared/gamma/containers/bottom-tabs/ConfigWrapperContext';
import {
  BottomTabsContainer,
  TabConfiguration,
} from '../shared/gamma/containers/bottom-tabs/BottomTabsContainer';

interface NavigationProps {
  setShowTestScreen: Dispatch<SetStateAction<boolean>>;
}

interface Config {
  headerTransparent: boolean;
  headerLargeTitle: boolean;
  headerShown: boolean;
  presentation: StackPresentationTypes;
  searchBarPlacement: 'disabled' | SearchBarPlacement;
  searchBarHideNavigationBar: boolean;
  searchBarHideWhenScrolling: boolean;
  content: 'regularView' | 'scrollView' | 'config';
  headerHeight: number;
}

export interface ConfigContextInterface {
  config: Config;
  setConfig: Dispatch<SetStateAction<Config>>;
}

export const ConfigContext = createContext<ConfigContextInterface | null>(null);

export const useConfigContext = () => {
  const ctx = useContext(ConfigContext);

  if (!ctx) {
    throw new Error(
      'useConfigContext has to be used within <ConfigContext.Provider>',
    );
  }

  return ctx;
};

function HeaderHeightInfo({
  positionAbsolute = true,
}: {
  positionAbsolute?: boolean;
}) {
  const { config } = useConfigContext();
  return (
    <View
      style={[
        {
          width: 60,
          height: 60,
          minHeight: 60,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#D4EEE8CC',
        },
        positionAbsolute
          ? { position: 'absolute', top: config.headerHeight, right: 10 }
          : undefined,
      ]}>
      <Text style={{ fontSize: 20 }}>{config.headerHeight.toFixed(1)}</Text>
    </View>
  );
}

function ConfigScreen({ setShowTestScreen }: NavigationProps) {
  const { config, setConfig } = useConfigContext();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 5 }}>
      <Text style={styles.title}>Stack configuration</Text>
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
      <SettingsSwitch
        label="headerShown"
        value={config.headerShown}
        onValueChange={value => setConfig({ ...config, headerShown: value })}
      />
      <SettingsPicker<Config['presentation']>
        label="presentation"
        value={config.presentation}
        onValueChange={value =>
          setConfig({
            ...config,
            presentation: value,
          })
        }
        items={[
          'push',
          'modal',
          'transparentModal',
          'containedModal',
          'containedTransparentModal',
          'fullScreenModal',
          'formSheet',
          'pageSheet',
        ]}
      />
      <Text style={styles.title}>Search bar configuration</Text>
      <SettingsPicker<Config['searchBarPlacement']>
        label="searchBarPlacement"
        value={config.searchBarPlacement}
        onValueChange={value =>
          setConfig({
            ...config,
            searchBarPlacement: value,
          })
        }
        items={[
          'disabled',
          'automatic',
          'inline',
          'stacked',
          'integrated',
          'integratedButton',
          'integratedCentered',
        ]}
      />
      <SettingsSwitch
        label="searchBarHideNavigationBar"
        value={config.searchBarHideNavigationBar}
        onValueChange={value =>
          setConfig({ ...config, searchBarHideNavigationBar: value })
        }
      />
      <SettingsSwitch
        label="searchBarHideWhenScrolling"
        value={config.searchBarHideWhenScrolling}
        onValueChange={value =>
          setConfig({ ...config, searchBarHideWhenScrolling: value })
        }
      />
      <Text style={styles.title}>Content configuration</Text>
      <SettingsPicker<Config['content']>
        label="content"
        value={config.content}
        onValueChange={value =>
          setConfig({
            ...config,
            content: value,
          })
        }
        items={['regularView', 'scrollView', 'config']}
      />
      <Button title="Push screen" onPress={() => setShowTestScreen(true)} />
    </ScrollView>
  );
}

function TestScreen({ setShowTestScreen }: NavigationProps) {
  const { config } = useConfigContext();

  const topContent = (
    <>
      <LongText size="xs" />
      <Button onPress={() => setShowTestScreen(false)} title="Back to config" />
      {config.presentation !== 'push' && (
        <HeaderHeightInfo positionAbsolute={false} />
      )}
    </>
  );

  switch (config.content) {
    case 'regularView':
      return <View>{topContent}</View>;
    case 'scrollView':
      return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          {topContent}
          <LongText size="lg" />
        </ScrollView>
      );
    case 'config':
      return (
        <>
          {topContent}
          <ConfigScreen setShowTestScreen={setShowTestScreen} />
        </>
      );
  }
}

function Navigation() {
  const { config, setConfig } = useConfigContext();
  const [showTestScreen, setShowTestScreen] = useState(false);

  return (
    <>
      <ScreenStack style={{ flex: 1 }}>
        <ScreenStackItem
          screenId="config"
          headerConfig={{
            hidden: true,
          }}>
          <ConfigScreen setShowTestScreen={setShowTestScreen} />
        </ScreenStackItem>
        {showTestScreen && (
          <ScreenStackItem
            screenId="test"
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: Colors.cardBackground,
              },
            ]}
            activityState={2}
            onHeaderHeightChange={e => {
              console.log(`[HeaderHeight] ${e.nativeEvent.headerHeight}`);
              setConfig({
                ...config,
                headerHeight: e.nativeEvent.headerHeight,
              });
            }}
            gestureEnabled={false}
            // mirrors react-navigation logic
            stackPresentation={config.presentation}
            headerConfig={{
              hidden: config.headerShown === false,
              translucent:
                config.headerTransparent ||
                ((config.searchBarPlacement !== 'disabled' ||
                  config.headerLargeTitle) &&
                  Platform.OS === 'ios' &&
                  config.headerTransparent !== false),
              largeTitle: config.headerLargeTitle,
              title: 'Test Screen',
              hideBackButton: true,
              backgroundColor: config.headerTransparent
                ? 'transparent'
                : Colors.cardBackground,
              children:
                config.searchBarPlacement !== 'disabled' ? (
                  <ScreenStackHeaderSearchBarView>
                    <SearchBar
                      placement={config.searchBarPlacement}
                      hideNavigationBar={config.searchBarHideNavigationBar}
                      hideWhenScrolling={config.searchBarHideWhenScrolling}
                    />
                  </ScreenStackHeaderSearchBarView>
                ) : undefined,
            }}>
            <TestScreen setShowTestScreen={setShowTestScreen} />
          </ScreenStackItem>
        )}
      </ScreenStack>
      {showTestScreen && config.presentation === 'push' && <HeaderHeightInfo />}
    </>
  );
}

function HeaderHeightTest() {
  const [config, setConfig] = useState<Config>({
    headerTransparent: false,
    headerLargeTitle: false,
    headerShown: true,
    presentation: 'push',
    searchBarPlacement: 'disabled',
    searchBarHideNavigationBar: true,
    searchBarHideWhenScrolling: true,
    content: 'regularView',
    headerHeight: 0,
  });

  return (
    <NavigationContainer>
      <ConfigContext.Provider value={{ config, setConfig }}>
        <Navigation />
      </ConfigContext.Provider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});

function HeaderHeightTabsWrapper() {
  const [config, setConfig] = React.useState<Configuration>(
    DEFAULT_GLOBAL_CONFIGURATION,
  );

  const TAB_CONFIGS: TabConfiguration[] = [
    {
      tabScreenProps: {
        tabKey: 'Tab1',
        title: 'Tab 1',
        icon: {
          ios: {
            type: 'sfSymbol',
            name: 'sun.max',
          },
          android: {
            type: 'drawableResource',
            name: 'sunny',
          },
        },
      },
      component: HeaderHeightTest,
    },
    {
      tabScreenProps: {
        tabKey: 'Tab2',
        title: 'Tab 2',
        icon: {
          ios: {
            type: 'sfSymbol',
            name: 'snow',
          },
          android: {
            type: 'drawableResource',
            name: 'mode_cool',
          },
        },
      },
      component: HeaderHeightTest,
    },
  ];

  return (
    <ConfigWrapperContext.Provider
      value={{
        config,
        setConfig,
      }}>
      <BottomTabsContainer tabConfigs={TAB_CONFIGS} />
    </ConfigWrapperContext.Provider>
  );
}

export default function App() {
  return <HeaderHeightTest />;
  // return <HeaderHeightTabsWrapper />;
}
