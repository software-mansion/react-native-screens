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

function NormalTabScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Normal Tab</Text>
      <Text style={styles.hint}>
        This tab does not use systemItem.{'\n'}
        {'\n'}
        Only the custom title and (if provided) custom icon appear in the tab bar.
        This is the baseline behavior when systemItem is undefined.
      </Text>
    </View>
  );
}

function DefaultTitleScreen() {
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
        Custom title and icon are provide and display in tab bar instead of the system-provided one.
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
        The tab bar iteam is displayed as a magnifying glass icon with no title, which is the expected appearance for the `search` system item.
      </Text>
    </View>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'NormalTab',
    Component: NormalTabScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'NormalTab',
    },
  },
  {
    name: 'DefaultTitle',
    Component: DefaultTitleScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      ios: {
        systemItem: 'bookmarks',
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
        defaultRouteName="NormalTab"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  controlPanel: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 8,
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  controlInfo: {
    fontSize: 11,
    color: '#555',
    marginTop: 4,
  },
  highlight: {
    fontWeight: '600',
    color: Colors.GreenDark100,
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
