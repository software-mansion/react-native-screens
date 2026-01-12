import { ScrollView, StyleSheet, Text } from 'react-native';
import {
  ColumnConfig,
  useSplitViewSAVExampleContext,
} from './SplitViewSAVExampleContext';
import { SettingsPicker, SettingsSwitch } from '../../../../shared';
import React from 'react';
import Info from '../shared/Info';

export default function ConfigColumnTab({
  index,
  configColumnIndex,
}: {
  index: 1 | 2 | 3 | 4;
  configColumnIndex: 1 | 2 | 3 | 4;
}) {
  const { config, setConfig } = useSplitViewSAVExampleContext();

  const columnConfigKey:
    | 'column1'
    | 'column2'
    | 'column3'
    | 'column4' = `column${index}`;
  const columnConfig = config[columnConfigKey];

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 5 }}>
      <Text style={styles.title}>Safe Area configuration</Text>
      <SettingsSwitch
        label="safeAreaTopEdge"
        value={columnConfig.safeAreaTopEdge}
        onValueChange={value =>
          setConfig({
            ...config,
            [columnConfigKey]: { ...columnConfig, safeAreaTopEdge: value },
          })
        }
      />
      <SettingsSwitch
        label="safeAreaBottomEdge"
        value={columnConfig.safeAreaBottomEdge}
        onValueChange={value =>
          setConfig({
            ...config,
            [columnConfigKey]: { ...columnConfig, safeAreaBottomEdge: value },
          })
        }
      />
      <SettingsSwitch
        label="safeAreaLeftEdge"
        value={columnConfig.safeAreaLeftEdge}
        onValueChange={value =>
          setConfig({
            ...config,
            [columnConfigKey]: { ...columnConfig, safeAreaLeftEdge: value },
          })
        }
      />
      <SettingsSwitch
        label="safeAreaRightEdge"
        value={columnConfig.safeAreaRightEdge}
        onValueChange={value =>
          setConfig({
            ...config,
            [columnConfigKey]: { ...columnConfig, safeAreaRightEdge: value },
          })
        }
      />
      <Text style={styles.title}>Content configuration</Text>
      <SettingsPicker<ColumnConfig['content']>
        label="content"
        value={columnConfig.content}
        onValueChange={value =>
          setConfig({
            ...config,
            [columnConfigKey]: { ...columnConfig, content: value },
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
      {(index === 4 || configColumnIndex === 4) && (
        <>
          <Text style={styles.title}>Inspector configuration</Text>
          <SettingsSwitch
            label="showInspector"
            value={config.showInspector}
            onValueChange={value =>
              setConfig({
                ...config,
                showInspector: value,
              })
            }
          />
        </>
      )}
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
