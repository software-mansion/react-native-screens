import React from 'react';

import {
  type TabsScreenOrientationIOS,
  enableFreeze,
  ScreenOrientationTypes,
} from 'react-native-screens';
import {
  BottomTabsContainer,
  type TabConfiguration,
} from '../../shared/gamma/containers/bottom-tabs/BottomTabsContainer';
import Colors from '../../shared/styling/Colors';
import { internalEnableDetailedBottomTabsLogging } from 'react-native-screens/private';
import { Button, ScrollView, Text, View } from 'react-native';
import {
  NavigationContainer,
  NavigationIndependentTree,
  NavigationProp,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

enableFreeze(true);
internalEnableDetailedBottomTabsLogging();

function ScreenComponent() {
  return (
    <ScrollView contentOffset={{ x: 0, y: 200 }}>
      {Array.from({ length: 99 }).map((_, i) => (
        <View
          key={i}
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
  tabScreen: TabsScreenOrientationIOS;
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
): TabConfiguration[] {
  return [
    {
      tabScreenProps: {
        tabKey: 'Auto',
        title: 'Auto',
        isFocused: true,
        ios: {
          icon: {
            type: 'sfSymbol',
            name: 'house.fill',
          },
          selectedIcon: {
            type: 'sfSymbol',
            name: 'house.fill',
          },
          orientation: tabsOrientations.home.tabScreen,
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
      component: tabsOrientations.home.stackScreen
        ? () => <TabElement orientation={tabsOrientations.home.stackScreen} />
        : TabElement,
    },
    {
      tabScreenProps: {
        tabKey: 'Portrait',
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
          orientation: tabsOrientations.portrait.tabScreen,
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
      },
      component: () => (
        <TabElement orientation={tabsOrientations.portrait.stackScreen} />
      ),
    },
    {
      tabScreenProps: {
        tabKey: 'Landscape',
        title: 'Landscape',
        ios: {
          icon: {
            type: 'imageSource',
            imageSource: require('../../../assets/variableIcons/icon.png'),
          },
          selectedIcon: {
            type: 'imageSource',
            imageSource: require('../../../assets/variableIcons/icon_fill.png'),
          },
          orientation: tabsOrientations.landscape.tabScreen,
        },
        android: {
          icon: {
            type: 'imageSource',
            imageSource: require('../../../assets/variableIcons/icon.png'),
          },
          selectedIcon: {
            type: 'imageSource',
            imageSource: require('../../../assets/variableIcons/icon_fill.png'),
          }
        },
      },
      component: () => (
        <TabElement orientation={tabsOrientations.landscape.stackScreen} />
      ),
    },
  ];
}

function ChooseBottomTabs(props: {
  navigation: NavigationProp<{
    ScreenStackBottomTabs: undefined;
    ScrollOnlyBottomTabs: undefined;
  }>;
}) {
  const { navigation } = props;

  return (
    <View style={{ marginTop: 200 }}>
      <Button
        title="Tabs with ScreenStack"
        onPress={() => navigation.navigate('ScreenStackBottomTabs')}
      />
      <Button
        title="Tabs with Scroll only"
        onPress={() => navigation.navigate('ScrollOnlyBottomTabs')}
      />
    </View>
  );
}

function ScreenStackBottomTabs() {
  const tabConfigs = makeTabConfigs(
    {
      home: { tabScreen: 'all', stackScreen: 'all' },
      portrait: { tabScreen: 'all', stackScreen: 'portrait' },
      landscape: { tabScreen: 'all', stackScreen: 'landscape' },
    },
    StackComponent,
  );

  return (
    <NavigationIndependentTree>
      <BottomTabsContainer tabConfigs={tabConfigs} />
    </NavigationIndependentTree>
  );
}

function ScrollOnlyBottomTabs() {
  const tabConfigs = makeTabConfigs(
    {
      home: { tabScreen: 'all' },
      portrait: { tabScreen: 'portrait' },
      landscape: { tabScreen: 'landscape' },
    },
    ScreenComponent,
  );

  return (
    <NavigationIndependentTree>
      <BottomTabsContainer tabConfigs={tabConfigs} />
    </NavigationIndependentTree>
  );
}

function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="ChooseBottomTabs"
          key="ChooseBottomTabs"
          component={ChooseBottomTabs}
          options={{ title: 'Choose BottomTabs content' }}
        />
        <Stack.Screen
          name="ScreenStackBottomTabs"
          key="ScreenStackBottomTabs"
          component={ScreenStackBottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ScrollOnlyBottomTabs"
          key="ScrollOnlyBottomTabs"
          component={ScrollOnlyBottomTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
