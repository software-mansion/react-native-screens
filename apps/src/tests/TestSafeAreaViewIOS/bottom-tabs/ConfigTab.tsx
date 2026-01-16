import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import {
  BottomTabsSAVExampleConfig,
  useBottomTabsSAVExampleContext,
} from './BottomTabsSAVExampleContext';
import { SettingsPicker, SettingsSwitch } from '../../../shared';
import Info from '../shared/Info';

export default function ConfigTab() {
  const { config, setConfig } = useBottomTabsSAVExampleContext();

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 5 }}>
      <Text style={styles.title}>Safe Area configuration</Text>
      <SettingsSwitch
        label="safeAreaTopEdge"
        value={config.safeAreaTopEdge}
        onValueChange={value =>
          setConfig({ ...config, safeAreaTopEdge: value })
        }
      />
      <SettingsSwitch
        label="safeAreaBottomEdge"
        value={config.safeAreaBottomEdge}
        onValueChange={value =>
          setConfig({ ...config, safeAreaBottomEdge: value })
        }
      />
      <SettingsSwitch
        label="safeAreaLeftEdge"
        value={config.safeAreaLeftEdge}
        onValueChange={value =>
          setConfig({ ...config, safeAreaLeftEdge: value })
        }
      />
      <SettingsSwitch
        label="safeAreaRightEdge"
        value={config.safeAreaRightEdge}
        onValueChange={value =>
          setConfig({ ...config, safeAreaRightEdge: value })
        }
      />
      <Text style={styles.title}>Tabs configuration</Text>
      <SettingsPicker<BottomTabsSAVExampleConfig['tabBarMinimizeBehavior']>
        label="tabBarMinimizeBehavior"
        value={config.tabBarMinimizeBehavior}
        onValueChange={value =>
          setConfig({
            ...config,
            tabBarMinimizeBehavior: value,
          })
        }
        items={['auto', 'onScrollDown', 'onScrollUp', 'never']}
      />
      <SettingsPicker<BottomTabsSAVExampleConfig['tabBarItemSystemItem']>
        label="tabBarItemSystemItem"
        value={config.tabBarItemSystemItem}
        onValueChange={value =>
          setConfig({
            ...config,
            tabBarItemSystemItem: value,
          })
        }
        items={[
          'disabled',
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
        ]}
      />
      <Text style={styles.title}>Content configuration</Text>
      <SettingsPicker<BottomTabsSAVExampleConfig['content']>
        label="content"
        value={config.content}
        onValueChange={value =>
          setConfig({
            ...config,
            content: value,
          })
        }
        items={['regularView', 'scrollViewAutomatic', 'tabs', 'stack']}
      />
      <Info />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});
