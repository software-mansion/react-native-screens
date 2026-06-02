import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';
import { Colors } from '@apps/shared/styling';

function NoTitleScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>System Item Icon only</Text>
      <Text style={styles.hint}>
        This tab uses a systemItem: `favorites`.{'\n'}
        {'\n'}
        The `title` prop is set to an empty string, so no title is displayed.
      </Text>
    </View>
  );
}

function DefaultSystemItemScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Default System Item</Text>
      <Text style={styles.hint}>
        This tab uses a systemItem: `bookmarks`{'\n'}with no custom title or icon override.
      </Text>
    </View>
  );
}

function CustomTitleIconOverrideScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Custom Title and Icon Override</Text>
      <Text style={styles.hint}>
        This tab uses a systemItem: `contacts`.{'\n'}
        {'\n'}
        Custom title and icon are provided and displayed in tab bar instead of the system-provided one.
      </Text>
    </View>
  );
}

function SearchScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Search</Text>
      <Text style={styles.hint}>
        This tab uses a systemItem: `search`.{'\n'}
        {'\n'}
        The tab bar item is displayed as a magnifying glass icon.{'\n'}
        On iOS 26: this tab bar item is detached and does not display a title.
      </Text>
    </View>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'DefaultSystemItem',
    Component: DefaultSystemItemScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      ios: {
        systemItem: 'bookmarks',
      },
    },
  },
  {
    name: 'NoTitle',
    Component: NoTitleScreen,
    options: {
      title: '',
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      ios: {
        systemItem: 'favorites',
      },
    },
  },
  {
    name: 'CustomTitleIconOverride',
    Component: CustomTitleIconOverrideScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Custom',
      ios: {
        systemItem: 'contacts',
        icon: {
          type: 'sfSymbol',
          name: 'house',
        },
        selectedIcon: {
          type: 'sfSymbol',
          name: 'house.fill',
        },
      },
    },
  },
  {
    name: 'SearchScreen',
    Component: SearchScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      ios: {
        systemItem: 'search',
      },
    },
  },
];

export function App() {
  return (
    <View style={styles.appContainer}>
      <TabsContainerWithHostConfigContext
        routeConfigs={ROUTE_CONFIGS}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  hint: {
    fontSize: 13,
    color: Colors.LightOffNavy,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default createScenario(App, scenarioDescription);
