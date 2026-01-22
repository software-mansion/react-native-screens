import React from 'react';
import {
  DefaultTheme,
  NavigationContainer,
  ParamListBase,
} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import ConfigWrapperContext, {
  Configuration,
  DEFAULT_GLOBAL_CONFIGURATION,
} from '../../shared/gamma/containers/bottom-tabs/ConfigWrapperContext';
import {
  BottomTabsContainer,
  TabConfiguration,
} from '../../shared/gamma/containers/bottom-tabs/BottomTabsContainer';
import Colors from '../../shared/styling/Colors';

type RouteParamList = {
  Screen1: undefined;
  Screen2: undefined;
  Screen3: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<RouteParamList>;

const Stack = createNativeStackNavigator<RouteParamList>();

function Screen1({ navigation }: StackNavigationProp) {
  return (
    <View>
      <Text>Enable system dark mode and observe the back button.</Text>
      <Button
        title="Go to screen 2"
        onPress={() => navigation.push('Screen2')}
      />
    </View>
  );
}

function TabScreen({ navigation }: StackNavigationProp) {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.cardBackground }}>
      <Button
        title="Go to screen 3"
        onPress={() => navigation.push('Screen3')}
      />
      <TextInput
        style={styles.input}
        placeholder="Test keyboard appearance..."
        placeholderTextColor="gray"
      />
    </View>
  );
}

function Screen2(stackNavProp: StackNavigationProp) {
  const [config, setConfig] = React.useState<Configuration>(
    DEFAULT_GLOBAL_CONFIGURATION,
  );

  const TAB_CONFIGS: TabConfiguration[] = [
    {
      tabScreenProps: {
        tabKey: 'Tab1',
        title: 'Tab 1',
        icon: {
          ios: {
            type: 'sfSymbol',
            name: 'house',
          },
        },
        experimental_userInterfaceStyle: 'light',
      },
      component: () => TabScreen(stackNavProp),
    },
    {
      tabScreenProps: {
        tabKey: 'Tab2',
        title: 'Tab 2',
        icon: {
          ios: {
            type: 'sfSymbol',
            name: 'rectangle.stack',
          },
        },
      },
      component: () => TabScreen(stackNavProp),
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

function Screen3() {
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Test keyboard appearance..."
        placeholderTextColor="gray"
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={DefaultTheme}>
      <Stack.Navigator
        screenOptions={{
          statusBarStyle: 'dark',
          experimental_userInterfaceStyle: 'light',
        }}>
        <Stack.Screen name="Screen1" component={Screen1} />
        <Stack.Screen
          name="Screen2"
          component={Screen2}
          options={{ headerBackTitle: 'Screen1' }}
        />
        <Stack.Screen
          name="Screen3"
          component={Screen3}
          options={{ headerBackTitle: 'Screen2' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
