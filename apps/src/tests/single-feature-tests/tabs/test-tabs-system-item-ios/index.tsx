import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';
import { SettingsPicker } from '@apps/shared';
import type { TabsScreenSystemItem } from 'react-native-screens';
import { Colors } from '@apps/shared/styling';

const SYSTEM_ITEMS: TabsScreenSystemItem[] = [
  'bookmarks',
  'contacts',
  'downloads',
  'favorites',
  'featured',
  'history',
  'more',
  'mostRecent',
  'mostViewed',
  'recents',
  'search',
  'topRated',
];

function ConfigScreen() {
  const [selectedSystemItem, setSelectedSystemItem] = useState<TabsScreenSystemItem | undefined>(
    'bookmarks'
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>System Item Selection</Text>
        <Text style={styles.description}>
          The selected system item will override the custom title and icon on the tab. Observe how the
          system icon and appearance changes as you select different items.
        </Text>
        <SettingsPicker<TabsScreenSystemItem | undefined>
          label="systemItem"
          value={selectedSystemItem}
          onValueChange={setSelectedSystemItem}
          items={[undefined, ...SYSTEM_ITEMS] as Array<TabsScreenSystemItem | undefined>}
        />
        {selectedSystemItem && (
          <Text style={styles.info}>
            Current: <Text style={styles.highlight}>{selectedSystemItem}</Text>
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

function DemoScreen() {
  return (
    <View style={styles.centeredScreen}>
      <Text style={styles.label}>Demo Tab</Text>
      <Text style={styles.hint}>
        This tab demonstrates how the selected system item appears in the tab bar.{'\n'}
        {'\n'}
        When a system item is set, the tab bar automatically displays the
        appropriate system icon and label, overriding any custom title or icon
        you may have configured.
      </Text>
    </View>
  );
}

interface AppProps {
  systemItem: TabsScreenSystemItem | undefined;
}

function AppWithSystemItem({ systemItem }: AppProps) {
  const routeConfigs: TabRouteConfig[] = [
    {
      name: 'Config',
      Component: ConfigScreen,
      options: {
        ...DEFAULT_TAB_ROUTE_OPTIONS,
        title: 'Config',
      },
    },
    {
      name: 'Demo',
      Component: DemoScreen,
      options: {
        ...DEFAULT_TAB_ROUTE_OPTIONS,
        title: 'Demo Tab',
        ios: {
          ...(systemItem ? { systemItem } : {}),
        },
      },
    },
  ];

  return <TabsContainerWithHostConfigContext routeConfigs={routeConfigs} />;
}

export function App() {
  const [systemItem, setSystemItem] = useState<TabsScreenSystemItem | undefined>('bookmarks');

  return (
    <View style={styles.appContainer}>
      <View style={styles.controlPanel}>
        <Text style={styles.controlLabel}>System Item</Text>
        <SettingsPicker<TabsScreenSystemItem | undefined>
          label=""
          value={systemItem}
          onValueChange={setSystemItem}
          items={[undefined, ...SYSTEM_ITEMS] as Array<TabsScreenSystemItem | undefined>}
        />
      </View>
      <AppWithSystemItem systemItem={systemItem} />
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
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  content: {
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: '#000',
  },
  description: {
    fontSize: 13,
    color: Colors.LightOffNavy,
    textAlign: 'center',
    lineHeight: 18,
  },
  info: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    marginTop: 8,
  },
  highlight: {
    fontWeight: '600',
    color: Colors.GreenDark100,
  },
  centeredScreen: {
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
