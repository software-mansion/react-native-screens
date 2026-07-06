import React, { useEffect, useState } from 'react';
import {
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {
  DEFAULT_TAB_ROUTE_OPTIONS,
  TabsContainer,
  type TabRouteConfig,
  useTabsNavigationContext,
} from '@apps/shared/gamma/containers/tabs';
import { Colors, DarkColors, Palette } from '@apps/shared/styling';

type RouteParamList = {
  Tabs: undefined;
  Cover: undefined;
};

type StackNavigationProp = {
  navigation: NativeStackNavigationProp<RouteParamList>;
};

const Stack = createNativeStackNavigator<RouteParamList>();

const AppStateContext = React.createContext({
  generation: 0,
  dark: false,
  setGeneration: (_: number) => {},
  setDark: (_: boolean) => {},
});

function useAppearanceSync() {
  const { dark } = React.useContext(AppStateContext);
  const { routeKey, setRouteOptions } = useTabsNavigationContext();

  useEffect(() => {
    const bg = dark ? DarkColors.background : Colors.background;
    setRouteOptions(routeKey, {
      android: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.android,
        standardAppearance: {
          tabBarBackgroundColor: bg,
        },
      },
      ios: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
        standardAppearance: {
          tabBarBackgroundColor: bg,
        },
      },
    });
  }, [dark, routeKey, setRouteOptions]);
}

function HomeTab({
  navigation,
}: {
  navigation: NativeStackNavigationProp<RouteParamList>;
}) {
  useAppearanceSync();

  const { generation, dark, setGeneration, setDark } =
    React.useContext(AppStateContext);

  return (
    <ScrollView contentContainerStyle={styles.homeContent}>
      <Text style={styles.title}>Tabs crash repro</Text>
      <Text style={styles.step}>
        1. Press "Push cover screen" (tabs get detached underneath).
      </Text>
      <Text style={styles.step}>
        2. On the cover screen press "Remount tabs while detached" (simulates
        what expo-router does when the visible tab set changes — the new
        TabsContainer never attaches, so its navState stays EMPTY).
      </Text>
      <Text style={styles.step}>
        3. Press "Toggle theme" (changes standardAppearance
        tabBarBackgroundColor via setRouteOptions).
      </Text>
      <Text style={styles.step}>
        4. Android throws: IllegalStateException "[RNScreens] No selected tab
        present" (fatal crash in release builds).
      </Text>
      <View style={styles.buttons}>
        <Button
          title={`Remount tabs (generation: ${generation})`}
          onPress={() => setGeneration(generation + 1)}
        />
        <Button
          title={`Toggle theme (current: ${dark ? 'dark' : 'light'})`}
          onPress={() => setDark(!dark)}
        />
        <Button
          title="Push cover screen"
          onPress={() => navigation.navigate('Cover')}
        />
      </View>
    </ScrollView>
  );
}

function SecondTab() {
  useAppearanceSync();

  return (
    <View style={styles.tabContent}>
      <Text>Second tab</Text>
    </View>
  );
}

function TabsScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<RouteParamList>;
}) {
  const { dark, generation } = React.useContext(AppStateContext);
  const bg = dark ? DarkColors.background : Colors.background;

  const routeConfigs: TabRouteConfig[] = [
    {
      name: 'Home',
      Component: () => HomeTab({ navigation }),
      options: {
        ...DEFAULT_TAB_ROUTE_OPTIONS,
        title: 'Home',
        android: {
          ...DEFAULT_TAB_ROUTE_OPTIONS.android,
          standardAppearance: {
            tabBarBackgroundColor: bg,
          },
        },
        ios: {
          ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
          standardAppearance: {
            tabBarBackgroundColor: bg,
          },
        },
      },
    },
    {
      name: 'Second',
      Component: SecondTab,
      options: {
        ...DEFAULT_TAB_ROUTE_OPTIONS,
        title: 'Second',
        android: {
          ...DEFAULT_TAB_ROUTE_OPTIONS.android,
          standardAppearance: {
            tabBarBackgroundColor: bg,
          },
        },
        ios: {
          ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
          standardAppearance: {
            tabBarBackgroundColor: bg,
          },
        },
      },
    },
  ];

  // `key` remounts TabsContainer, exactly like expo-router does when the set
  // of visible tabs changes (its internal `key: visibleTabsKeys`). The old
  // TabsContainer leaks (stays detached with EMPTY navState) but keeps
  // receiving Fabric prop updates.
  return (
    <TabsContainer
      key={`generation-${generation}`}
      routeConfigs={routeConfigs}
    />
  );
}

function CoverScreen() {
  const { generation, dark, setGeneration, setDark } =
    React.useContext(AppStateContext);

  return (
    <View style={styles.cover}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>
        Cover screen (tabs are detached underneath)
      </Text>
      <View style={styles.buttons}>
        <Button
          title={`Remount tabs while detached (generation: ${generation})`}
          onPress={() => setGeneration(generation + 1)}
        />
        <Button
          title={`Toggle theme (current: ${dark ? 'dark' : 'light'})`}
          onPress={() => setDark(!dark)}
        />
      </View>
    </View>
  );
}

function MainScreen({ navigation }: StackNavigationProp) {
  return <TabsScreen navigation={navigation} />;
}

export default function App() {
  const [generation, setGeneration] = useState(0);
  const [dark, setDark] = useState(false);

  return (
    <AppStateContext.Provider
      value={{
        generation,
        dark,
        setGeneration,
        setDark,
      }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Tabs"
            component={MainScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Cover" component={CoverScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppStateContext.Provider>
  );
}

const styles = StyleSheet.create({
  homeContent: {
    padding: 24,
    paddingTop: Platform.OS === 'android' ? 60 : 80,
    gap: 8,
  },
  cover: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  step: {
    fontSize: 14,
    color: Palette.NavyLight60,
  },
  buttons: {
    marginTop: 24,
    gap: 12,
  },
});
