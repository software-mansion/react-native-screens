import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import ConfigWrapperContext, {
  Configuration,
  DEFAULT_GLOBAL_CONFIGURATION,
} from '@apps/shared/gamma/containers/tabs/ConfigWrapperContext';
import {
  TabsContainer,
  TabRouteConfig,
} from '@apps/shared/gamma/containers/tabs';
import { Colors } from '@apps/shared/styling';

type RouteParamList = {
  Screen1: undefined;
  Screen2: undefined;
  Screen3: undefined;
};

type ScreenProps<RouteName extends keyof RouteParamList> =
  NativeStackScreenProps<RouteParamList, RouteName>;

type TabScreenProps = {
  navigation: NativeStackNavigationProp<RouteParamList, 'Screen2'>;
};

const Stack = createNativeStackNavigator<RouteParamList>();

function Screen1({ navigation }: ScreenProps<'Screen1'>) {
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

function TabScreen({ navigation }: TabScreenProps) {
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

function Screen2({ navigation }: ScreenProps<'Screen2'>) {
  const [config, setConfig] = React.useState<Configuration>(
    DEFAULT_GLOBAL_CONFIGURATION,
  );

  const TAB_CONFIGS: TabRouteConfig[] = [
    {
      name: 'Tab1',
      Component: () => <TabScreen navigation={navigation} />,
      options: {
        title: 'Tab 1',
        ios: {
          icon: {
            type: 'sfSymbol',
            name: 'house',
          },
          experimental_userInterfaceStyle: 'light',
        },
      },
    },
    {
      name: 'Tab2',
      Component: () => <TabScreen navigation={navigation} />,
      options: {
        title: 'Tab 2',
        ios: {
          icon: {
            type: 'sfSymbol',
            name: 'rectangle.stack',
          },
        },
      },
    },
  ];

  return (
    <ConfigWrapperContext.Provider
      value={{
        config,
        setConfig,
      }}>
      <TabsContainer routeConfigs={TAB_CONFIGS} />
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
