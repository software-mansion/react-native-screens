import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SplitScreen, SplitView } from 'react-native-screens/experimental';
import { Colors } from '../../../shared/styling/Colors';
import { SplitBaseConfig } from './helpers/types';

const SplitOrientation = ({
  splitBaseConfig,
}: {
  splitBaseConfig: SplitBaseConfig;
}) => {
  return (
    <SplitView {...splitBaseConfig} orientation="landscapeLeft">
      <SplitView.Primary>
        <SplitScreen screenKey="primary" activityMode="attached">
          <View style={[styles.container, { backgroundColor: Colors.White }]}>
            <Text style={styles.text}>Primary column</Text>
          </View>
        </SplitScreen>
      </SplitView.Primary>
      <SplitView.Supplementary>
        <SplitScreen screenKey="supplementary" activityMode="attached">
          <View style={[styles.container, { backgroundColor: Colors.White }]}>
            <Text style={styles.text}>Supplementary column</Text>
          </View>
        </SplitScreen>
      </SplitView.Supplementary>
      <SplitView.Secondary>
        <SplitScreen screenKey="secondary" activityMode="attached">
          <View style={[styles.container, { backgroundColor: Colors.White }]}>
            <Text style={styles.text}>Secondary column</Text>
          </View>
        </SplitScreen>
      </SplitView.Secondary>
    </SplitView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
  },
});

export default SplitOrientation;
