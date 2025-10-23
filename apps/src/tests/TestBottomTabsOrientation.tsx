import React from 'react';

import { enableFreeze, ScreenOrientationTypes } from 'react-native-screens';
import {
  BottomTabsContainer,
  type TabConfiguration,
} from '../shared/gamma/containers/bottom-tabs/BottomTabsContainer';
import Colors from '../shared/styling/Colors';
import { internalEnableDetailedBottomTabsLogging } from 'react-native-screens/private';
import { Button, ScrollView, ScrollViewComponent, Text, View } from 'react-native';
import { NavigationContainer, NavigationIndependentTree, NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

enableFreeze(true);
internalEnableDetailedBottomTabsLogging();

function ScreenComponent() {
  return (
    <ScrollView contentOffset={{ x: 0, y: 200 }}>
      {Array.from({ length: 99 }).map((_, i) => (
        <View key={i} style={{ margin: 8, padding: 8, backgroundColor: Colors.PurpleLight100 }}>
          <Text style={{ color: Colors.White }}>Entry #{i + 1}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

function StackComponent(props: { orientation: ScreenOrientationTypes }) {
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
            orientation: props.orientation
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function makeTabConfigs(TabElement: React.ElementType): TabConfiguration[] {
  return [
    {
      tabScreenProps: {
        tabKey: 'Auto',
        title: 'Auto',
        isFocused: true,
        icon: {
          ios: {
            type: 'sfSymbol',
            name: 'house.fill',
          }, 
          android: {
            type: 'imageSource',
            imageSource: require('../../assets/variableIcons/icon_fill.png'),
          }
        },
        selectedIcon: {
          type: 'sfSymbol',
          name: 'house.fill',
        },
      },
      component: () => <TabElement orientation='default' />,
    },
    {
      tabScreenProps: {
        tabKey: 'Portrait',
        title: 'Portrait',
        tabBarItemBadgeBackgroundColor: Colors.GreenDark100,
        icon: {
          ios: {
            type: 'templateSource',
            templateSource: require('../../assets/variableIcons/icon.png'),
          }, 
          android: {
            type: 'drawableResource',
            name: 'sym_call_missed',
          }
        },
        selectedIcon: {
          type: 'templateSource',
          templateSource: require('../../assets/variableIcons/icon_fill.png'),
        },
        orientation: 'portrait',
      },
      component: () => <TabElement orientation='portrait' />,
    },
    {
      tabScreenProps: {
        tabKey: 'Landscape',
        title: 'Landscape',
        icon: {
          shared: {
            type: 'imageSource',
            imageSource: require('../../assets/variableIcons/icon.png'),
          }
        },
        selectedIcon: {
          type: 'imageSource',
          imageSource: require('../../assets/variableIcons/icon_fill.png'),
        },
        orientation: 'landscape'
      },
      component: () => <TabElement orientation='landscape' />,
    },
  ];
}

function ChooseBottomTabs(props: { navigation: NavigationProp<{ ScreenStackBottomTabs: undefined, ScrollOnlyBottomTabs: undefined }> }) {
  const { navigation } = props;

  return (
    <View style={{ marginTop: 200 }}>
      <Button title='Tabs with ScreenStack' onPress={() => navigation.navigate('ScreenStackBottomTabs')}/>
      <Button title='Tabs with Scroll only' onPress={() => navigation.navigate('ScrollOnlyBottomTabs')}/>
    </View>
  )
}

function ScreenStackBottomTabs() {
  const tabConfigs = makeTabConfigs(StackComponent);

  return (
    <NavigationIndependentTree>
      <BottomTabsContainer tabConfigs={tabConfigs}/>
    </NavigationIndependentTree>
  )
}

function ScrollOnlyBottomTabs() {
  const tabConfigs = makeTabConfigs(ScreenComponent);

  return (
    <NavigationIndependentTree>
      <BottomTabsContainer tabConfigs={tabConfigs}/>
    </NavigationIndependentTree>
  )
}

function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='ChooseBottomTabs' key='ChooseBottomTabs' component={ChooseBottomTabs} />
        <Stack.Screen name='ScreenStackBottomTabs' key='ScreenStackBottomTabs' component={ScreenStackBottomTabs} />
        <Stack.Screen name='ScrollOnlyBottomTabs' key='ScrollOnlyBottomTabs' component={ScrollOnlyBottomTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
