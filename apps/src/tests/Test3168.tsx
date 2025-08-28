import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  NavigationContainer,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, ScrollView, Text, View } from 'react-native';
import { SearchBarPlacement, SearchBarProps } from 'react-native-screens';
import { ListItem, SettingsPicker, SettingsSwitch } from '../shared';
import ConfigWrapperContext, {
  Configuration,
  DEFAULT_GLOBAL_CONFIGURATION,
} from '../shared/gamma/containers/bottom-tabs/ConfigWrapperContext';
import {
  BottomTabsContainer,
  TabConfiguration,
} from '../shared/gamma/containers/bottom-tabs/BottomTabsContainer';
import { CenteredLayoutView } from '../shared/CenteredLayoutView';

type MainRouteParamList = {
  Home: undefined;
  Stack: undefined;
  StackAndTabs: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
  route: RouteProp<ParamList>;
};

type MainStackNavigationProp = NavigationProp<MainRouteParamList>;

const MainStack = createNativeStackNavigator<MainRouteParamList>();

const SEARCH_BAR_CONFIGURATIONS: Record<string, NativeStackNavigationOptions> =
  {
    AUTOMATIC: {
      headerSearchBarOptions: {
        placement: 'automatic',
      },
    },
    INLINE: {
      headerSearchBarOptions: {
        placement: 'inline',
      },
    },
    STACKED: {
      headerSearchBarOptions: {
        placement: 'stacked',
      },
    },
    INTEGRATED: {
      headerSearchBarOptions: {
        placement: 'integrated',
      },
    },
    INTEGRATED_BUTTON: {
      headerSearchBarOptions: {
        placement: 'integratedButton',
      },
    },
    INTEGRATED_CENTER: {
      headerSearchBarOptions: {
        placement: 'integratedCentered',
      },
    },
  };

type ExamplesRouteParamList = {
  Menu: undefined;
  Test: {
    headerSearchBarOptions: SearchBarProps | undefined;
    allowToolbarIntegration: boolean;
  };
};

type ExamplesStackNavigationProp = NavigationProp<ExamplesRouteParamList>;

const ExamplesStack = createNativeStackNavigator<ExamplesRouteParamList>();

function Menu({ navigation }: ExamplesStackNavigationProp) {
  const [allowToolbarIntegration, setAllowToolbarIntegration] = useState(true);
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
        gap: 10,
      }}>
      <SettingsSwitch
        label="allowToolbarIntegration"
        value={allowToolbarIntegration}
        onValueChange={value => setAllowToolbarIntegration(value)}
      />
      {Object.keys(SEARCH_BAR_CONFIGURATIONS).map(key => (
        <Button
          title={key}
          key={key}
          onPress={() =>
            navigation.push('Test', {
              headerSearchBarOptions:
                SEARCH_BAR_CONFIGURATIONS[key].headerSearchBarOptions,
              allowToolbarIntegration: allowToolbarIntegration,
            })
          }
        />
      ))}
    </ScrollView>
  );
}

function Test({ navigation, route }: ExamplesStackNavigationProp) {
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
        ...(route.params?.headerSearchBarOptions ??
          searchBarConfig.headerSearchBarOptions ?? {
            placement: 'integrated',
          }),
        allowToolbarIntegration:
          route.params?.allowToolbarIntegration ??
          searchBarConfig.allowToolbarIntegration ??
          true,
        onChangeText: event => setSearch(event.nativeEvent.text),
      },
    });
  }, [
    navigation,
    route.params?.allowToolbarIntegration,
    route.params?.headerSearchBarOptions,
    search,
    searchBarConfig.allowToolbarIntegration,
    searchBarConfig.headerSearchBarOptions,
  ]);

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

function AnotherTab() {
  return (
    <CenteredLayoutView>
      <Text>Another tab.</Text>
    </CenteredLayoutView>
  );
}

function MainTab() {
  const { setSearchBarConfig } = useSearchBarConfig();

  const [placement, setPlacement] = useState<SearchBarPlacement>('automatic');
  const [allowToolbarIntegration, setAllowToolbarIntegration] = useState(true);
  const [useSystemItem, setUseSystemItem] = useState(true);

  useEffect(() => {
    setSearchBarConfig({
      useSystemItem: useSystemItem,
      headerSearchBarOptions: {
        placement: placement,
      },
      allowToolbarIntegration: allowToolbarIntegration,
    });
  }, [placement, allowToolbarIntegration, setSearchBarConfig, useSystemItem]);

  return (
    <CenteredLayoutView>
      <SettingsSwitch
        label="allowToolbarIntegration"
        value={allowToolbarIntegration}
        onValueChange={value => setAllowToolbarIntegration(value)}
      />
      <SettingsPicker<SearchBarPlacement>
        label="placement"
        value={placement}
        onValueChange={value => setPlacement(value)}
        items={[
          'automatic',
          'inline',
          'stacked',
          'integrated',
          'integratedButton',
          'integratedCentered',
        ]}
      />
      <SettingsSwitch
        label="use systemItem"
        value={useSystemItem}
        onValueChange={value => setUseSystemItem(value)}
      />
    </CenteredLayoutView>
  );
}

type SearchBarConfig = {
  headerSearchBarOptions: SearchBarProps | undefined;
  allowToolbarIntegration: boolean;
  useSystemItem: boolean;
};

const defaultSearchBarConfig: SearchBarConfig = {
  headerSearchBarOptions: {
    placement: 'integrated',
  },
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

function TabsStackComponent() {
  const [config, setConfig] = React.useState<Configuration>(
    DEFAULT_GLOBAL_CONFIGURATION,
  );

  return (
    <ConfigWrapperContext.Provider
      value={{
        config,
        setConfig,
      }}>
      <SearchBarConfigProvider>
        <TabsStackComponentContent />
      </SearchBarConfigProvider>
    </ConfigWrapperContext.Provider>
  );
}

function TabsStackComponentContent() {
  const { searchBarConfig } = useSearchBarConfig();

  const TAB_CONFIGS: TabConfiguration[] = [
    {
      tabScreenProps: {
        tabKey: 'main',
        title: 'Main',
        icon: {
          sfSymbolName: 'house',
        },
      },
      component: MainTab,
    },
    {
      tabScreenProps: {
        tabKey: 'another',
        title: 'Another',
        icon: {
          sfSymbolName: 'ellipsis',
        },
      },
      component: AnotherTab,
    },
    {
      tabScreenProps: {
        tabKey: 'examples',
        title: 'Search',
        icon: {
          sfSymbolName: 'magnifyingglass',
        },
        systemItem: searchBarConfig.useSystemItem ? 'search' : undefined,
      },
      component: () => ExamplesStackComponent({ showMenu: false }),
    },
  ];
  return <BottomTabsContainer tabConfigs={TAB_CONFIGS} />;
}

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
    </NavigationContainer>
  );
}
