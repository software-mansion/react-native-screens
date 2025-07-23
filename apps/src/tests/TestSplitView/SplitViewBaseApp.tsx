import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SplitViewHost, SplitViewScreen } from 'react-native-screens';
import { Colors } from '../../shared/styling/Colors';
import { TestBottomTabs, TestScreenStack } from '..';
import { SplitViewBaseConfig } from './helpers/types';

const SplitViewBaseApp = ({ splitViewBaseConfig }: { splitViewBaseConfig: SplitViewBaseConfig }) => {
  return (
    <SplitViewHost {...splitViewBaseConfig}>
      <SplitViewScreen.Column>
        <View style={[styles.container, { backgroundColor: Colors.White }]}>
          <Text style={styles.text}>Primary column</Text>
        </View>
      </SplitViewScreen.Column>
      <SplitViewScreen.Column>
        <TestBottomTabs />
      </SplitViewScreen.Column>
      <SplitViewScreen.Column>
        <TestScreenStack />
      </SplitViewScreen.Column>
    </SplitViewHost>
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

export default SplitViewBaseApp;
