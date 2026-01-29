import React from 'react';
import { StackNavigationProp } from '.';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';
import {
  StackV4SAVExampleConfig,
  useStackV4SAVExampleContext,
} from './StackV4SAVExampleContext';
import { SettingsPicker, SettingsSwitch } from '../../../../shared';
import Info from '../shared/Info';

export default function ConfigScreen({ navigation }: StackNavigationProp) {
  const { config, setConfig } = useStackV4SAVExampleContext();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 5 }}>
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
      <Text style={styles.title}>Stack configuration</Text>
      <SettingsSwitch
        label="headerTransparent"
        value={config.headerTransparent}
        onValueChange={value =>
          setConfig({ ...config, headerTransparent: value })
        }
      />
      <SettingsSwitch
        label="headerLargeTitle"
        value={config.headerLargeTitle}
        onValueChange={value =>
          setConfig({ ...config, headerLargeTitle: value })
        }
      />
      <SettingsSwitch
        label="headerShown"
        value={config.headerShown}
        onValueChange={value => setConfig({ ...config, headerShown: value })}
      />
      <SettingsPicker<StackV4SAVExampleConfig['headerSearchBar']>
        label="headerSearchBar"
        value={config.headerSearchBar}
        onValueChange={value =>
          setConfig({
            ...config,
            headerSearchBar: value,
          })
        }
        items={[
          'disabled',
          'automatic',
          'inline',
          'stacked',
          'integrated',
          'integratedButton',
          'integratedCentered',
        ]}
      />
      <Text style={styles.title}>Content configuration</Text>
      <SettingsPicker<StackV4SAVExampleConfig['content']>
        label="content"
        value={config.content}
        onValueChange={value =>
          setConfig({
            ...config,
            content: value,
          })
        }
        items={[
          'regularView',
          'scrollViewNever',
          'scrollViewAutomatic',
          'tabs',
          'stack',
        ]}
      />
      <Button
        title="Push screen"
        onPress={() => navigation.push('TestScreen')}
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
