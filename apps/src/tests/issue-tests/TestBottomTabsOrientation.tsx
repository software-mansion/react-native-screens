import React from 'react';

import {
  type TabsScreenOrientation,
  enableFreeze,
  ScreenOrientationTypes,
} from 'react-native-screens';
import {
  TabsContainer,
  type TabRouteConfig,
} from '../../shared/gamma/containers/tabs';
import Colors from '../../shared/styling/Colors';
import { Button, ScrollView, Text, View } from 'react-native';
import {
  NavigationContainer,
  NavigationIndependentTree,
  NavigationProp,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

enableFreeze(true);

function ScreenComponent() {
  return (
    <ScrollView contentOffset={{ x: 0, y: 200 }}>
      {Array.from({ length: 99 }).map((_, i) => (
        <View
          key={i.toString()}
          style={{
            margin: 8,
            padding: 8,
            backgroundColor: Colors.PurpleLight100,
          }}>
          <Text style={{ color: Colors.White }}>Entry #{i + 1}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function StackComponent(props: { orientation?: ScreenOrientationTypes }) {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Screen"
          key="Screen"
          component={ScreenComponent}
          options={{
            headerTransparent: true,
            orientation: props.orientation,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

interface TabOrientation {
  tabScreen: TabsScreenOrientation;
  stackScreen?: ScreenOrientationTypes;
}

interface TabsOrientations {
  home: TabOrientation;
  portrait: TabOrientation;
  landscape: TabOrientation;
}

function makeTabConfigs(
  tabsOrientations: TabsOrientations,
  TabElement: React.ComponentType<{ orientation?: ScreenOrientationTypes }>,
): TabRouteConfig[] {
  return [
    {
      name: 'Auto',
      Component: tabsOrientations.home.stackScreen
        ? () => <TabElement orientation={tabsOrientations.home.stackScreen} />
        : TabElement,
      options: {
        title: 'Auto',
        orientation: tabsOrientations.home.tabScreen,
        ios: {
          icon: {
            type: 'sfSymbol',
            name: 'house.fill',
          },
          selectedIcon: {
            type: 'sfSymbol',
            name: 'house.fill',
          },
        },
        android: {
          icon: {
            type: 'imageSource',
            imageSource: require('../../../assets/variableIcons/icon_fill.png'),
          },
          selectedIcon: {
            type: 'imageSource',
            imageSource: require('../../../assets/variableIcons/icon_fill.png'),
          },
        },
      },
    },
    {
      name: 'Portrait',
      Component: () => (
        <TabElement orientation={tabsOrientations.portrait.stackScreen} />
      ),
      options: {
        title: 'Portrait',
        ios: {
          icon: {
            type: 'templateSource',
            templateSource: require('../../../assets/variableIcons/icon.png'),
          },
          selectedIcon: {
            type: 'templateSource',
            templateSource: require('../../../assets/variableIcons/icon_fill.png'),
          },
        },
        android: {
          icon: {
            type: 'drawableResource',
            name: 'sym_call_missed',
          },
          selectedIcon: {
            type: 'drawableResource',
            name: 'sym_call_missed',
          },
        },
        orientation: tabsOrientations.portrait.tabScreen,
      },
    },
    {
      name: 'Landscape',
      Component: () => (
        <TabElement orientation={tabsOrientations.landscape.stackScreen} />
      ),
      options: {
        title: 'Landscape',
        orientation: tabsOrientations.landscape.tabScreen,
        ios: {
          icon: {
            type: 'imageSource',
            imageSource: require('../../../assets/variableIcons/icon.png'),
          },
          selectedIcon: {
            type: 'imageSource',
            imageSource: require('../../../assets/variableIcons/icon_fill.png'),
          },
        },
        android: {
          icon: {
            type: 'imageSource',
            imageSource: require('../../../assets/variableIcons/icon.png'),
          },
          selectedIcon: {
            type: 'imageSource',
            imageSource: require('../../../assets/variableIcons/icon_fill.png'),
          },
        },
      },
    },
  ];
}

function ChooseTabs(props: {
  navigation: NavigationProp<{
    ScreenStackTabs: undefined;
    ScrollOnlyTabs: undefined;
  }>;
}) {
  const { navigation } = props;

  return (
    <View style={{ marginTop: 200 }}>
      <Button
        title="Tabs with ScreenStack"
        onPress={() => navigation.navigate('ScreenStackTabs')}
      />
      <Button
        title="Tabs with Scroll only"
        onPress={() => navigation.navigate('ScrollOnlyTabs')}
      />
    </View>
  );
}

function ScreenStackTabs() {
  const routeConfigs = makeTabConfigs(
    {
      home: { tabScreen: 'all', stackScreen: 'all' },
      portrait: { tabScreen: 'all', stackScreen: 'portrait' },
      landscape: { tabScreen: 'all', stackScreen: 'landscape' },
    },
    StackComponent,
  );

  return (
    <NavigationIndependentTree>
      <TabsContainer defaultRouteName="Auto" routeConfigs={routeConfigs} />
    </NavigationIndependentTree>
  );
}

function ScrollOnlyTabs() {
  const routeConfigs = makeTabConfigs(
    {
      home: { tabScreen: 'all' },
      portrait: { tabScreen: 'portrait' },
      landscape: { tabScreen: 'landscape' },
    },
    ScreenComponent,
  );

  return (
    <NavigationIndependentTree>
      <TabsContainer routeConfigs={routeConfigs} />
    </NavigationIndependentTree>
  );
}

function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="ChooseTabs"
          key="ChooseTabs"
          component={ChooseTabs}
          options={{ title: 'Choose Tabs content' }}
        />
        <Stack.Screen
          name="ScreenStackTabs"
          key="ScreenStackTabs"
          component={ScreenStackTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ScrollOnlyTabs"
          key="ScrollOnlyTabs"
          component={ScrollOnlyTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
