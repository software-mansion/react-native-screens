import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SplitViewHost, SplitViewScreen } from 'react-native-screens';
import { Colors } from '../../shared/styling/Colors';

const SplitViewBaseApp = () => {
  return (
    <SplitViewHost>
      <SplitViewScreen>
        <View style={[styles.container, { backgroundColor: Colors.RedDark100 }]} />
      </SplitViewScreen>
      <SplitViewScreen>
        <View style={[styles.container, { backgroundColor: Colors.YellowDark100 }]} />
      </SplitViewScreen>
      <SplitViewScreen>
        <View style={[styles.container, { backgroundColor: Colors.White }]}>
          <Text style={styles.text}>
            Basic demo for splitView application
          </Text>
        </View>
      </SplitViewScreen>
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
  }
})

export default SplitViewBaseApp;
