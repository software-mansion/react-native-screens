import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Split } from 'react-native-screens/experimental';
import { Colors } from '../../shared/styling/Colors';
import { TestBottomTabs, TestScreenStack } from '..';
import { SplitBaseConfig } from './helpers/types';

const SplitBaseApp = ({ splitViewBaseConfig }: { splitViewBaseConfig: SplitBaseConfig }) => {
  return (
    <Split.Host {...splitViewBaseConfig}>
      <Split.Column>
        <View style={[styles.container, { backgroundColor: Colors.White }]}>
          <Text style={styles.text}>Primary column</Text>
        </View>
      </Split.Column>
      <Split.Column>
        <TestBottomTabs />
      </Split.Column>
      <Split.Column>
        <TestScreenStack />
      </Split.Column>
    </Split.Host>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 24
  },
  button: {
    width: 120,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BlueDark100
  }
})

export default SplitBaseApp;
