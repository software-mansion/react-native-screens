import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TabsContainer,
  type TabRouteConfig,
} from '@apps/shared/containers/tabs';
import { Colors } from '@apps/shared/styling';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/4749
// and https://github.com/software-mansion/react-native-screens/issues/5107
// (FB24250687).
//
// iOS 26. When a tab bar item changes after the tab bar enters a window but
// before its first layout, UIKit squashes the item titles: they render
// truncated ("Ho…") or too low and cut off, until each tab is selected.
// Plain titles and SF Symbols are enough to hit it, both on a cold launch and
// when the tabs are mounted later.
//
// 1. Cold-launch the app: the tabs are mounted right away.
// 2. Tap "Unmount tabs", then "Mount tabs", and repeat.
// Expected: every time the tabs appear, all titles are shown in full.

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

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Home',
    element: <TabScreen title="Home" />,
    options: {
      title: 'Home',
      ios: { icon: { type: 'sfSymbol', name: 'house' } },
    },
  },
  {
    name: 'Discover',
    element: <TabScreen title="Discover" />,
    options: {
      title: 'Discover',
      ios: { icon: { type: 'sfSymbol', name: 'safari' } },
    },
  },
  {
    name: 'Favorites',
    element: <TabScreen title="Favorites" />,
    options: {
      title: 'Favorites',
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
