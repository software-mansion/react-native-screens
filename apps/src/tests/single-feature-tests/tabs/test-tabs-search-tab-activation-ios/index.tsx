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
// the search bar into the header yet, and UISearchTab activation on iOS 26+ works
// with the search controller mirrored from the nested stack's header.

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
        reselect the search tab - activation must still{'\n'}focus the search
        field of the List screen.
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
        iOS 26+: with the switch on, selecting the search tab{'\n'}should
        immediately activate the search field; cancelling{'\n'}the search
        should restore this tab.
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
