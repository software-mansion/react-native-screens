import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tabs, type TabsHostNavStateRequest } from 'react-native-screens';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/5015
//
// iOS 26. A search tab (`ios.role: 'search'`, backed by `UISearchTab`) with a
// custom title ("search" here; the system default is "Search") makes the
// titles of the other tabs render as "…" on the first appearance of the tab
// bar, until each tab is selected.

function Content({ label }: { label: string }) {
  return (
    <View style={styles.content}>
      <Text style={styles.title}>{label}</Text>
      <Text style={styles.description}>
        Expected: the tab bar shows "Home", "Library" and "Favorites" in full
        right after this screen appears, without tapping any tab.
      </Text>
    </View>
  );
}

export default function Test5015() {
  const [nav, setNav] = useState<TabsHostNavStateRequest>({
    selectedScreenKey: 'home',
    baseProvenance: 0,
  });

  return (
    <Tabs.Host
      navStateRequest={nav}
      onTabSelected={e =>
        setNav({
          selectedScreenKey: e.nativeEvent.selectedScreenKey,
          baseProvenance: e.nativeEvent.provenance,
        })
      }>
      <Tabs.Screen
        screenKey="home"
        title="Home"
        tabBarItemTestID="test5015-tab-home"
        ios={{ icon: { type: 'sfSymbol', name: 'house' } }}>
        <Content label="Home" />
      </Tabs.Screen>
      <Tabs.Screen
        screenKey="library"
        title="Library"
        tabBarItemTestID="test5015-tab-library"
        ios={{ icon: { type: 'sfSymbol', name: 'books.vertical' } }}>
        <Content label="Library" />
      </Tabs.Screen>
      <Tabs.Screen
        screenKey="favorites"
        title="Favorites"
        tabBarItemTestID="test5015-tab-favorites"
        ios={{ icon: { type: 'sfSymbol', name: 'star.fill' } }}>
        <Content label="Favorites" />
      </Tabs.Screen>
      <Tabs.Screen
        screenKey="search"
        title="search"
        tabBarItemTestID="test5015-tab-search"
        ios={{
          systemItem: 'search',
          role: 'search',
          automaticallyActivatesSearch: true,
        }}>
        <Content label="Search" />
      </Tabs.Screen>
    </Tabs.Host>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    textAlign: 'center',
  },
});
