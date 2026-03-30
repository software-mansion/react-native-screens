import React, { useMemo, useState } from 'react';
import { Button, StyleSheet, Text, View, ScrollView } from 'react-native';
import {
  SafeAreaView,
  SplitView,
  SplitScreen,
} from 'react-native-screens/experimental';
import type { SplitPrimaryBackgroundStyle } from 'react-native-screens/experimental';
import type { SplitBaseConfig } from './helpers/types';
import { Colors } from '../../../shared/styling/Colors';

const ConfigPanel = ({
  setPrimaryBgStyle,
}: {
  setPrimaryBgStyle: (primaryBgStyle: SplitPrimaryBackgroundStyle) => void;
}) => (
  <View style={styles.configPanel}>
    <Button
      title="default"
      onPress={() => setPrimaryBgStyle('default')}
    />
    <Button title="none" onPress={() => setPrimaryBgStyle('none')} />
    <Button title="sidebar" onPress={() => setPrimaryBgStyle('sidebar')} />
  </View>
);

const ItemsPanel = () => {
  const data = useMemo(
    () => Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`),
    [],
  );

  return (
    <>
      {data.map((item, idx) => (
        <View key={idx} style={styles.item}>
          <Text style={styles.itemText}>{item}</Text>
        </View>
      ))}
    </>
  );
};

const SplitPrimaryBackgroundStyleApp = ({
  splitBaseConfig,
}: {
  splitBaseConfig: SplitBaseConfig;
}) => {
  const [primaryBgStyle, setPrimaryBgStyle] =
    useState<SplitPrimaryBackgroundStyle>('default');

  return (
    <SplitView
      {...splitBaseConfig}
      primaryBackgroundStyle={primaryBgStyle}>
      <SplitView.Primary>
        <SplitScreen screenKey="primary" activityMode="attached">
          <View style={styles.leftColumn} />
        </SplitScreen>
      </SplitView.Primary>
      <SplitView.Secondary>
        <SplitScreen screenKey="secondary" activityMode="attached">
          <SafeAreaView edges={{ top: true }}>
            <ScrollView contentContainerStyle={styles.rightColumn}>
              <ConfigPanel setPrimaryBgStyle={setPrimaryBgStyle} />
              <ItemsPanel />
            </ScrollView>
          </SafeAreaView>
        </SplitScreen>
      </SplitView.Secondary>
    </SplitView>
  );
};

const styles = StyleSheet.create({
  leftColumn: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  rightColumn: {
    padding: 16,
    alignItems: 'center',
  },
  configPanel: {
    marginBottom: 16,
    width: '100%',
    gap: 8,
  },
  item: {
    height: 60,
    width: '100%',
    backgroundColor: Colors.GreenLight100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 12,
  },
  itemText: {
    fontSize: 18,
  },
});

export default SplitPrimaryBackgroundStyleApp;
