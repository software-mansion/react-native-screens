import React, { useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  NavigationContainer,
  NavigationIndependentTree,
  ParamListBase,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { ListItem, SettingsPicker, SettingsSwitch } from '@apps/shared';
import {
  TabsContainerWithHostConfigContext,
  useTabsHostConfig,
  useTabsNavigationContext,
  type TabRouteConfig,
} from '@apps/shared/containers/tabs';
import { Colors } from '@apps/shared/styling';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';

// The search tab hosts a legacy (v4) native stack - v5 stack does not integrate
// the search bar into the header yet, and UISearchTab activation on iOS 26.1+
// works with the search controller mirrored from the nested stack's header.

type SearchStackParamList = {
  List: undefined;
  Details: { place: string };
};

type SearchStackNavigationProp = NativeStackNavigationProp<
  SearchStackParamList & ParamListBase
>;

const SearchStack = createNativeStackNavigator<SearchStackParamList>();

const PLACES = [
  '🏝️ Desert Island',
  '🏞️ National Park',
  '⛰️ Mountain',
  '🏰 Castle',
  '🗽 Statue of Liberty',
  '🌉 Bridge at Night',
  '🏛️ Classical Building',
  '🏟️ Stadium',
  '🏫 School',
  '⛲ Fountain',
  '🌄 Sunrise Over Mountains',
  '🎡 Ferris Wheel',
];

// `none` clears the prop; the remaining values are the screen keys of the tabs below.
type ProminentTabOption = 'none' | 'Config' | 'Cart' | 'Search';

const PROMINENT_TAB_OPTIONS: ProminentTabOption[] = [
  'none',
  'Config',
  'Cart',
  'Search',
];

function SearchListScreen({
  navigation,
}: {
  navigation: SearchStackNavigationProp;
}) {
  const [search, setSearch] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        onChangeText: event => setSearch(event.nativeEvent.text),
      },
    });
  }, [navigation]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag">
      {PLACES.filter(
        item => item.toLowerCase().indexOf(search.toLowerCase()) !== -1,
      ).map(place => (
        <ListItem
          key={place}
          title={place}
          onPress={() => navigation.push('Details', { place })}
        />
      ))}
    </ScrollView>
  );
}

function SearchDetailsScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Details</Text>
      <Text style={styles.hint}>
        Go back with the back gesture, switch to the Config tab,{'\n'}then
        reselect the search tab - the prominent treatment must{'\n'}stay on the
        tab picked in the Config tab.
      </Text>
    </View>
  );
}

function SearchStackTab() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen
        name="List"
        component={SearchListScreen}
        options={{ headerLargeTitle: true }}
      />
      <SearchStack.Screen name="Details" component={SearchDetailsScreen} />
    </SearchStack.Navigator>
  );
}

const CART_ROWS = Array.from({ length: 40 }, (_, i) => `Cart row ${i + 1}`);

function CartTab() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      {CART_ROWS.map(row => (
        <ListItem key={row} title={row} onPress={() => {}} />
      ))}
    </ScrollView>
  );
}

function ConfigTab() {
  const { hostConfig, updateHostConfig } = useTabsHostConfig();
  const { setRouteOptions } = useTabsNavigationContext();
  const [automaticallyActivatesSearch, setAutomaticallyActivatesSearch] =
    useState(true);

  const prominentTabScreenKey = hostConfig.ios?.prominentTabScreenKey;

  const onProminentTabScreenKeyChange = (value: ProminentTabOption) => {
    updateHostConfig({
      ios: { prominentTabScreenKey: value === 'none' ? '' : value },
    });
  };

  const onAutomaticallyActivatesSearchChange = (value: boolean) => {
    setAutomaticallyActivatesSearch(value);
    // Options set at mount are snapshotted by the container - runtime changes
    // must go through setRouteOptions. `ios` is replaced wholesale, so repeat
    // the full search tab config here.
    setRouteOptions('Search', {
      ios: {
        systemItem: 'search',
        searchRole: true,
        automaticallyActivatesSearch: value,
      },
    });
  };

  return (
    <ScrollView
      style={styles.fillParent}
      contentContainerStyle={styles.configContent}
      contentInsetAdjustmentBehavior="automatic">
      <Text style={styles.label}>Prominent Tab Screen Key</Text>
      <SettingsPicker<ProminentTabOption>
        testID="prominent-tab-screen-key-picker"
        label="prominentTabScreenKey"
        value={(prominentTabScreenKey as ProminentTabOption) || 'none'}
        onValueChange={onProminentTabScreenKeyChange}
        items={PROMINENT_TAB_OPTIONS}
      />
      <SettingsSwitch
        label="automaticallyActivatesSearch"
        value={automaticallyActivatesSearch}
        onValueChange={onAutomaticallyActivatesSearchChange}
      />
      <Text style={styles.hint}>
        iOS 27+: the picked tab receives the prominent (detached){'\n'}treatment
        and stays visible once the tab bar minimizes.
        {'\n'}
        {'\n'}
        With `none`, the search tab is prominent by default only{'\n'}while
        automaticallyActivatesSearch is on.
        {'\n'}
        {'\n'}
        With the switch off, the search tab behaves like{'\n'}a regular tab.
        {'\n'}
        {'\n'}
        Below iOS 27 only a warning is logged.
      </Text>
    </ScrollView>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Config',
    element: <ConfigTab />,
    options: {
      title: 'Config',
      tabBarItemTestID: 'config-tab-item',
      ios: {
        icon: { type: 'sfSymbol', name: 'gear' },
      },
    },
  },
  {
    name: 'Cart',
    element: <CartTab />,
    options: {
      title: 'Cart',
      tabBarItemTestID: 'cart-tab-item',
      ios: {
        icon: { type: 'sfSymbol', name: 'cart' },
      },
    },
  },
  {
    name: 'Search',
    element: <SearchStackTab />,
    options: {
      tabBarItemTestID: 'search-tab-item',
      ios: {
        systemItem: 'search',
        searchRole: true,
        automaticallyActivatesSearch: true,
      },
    },
  },
];

function TestTabsProminentTabIdentifier() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <TabsContainerWithHostConfigContext
          routeConfigs={ROUTE_CONFIGS}
          // The prominent tab stays visible once the tab bar minimizes.
          ios={{ tabBarMinimizeBehavior: 'onScrollDown' }}
        />
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

const styles = StyleSheet.create({
  fillParent: {
    flex: 1,
  },
  configContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  hint: {
    fontSize: 13,
    color: Colors.LightOffNavy,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default createScenario(
  TestTabsProminentTabIdentifier,
  scenarioDescription,
);
