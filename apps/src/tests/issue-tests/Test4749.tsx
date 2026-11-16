import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import type { TabsScreenAppearanceIOS } from 'react-native-screens';
import {
  TabsContainer,
  type TabRouteConfig,
  useTabsNavigationContext,
} from '@apps/shared/containers/tabs';
import {
  StackContainer,
  type StackRouteConfig,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { Colors } from '@apps/shared/styling';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/4749
// and https://github.com/software-mansion/react-native-screens/issues/5107
//
// iOS 26. The tab bar fits each item's title on its first layout with that
// item and doesn't fit it again when the item's content changes later. Here:
// - the icons are PNGs, so they land asynchronously, after that first layout,
// - every tab uses a custom font, weight and title offset,
// - the Settings badge is set right after mount,
// - the Discover title can be toggled at runtime.
// Without the fix the titles render truncated ("Ho…") or too low and cut off
// until each tab is selected. Expected: all titles in full.
//
// The Discover tab hosts a stack with its own appearance. Pushing and popping
// in it must not make the tab bar flash (the regression that got #4411
// reverted in #4476).

const ICON = require('@assets/variableIcons/icon.png');
const ICON_SELECTED = require('@assets/variableIcons/icon_fill.png');

const FONT = {
  tabBarItemTitleFontFamily: 'Georgia',
  tabBarItemTitleFontWeight: '600',
  tabBarItemTitlePositionAdjustment: { vertical: 4 },
} as const;

function makeAppearance(selectedColor: string): TabsScreenAppearanceIOS {
  return {
    stacked: {
      normal: { ...FONT, tabBarItemTitleFontColor: Colors.LightOffNavy },
      selected: { ...FONT, tabBarItemTitleFontColor: selectedColor },
    },
  };
}

const APPEARANCE = makeAppearance(Colors.BlueDark100);
const DISCOVER_APPEARANCE = makeAppearance(Colors.RedDark100);

const DISCOVER_TITLES = ['Discover', 'Discover more'];

function HomeTab() {
  const { setRouteOptions } = useTabsNavigationContext();
  const [titleIndex, setTitleIndex] = React.useState(0);

  // An item update right after mount, like an unread count arriving.
  React.useEffect(() => {
    setRouteOptions('Settings', { badgeValue: '3' });
  }, [setRouteOptions]);

  const toggleTitle = () => {
    const nextIndex = (titleIndex + 1) % DISCOVER_TITLES.length;
    setTitleIndex(nextIndex);
    setRouteOptions('Discover', { title: DISCOVER_TITLES[nextIndex] });
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.text}>
        All tab titles should be shown in full, in Georgia, on first appearance
        and after toggling the title.
      </Text>
      <Button
        title={`Rename Discover to "${
          DISCOVER_TITLES[(titleIndex + 1) % DISCOVER_TITLES.length]
        }"`}
        onPress={toggleTitle}
      />
    </View>
  );
}

function StackScreen() {
  const { push, pop, routeKey } = useStackNavigationContext();

  return (
    <View style={styles.screen}>
      <Text style={styles.text}>
        Push and pop. The tab bar must not flash and the titles must stay in
        place.
      </Text>
      <Button title="Push" onPress={() => push('Details')} />
      <Button title="Pop" onPress={() => pop(routeKey)} />
    </View>
  );
}

const STACK_ROUTE_CONFIGS: StackRouteConfig[] = [
  { name: 'List', element: <StackScreen /> },
  { name: 'Details', element: <StackScreen /> },
];

function DiscoverTab() {
  return <StackContainer routeConfigs={STACK_ROUTE_CONFIGS} />;
}

function OtherTab() {
  return <View style={styles.screen} />;
}

const ICONS = {
  icon: { type: 'imageSource', imageSource: ICON },
  selectedIcon: { type: 'imageSource', imageSource: ICON_SELECTED },
} as const;

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Home',
    element: <HomeTab />,
    options: {
      title: 'Home',
      ios: { ...ICONS, standardAppearance: APPEARANCE },
      safeAreaConfiguration: { edges: { top: true } },
    },
  },
  {
    name: 'Discover',
    element: <DiscoverTab />,
    options: {
      title: DISCOVER_TITLES[0],
      ios: { ...ICONS, standardAppearance: DISCOVER_APPEARANCE },
    },
  },
  {
    name: 'Favorites',
    element: <OtherTab />,
    options: {
      title: 'Favorites',
      ios: { ...ICONS, standardAppearance: APPEARANCE },
    },
  },
  {
    name: 'Settings',
    element: <OtherTab />,
    options: {
      title: 'Settings',
      ios: { ...ICONS, standardAppearance: APPEARANCE },
    },
  },
];

export default function App() {
  return <TabsContainer routeConfigs={ROUTE_CONFIGS} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.White,
  },
  text: {
    padding: 16,
    textAlign: 'center',
  },
});
