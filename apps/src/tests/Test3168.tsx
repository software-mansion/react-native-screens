import {
  NavigationContainer,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React, {
  createContext,
  ReactNode,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
import { SearchBarPlacement, SearchBarProps } from 'react-native-screens';
import { ListItem, SettingsPicker, SettingsSwitch } from '../shared';
import { CenteredLayoutView } from '../shared/CenteredLayoutView';
import {
  BottomTabsContainer,
  TabConfiguration,
} from '../shared/gamma/containers/bottom-tabs/BottomTabsContainer';
import ConfigWrapperContext, {
  Configuration,
  DEFAULT_GLOBAL_CONFIGURATION,
} from '../shared/gamma/containers/bottom-tabs/ConfigWrapperContext';

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type SearchBarConfig = {
  placement: SearchBarProps['placement'];
  allowToolbarIntegration: boolean;
  useSystemItem: boolean;
};

const defaultSearchBarConfig: SearchBarConfig = {
  placement: 'integrated',
  allowToolbarIntegration: true,
  useSystemItem: true,
};

const SearchBarConfigContext = createContext({
  searchBarConfig: defaultSearchBarConfig,
  setSearchBarConfig: (_: SearchBarConfig) => {},
});

export function useSearchBarConfig() {
  return useContext(SearchBarConfigContext);
}

export const SearchBarConfigProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [searchBarConfig, setSearchBarConfig] = useState(
    defaultSearchBarConfig,
  );

  return (
    <SearchBarConfigContext.Provider
      value={{ searchBarConfig, setSearchBarConfig }}>
      {children}
    </SearchBarConfigContext.Provider>
  );
};

type MainRouteParamList = {
  Home: undefined;
  Stack: undefined;
  StackAndTabs: undefined;
};

type MainStackNavigationProp = NavigationProp<MainRouteParamList>;

const MainStack = createNativeStackNavigator<MainRouteParamList>();

function Home({ navigation }: MainStackNavigationProp) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
      }}>
      <Text>Test Search Bar placement</Text>
      <Button title="Stack only" onPress={() => navigation.push('Stack')} />
      <Button
        title="Bottom Tabs and Stack"
        onPress={() => navigation.push('StackAndTabs')}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <SearchBarConfigProvider>
        <MainStack.Navigator>
          <MainStack.Screen name="Home" component={Home} />
          <MainStack.Screen
            name="Stack"
            component={ExamplesStackComponent}
            options={{ headerShown: false }}
          />
          <MainStack.Screen
            name="StackAndTabs"
            component={TabsStackComponent}
            options={{ headerShown: false }}
          />
        </MainStack.Navigator>
      </SearchBarConfigProvider>
    </NavigationContainer>
  );
}

type ExamplesRouteParamList = {
  Menu: undefined;
  Test: undefined;
};

type ExamplesStackNavigationProp = NavigationProp<ExamplesRouteParamList>;

const ExamplesStack = createNativeStackNavigator<ExamplesRouteParamList>();

function ExamplesStackComponent({ showMenu = true }: { showMenu?: boolean }) {
  return (
    <ExamplesStack.Navigator>
      {showMenu && <ExamplesStack.Screen name="Menu" component={Menu} />}
      <ExamplesStack.Screen
        name="Test"
        component={Test}
        options={{
          headerLargeTitle: true,
          headerTransparent: true,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
    </ExamplesStack.Navigator>
  );
}

function Test({ navigation }: ExamplesStackNavigationProp) {
  const [search, setSearch] = useState('');
  const { searchBarConfig } = useSearchBarConfig();

  const places = [
    '🏝️ Desert Island',
    '🏞️ National Park',
    '⛰️ Mountain',
    '🏰 Castle',
    '🗽 Statue of Liberty',
    '🌉 Bridge at Night',
    '🏦 Bank',
    '🏛️ Classical Building',
    '🏟️ Stadium',
    '🏪 Convenience Store',
    '🏫 School',
    '⛲ Fountain',
    '🌄 Sunrise Over Mountains',
    '🌆 Cityscape at Dusk',
    '🎡 Ferris Wheel',
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placement: searchBarConfig.placement ?? 'automatic',
        allowToolbarIntegration: searchBarConfig.allowToolbarIntegration,
        onChangeText: event => setSearch(event.nativeEvent.text),
      },
    });
  }, [navigation, search, searchBarConfig]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag">
      {places
        .filter(item => item.toLowerCase().indexOf(search.toLowerCase()) !== -1)
        .map(place => (
          <ListItem
            key={place}
            title={place}
            onPress={() => navigation.goBack()}
          />
        ))}
    </ScrollView>
  );
}

function TabsStackComponent() {
  const [config, setConfig] = React.useState<Configuration>(
    DEFAULT_GLOBAL_CONFIGURATION,
  );
  const { searchBarConfig } = useSearchBarConfig();

  const TAB_CONFIGS: TabConfiguration[] = [
    {
      tabScreenProps: {
        tabKey: 'main',
        title: 'Main',
        icon: {
          ios: {
            type: 'sfSymbol',
            name: 'house',
          },
        },
      },
      component: () => Menu({ tabsMode: true }),
    },
    {
      tabScreenProps: {
        tabKey: 'another',
        title: 'Another',
        icon: {
          ios: {
            type: 'sfSymbol',
            name: 'ellipsis',
          },
        },
      },
      component: AnotherTab,
    },
    {
      tabScreenProps: {
        tabKey: 'examples',
        title: 'Search',
        icon: {
          ios: {
            type: 'sfSymbol',
            name: 'magnifyingglass',
          },
        },
        systemItem: searchBarConfig.useSystemItem ? 'search' : undefined,
      },
      component: () => ExamplesStackComponent({ showMenu: false }),
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

function AnotherTab() {
  return (
    <CenteredLayoutView>
      <Text>Another tab</Text>
    </CenteredLayoutView>
  );
}

function Menu({ tabsMode = false }: { tabsMode?: boolean }) {
  const { searchBarConfig, setSearchBarConfig } = useSearchBarConfig();
  const navigation = useNavigation<ExamplesStackNavigationProp['navigation']>();

  return (
    <CenteredLayoutView>
      <SettingsSwitch
        label="allowToolbarIntegration"
        value={searchBarConfig.allowToolbarIntegration}
        onValueChange={value =>
          setSearchBarConfig({
            ...searchBarConfig,
            allowToolbarIntegration: value,
          })
        }
      />
      <SettingsPicker<SearchBarPlacement>
        label="placement"
        value={searchBarConfig.placement ?? 'automatic'}
        onValueChange={value =>
          setSearchBarConfig({
            ...searchBarConfig,
            placement: value,
          })
        }
        items={[
          'automatic',
          'inline',
          'stacked',
          'integrated',
          'integratedButton',
          'integratedCentered',
        ]}
      />
      {tabsMode && (
        <SettingsSwitch
          label="use systemItem"
          value={searchBarConfig.useSystemItem}
          onValueChange={value =>
            setSearchBarConfig({
              ...searchBarConfig,
              useSystemItem: value,
            })
          }
        />
      )}
      {!tabsMode && (
        <Button title="Go to screen" onPress={() => navigation.push('Test')} />
      )}
    </CenteredLayoutView>
  );
}
