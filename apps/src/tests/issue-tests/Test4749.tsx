import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TabsContainer,
  type TabRouteConfig,
  useTabsNavigationContext,
} from '@apps/shared/containers/tabs';
import { Colors } from '@apps/shared/styling';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/4749
// and https://github.com/software-mansion/react-native-screens/issues/5107
//
// iOS 26. A tab title that changes after the tabs are installed, but before
// the first layout of the tab bar, leaves the titles truncated ("Boo…") or too
// low and cut off, until each tab is selected.
//
// The tabs cover the known triggers:
// - Home changes its own icon right after mount (the #4749 scenario),
// - Bookmarks is a system item without a custom title,
// - Favorites has a badge from the start,
// - all of them on iOS 26.0, where the legacy (non-UITab) API is used (#5107).
//
// 1. Cold-launch the app: the tabs are mounted right away.
// 2. Tap "Unmount tabs", then "Mount tabs", and repeat.
// Expected: every time the tabs appear, all titles are shown in full, on the
// same baseline, and Home shows the filled house icon.

function TabScreen({ title }: { title: string }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>
        All tab titles should be shown in full, on a cold launch and after each
        mount.
      </Text>
    </View>
  );
}

function HomeTab() {
  const { routeKey, setRouteOptions } = useTabsNavigationContext();

  React.useEffect(() => {
    setRouteOptions(routeKey, {
      ios: { icon: { type: 'sfSymbol', name: 'house.fill' } },
    });
  }, [routeKey, setRouteOptions]);

  return <TabScreen title="Home" />;
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Home',
    element: <HomeTab />,
    options: {
      title: 'Home',
      ios: { icon: { type: 'sfSymbol', name: 'house' } },
    },
  },
  {
    name: 'Bookmarks',
    element: <TabScreen title="Bookmarks" />,
    options: {
      ios: { systemItem: 'bookmarks' },
    },
  },
  {
    name: 'Favorites',
    element: <TabScreen title="Favorites" />,
    options: {
      title: 'Favorites',
      badgeValue: '3',
      ios: { icon: { type: 'sfSymbol', name: 'star' } },
    },
  },
  {
    name: 'Library',
    element: <TabScreen title="Library" />,
    options: {
      title: 'Library',
      ios: { icon: { type: 'sfSymbol', name: 'books.vertical' } },
    },
  },
  {
    name: 'Settings',
    element: <TabScreen title="Settings" />,
    options: {
      title: 'Settings',
      ios: { icon: { type: 'sfSymbol', name: 'gear' } },
    },
  },
];

export default function App() {
  const [mounted, setMounted] = React.useState(true);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.root}>
        <Button
          title={mounted ? 'Unmount tabs' : 'Mount tabs'}
          onPress={() => setMounted(value => !value)}
        />
        {mounted ? (
          <TabsContainer routeConfigs={ROUTE_CONFIGS} />
        ) : (
          <View style={styles.screen}>
            <Text style={styles.text}>Tabs unmounted.</Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.White,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    padding: 16,
    textAlign: 'center',
  },
});
