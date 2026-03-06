import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
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
import LongText from '../../shared/LongText';
import {
  ScreenStack,
  ScreenStackHeaderSearchBarView,
  ScreenStackItem,
  SearchBar,
  SearchBarPlacement,
  StackPresentationTypes,
} from 'react-native-screens';
import Colors from '../../shared/styling/Colors';
import { SettingsPicker, SettingsSwitch } from '../../shared';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import ConfigWrapperContext, {
  Configuration,
  DEFAULT_GLOBAL_CONFIGURATION,
} from '../../shared/gamma/containers/bottom-tabs/ConfigWrapperContext';
import {
  BottomTabsContainer,
  TabConfiguration,
} from '../../shared/gamma/containers/bottom-tabs/BottomTabsContainer';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { useHeaderHeight } from '@react-navigation/elements';

interface ScreensNavigationProps {
  push?: () => void;
  pop?: () => void;
}

type NavigationProps =
  | {
      type: 'SCREENS';
      props: ScreensNavigationProps;
    }
  | {
      type: 'REACT_NAVIGATION';
      props: StackNavigationProp;
    };

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
  headerHeightApi: 'react-native-screens' | 'react-navigation';
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

function HeaderHeightInfoComponent({
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

function ConfigScreen(props: NavigationProps) {
  const push =
    props.type === 'SCREENS'
      ? props.props.push
      : () => props.props.navigation.push('TestScreen');
  const { config, setConfig } = useConfigContext();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 5 }}>
      <Text style={styles.title}>API configuration</Text>
      <SettingsPicker<Config['headerHeightApi']>
        label="headerHeightApi"
        value={config.headerHeightApi}
        onValueChange={value =>
          setConfig({
            ...config,
            headerHeightApi: value,
          })
        }
        items={['react-native-screens', 'react-navigation']}
      />
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
      <Button title="Push screen" onPress={() => push?.()} />
    </ScrollView>
  );
}

function ReactNavigationTestScreenWrapper(props: NavigationProps) {
  const { config, setConfig } = useConfigContext();
  const height = useHeaderHeight();
  useEffect(() => {
    if (config.headerHeight !== height) {
      console.log(`[HeaderHeight][react-navigation] ${height}`);
      setConfig(prev => ({ ...prev, headerHeight: height }));
    }
  }, [config.headerHeight, height, setConfig]);

  return <TestScreen {...props} />;
}

function TestScreen(props: NavigationProps) {
  const pop =
    props.type === 'SCREENS'
      ? props.props.pop
      : () => props.props.navigation.pop();
  const { config, setConfig } = useConfigContext();

  const topContent = (
    <>
      <LongText size="xs" />
      <Button
        onPress={() => {
          pop?.();
          setConfig(prev => ({ ...prev, headerHeight: -1000 }));
        }}
        title="Back to config"
      />
      {config.presentation !== 'push' && (
        <HeaderHeightInfoComponent positionAbsolute={false} />
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
          <ConfigScreen {...props} />
        </>
      );
  }
}

function ReactNativeScreensNavigation() {
  const { config, setConfig } = useConfigContext();
  const [showTestScreen, setShowTestScreen] = useState(false);

  const props: NavigationProps = {
    type: 'SCREENS',
    props: {
      push: () => setShowTestScreen(true),
      pop: () => setShowTestScreen(false),
    },
  };

  return (
    <>
      <ScreenStack style={{ flex: 1 }}>
        <ScreenStackItem
          screenId="config"
          headerConfig={{
            hidden: true,
          }}>
          <ConfigScreen {...props} />
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
              console.log(
                `[HeaderHeight][react-native-screens] ${e.nativeEvent.headerHeight}`,
              );
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
            <TestScreen {...props} />
          </ScreenStackItem>
        )}
      </ScreenStack>
      {showTestScreen && config.presentation === 'push' && (
        <HeaderHeightInfoComponent />
      )}
    </>
  );
}

type RouteParamList = {
  ConfigScreen: undefined;
  TestScreen: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<RouteParamList>;

const Stack = createNativeStackNavigator<RouteParamList>();

const ConfigScreenComponent = (props: StackNavigationProp) => (
  <ConfigScreen {...{ type: 'REACT_NAVIGATION', props }} />
);

const TestScreenComponent = (props: StackNavigationProp) => (
  <ReactNavigationTestScreenWrapper {...{ type: 'REACT_NAVIGATION', props }} />
);

function ReactNavigationNavigation() {
  const { config } = useConfigContext();

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="ConfigScreen"
          component={ConfigScreenComponent}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TestScreen"
          component={TestScreenComponent}
          options={{
            headerBackVisible: false,
            headerTransparent: config.headerTransparent,
            headerLargeTitle: config.headerLargeTitle,
            headerShown: config.headerShown,
            presentation:
              config.presentation === 'push' ? 'card' : config.presentation,
            headerSearchBarOptions:
              config.searchBarPlacement !== 'disabled'
                ? {
                    placement: config.searchBarPlacement,
                    hideNavigationBar: config.searchBarHideNavigationBar,
                    hideWhenScrolling: config.searchBarHideWhenScrolling,
                  }
                : undefined,
          }}
        />
      </Stack.Navigator>
      <HeaderHeightInfoComponent />
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
    headerHeightApi: 'react-native-screens',
  });

  return (
    <NavigationContainer>
      <ConfigContext.Provider value={{ config, setConfig }}>
        {config.headerHeightApi === 'react-native-screens' ? (
          <ReactNativeScreensNavigation />
        ) : (
          <ReactNavigationNavigation />
        )}
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
        ios: {
          icon: {
            type: 'sfSymbol',
            name: 'sun.max',
          },
        },
        android: {
          icon: {
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
        ios: {
          icon: {
            type: 'sfSymbol',
            name: 'snow',
          },
        },
        android: {
          icon: {
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
