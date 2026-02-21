import React from 'react';
import { Scenario } from '../../shared/helpers';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScrollViewMarker } from 'react-native-screens/experimental';
import { StackContainer } from '../../../shared/gamma/containers/stack';
import { Rectangle } from '../../../shared/Rectangle';
import Colors from '../../../shared/styling/Colors';
import { generateNextColor } from '../../../shared/utils/color-generator';

const SCENARIO: Scenario = {
  name: 'SVM configures ScrollView',
  key: 'test-svm-configures-scroll-view',
  details: 'Basic functionality of the ScrollViewMarker component',
  platforms: ['ios'],
  AppComponent: App,
};

export default SCENARIO;

export function App() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Content',
          Component: ContentScreen,
          options: {},
        },
      ]}
    />
  );
}

function ContentScreen() {
  return (
    <View
      style={[
        styles.container,
        styles.fillParent,
        { backgroundColor: Colors.White },
      ]}>
      <Text>Hello world</Text>
      <ScrollViewMarker
        style={[styles.fillParent]}
        scrollEdgeEffects={{ top: 'hard' }}>
        <ScrollView
          style={[styles.fillParent]}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ width: '100%', height: '100%' }}>
          {Array.from({ length: 12 }).map((_, index) => {
            return (
              <Rectangle
                key={index}
                color={generateNextColor()}
                width={'100%'}
                height={96}
              />
            );
          })}
        </ScrollView>
      </ScrollViewMarker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fillParent: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
