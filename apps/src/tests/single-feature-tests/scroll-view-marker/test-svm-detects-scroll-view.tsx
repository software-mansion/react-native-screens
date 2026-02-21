import React from 'react';
import { Scenario } from '../../shared/helpers';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScrollViewMarker } from 'react-native-screens/experimental';
import { StackContainer } from '../../../shared/gamma/containers/stack';
import { Rectangle } from '../../../shared/Rectangle';
import Colors from '../../../shared/styling/Colors';

const SCENARIO: Scenario = {
  name: 'Basic functionality',
  key: 'test-svm-detects-scroll-view',
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

  // return <ContentScreen />;
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
      {/*<Rectangle color={Colors.BlueDark100} width={'100%'} height={96} />*/}
      {/*{Array.from({ length: 4 }).map((_, index) => {
        return (
          <Rectangle
            key={index}
            color={generateNextColor()}
            width={'100%'}
            height={96}
          />
        );
      })}*/}
      <ScrollViewMarker style={[styles.fillParent]}>
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

function ContentWithMarker() {
  return (
    <View style={[styles.container, styles.fillParent]}>
      <Text>Hello world</Text>
      <Rectangle color={Colors.BlueDark100} width={'100%'} height={96} />
      <ScrollViewMarker
        style={[styles.container, { backgroundColor: Colors.YellowDark100 }]}>
        <ScrollView
          style={[{ backgroundColor: Colors.PurpleDark60 }]}
          contentContainerStyle={{ width: '100%', height: '100%' }}>
          <Text>Hello world</Text>
          <Text>Hello world</Text>
          <Text>Hello world</Text>
          <Text>Hello world</Text>
          {Array.from({ length: 8 }).map((_, index) => {
            return (
              <Rectangle
                key={index}
                color={Colors.BlueDark100}
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

let GLOBAL_NEXT_COLOR_ID = 0;

function generateNextColor() {
  const colors = [
    Colors.BlueDark100,
    Colors.GreenDark100,
    Colors.RedDark100,
    Colors.YellowDark100,
    Colors.PurpleDark100,
    Colors.BlueLight100,
    Colors.GreenLight100,
    Colors.RedLight100,
    Colors.YellowLight100,
    Colors.PurpleLight100,
  ];
  const index = GLOBAL_NEXT_COLOR_ID;
  GLOBAL_NEXT_COLOR_ID += 1;
  return colors[index % colors.length];
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
