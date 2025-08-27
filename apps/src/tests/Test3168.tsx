import React, { useLayoutEffect, useState } from 'react';
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
import { SearchBarProps } from 'react-native-screens';
import { ListItem, SettingsSwitch } from '../shared';

type MainRouteParamList = {
  Home: undefined;
  Stack: undefined;
  // StackAndTabs: undefined;
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
        ...route.params?.headerSearchBarOptions,
        allowToolbarIntegration: route.params?.allowToolbarIntegration,
        onChangeText: event => setSearch(event.nativeEvent.text),
      },
    });
  }, [
    navigation,
    route.params?.allowToolbarIntegration,
    route.params?.headerSearchBarOptions,
    search,
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

function ExamplesStackComponent() {
  return (
    <ExamplesStack.Navigator>
      <ExamplesStack.Screen name="Menu" component={Menu} />
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
      {/*<Button
        title="Stack and Bottom Tabs"
        onPress={() => navigation.push('StackAndTabs')}
      />*/}
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
      </MainStack.Navigator>
    </NavigationContainer>
  );
}
