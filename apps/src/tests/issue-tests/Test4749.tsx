import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  TabsContainer,
  type TabRouteConfig,
  useTabsNavigationContext,
} from '@apps/shared/containers/tabs';
import { Colors } from '@apps/shared/styling';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/4749
//
// iOS 26. The selected tab changes its icon right after mount, before the tab
// bar is first laid out. The titles of the other tabs are then truncated
// ("Con…", "Set…") until that tab is selected. Expected: all titles in full.
//
// Opened from the issue tests list (pushed on a stack), the icon change
// lands before that first layout. When this test is the app's root, the
// SafeAreaView's state update from the UI thread makes it land there too.

/** The selected tab. Changes its own icon in an effect right after mount. */
function HomeTab() {
  const { routeKey, setRouteOptions } = useTabsNavigationContext();

  React.useEffect(() => {
    setRouteOptions(routeKey, {
      ios: { icon: { type: 'sfSymbol', name: 'house.fill' } },
    });
  }, [routeKey, setRouteOptions]);

  return (
    <View style={styles.screen}>
      <Text style={styles.text}>All tab titles should be shown in full.</Text>
    </View>
  );
}

/** Empty screen for the tabs whose titles get truncated. */
function OtherTab() {
  return <View style={styles.screen} />;
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Home',
    element: <HomeTab />,
    options: {
      title: 'Home',
      ios: { icon: { type: 'sfSymbol', name: 'house' } },
      safeAreaConfiguration: { edges: { top: true } },
    },
  },
  {
    name: 'Contacts',
    element: <OtherTab />,
    options: {
      title: 'Contacts',
      ios: { icon: { type: 'sfSymbol', name: 'person.2' } },
    },
  },
  {
    name: 'Calls',
    element: <OtherTab />,
    options: {
      title: 'Calls',
      ios: { icon: { type: 'sfSymbol', name: 'phone' } },
    },
  },
  {
    name: 'Settings',
    element: <OtherTab />,
    options: {
      title: 'Settings',
      ios: { icon: { type: 'sfSymbol', name: 'gear' } },
    },
  },
];

/** Four tabs with SF Symbol icons, Home selected. */
export default function App() {
  return <TabsContainer routeConfigs={ROUTE_CONFIGS} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.White,
  },
  text: {
    padding: 16,
    textAlign: 'center',
  },
});
