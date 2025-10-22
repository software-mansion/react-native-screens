import React, { useMemo, useState } from 'react';
import { Button, StyleSheet, Text, View, ScrollView } from 'react-native';
import {
  SafeAreaView,
  SplitViewHost,
  SplitViewScreen,
} from 'react-native-screens/experimental';
import type { SplitViewPrimaryBackgroundStyle } from 'react-native-screens/experimental';
import type { SplitViewBaseConfig } from './helpers/types';
import { Colors } from '../../shared/styling/Colors';

const SplitViewPrimaryBackgroundStyleApp = ({
  splitViewBaseConfig,
}: {
  splitViewBaseConfig: SplitViewBaseConfig;
}) => {
  const [primaryBgStyle, setPrimaryBgStyle] =
    useState<SplitViewPrimaryBackgroundStyle>('systemDefault');

  const data = useMemo(
    () => Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`),
    [],
  );

  const renderConfigPanel = () => (
    <View style={styles.configPanel}>
      <Button
        title="systemDefault"
        onPress={() => setPrimaryBgStyle('systemDefault')}
      />
      <Button title="none" onPress={() => setPrimaryBgStyle('none')} />
      <Button title="sidebar" onPress={() => setPrimaryBgStyle('sidebar')} />
    </View>
  );

  const renderItems = () =>
    data.map((item, idx) => (
      <View key={idx} style={styles.item}>
        <Text style={styles.itemText}>{item}</Text>
      </View>
    ));

  return (
    <SplitViewHost
      {...splitViewBaseConfig}
      primaryBackgroundStyle={primaryBgStyle}>
      <SplitViewScreen.Column>
        <View style={styles.leftColumn} />
      </SplitViewScreen.Column>

      <SplitViewScreen.Column>
        <SafeAreaView edges={{top: true}}>
        <ScrollView contentContainerStyle={styles.rightColumn}>
          {renderConfigPanel()}
          {renderItems()}
        </ScrollView>
        </SafeAreaView>
      </SplitViewScreen.Column>
    </SplitViewHost>
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

export default SplitViewPrimaryBackgroundStyleApp;
