import React, { useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  NavigationContainer,
  NavigationIndependentTree,
  ParamListBase,
  type RouteProp,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { ListItem, SettingsSwitch } from '@apps/shared';
import {
  TabsContainer,
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

function SearchListScreen({
  navigation,
}: {
  navigation: SearchStackNavigationProp;
}) {
  const [search, setSearch] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Search places',
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

function SearchDetailsScreen({
  navigation,
  route,
}: {
  navigation: SearchStackNavigationProp;
  route: RouteProp<SearchStackParamList, 'Details'>;
}) {
  const [search, setSearch] = useState('');

  // This screen mounts its own search bar. UIKit hosts (and auto-activates)
  // only the search bar of the ROOT screen of the search stack - this one is
  // a regular in-header search bar, activated by tapping it.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Search in details',
        onChangeText: event => setSearch(event.nativeEvent.text),
      },
    });
  }, [navigation]);

  return (
    <View style={styles.screen}>
      <Text style={styles.label}>{route.params.place}</Text>
      <Text style={styles.hint}>
        Typed in the Details search bar: &quot;{search}&quot;
      </Text>
      <Text style={styles.hint}>
        With this screen on top the stack is not at its root,{'\n'}so UIKit
        removes the tab-hosted search field: switching{'\n'}to Config and
        reselecting the search tab must NOT{'\n'}activate any search. This
        screen&apos;s bar activates by{'\n'}tapping it in the header.
        {'\n'}
        {'\n'}
        Go back with the back gesture - the &quot;Search places&quot;
        {'\n'}field returns to the tab bar, and reselecting the{'\n'}search tab
        auto-activates it again.
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

function ConfigTab() {
  const { setRouteOptions } = useTabsNavigationContext();
  const [automaticallyActivatesSearch, setAutomaticallyActivatesSearch] =
    useState(false);

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
    <View style={styles.screen}>
      <Text style={styles.label}>Search Tab Activation</Text>
      <SettingsSwitch
        label="automaticallyActivatesSearch"
        value={automaticallyActivatesSearch}
        onValueChange={onAutomaticallyActivatesSearchChange}
      />
      <Text style={styles.hint}>
        iOS 26.1+: with the switch on, selecting the search tab{'\n'}should
        immediately activate the search field; cancelling{'\n'}the search should
        restore this tab.
        {'\n'}
        {'\n'}
        With the switch off, the search tab behaves like{'\n'}a regular tab.
      </Text>
    </View>
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
    name: 'Search',
    element: <SearchStackTab />,
    options: {
      tabBarItemTestID: 'search-tab-item',
      ios: {
        systemItem: 'search',
        searchRole: true,
      },
    },
  },
];

function TestTabsSearchTabActivation() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <TabsContainer routeConfigs={ROUTE_CONFIGS} />
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

const styles = StyleSheet.create({
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

export default createScenario(TestTabsSearchTabActivation, scenarioDescription);
