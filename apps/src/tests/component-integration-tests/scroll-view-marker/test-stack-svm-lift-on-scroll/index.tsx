import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  type StackRouteConfig,
} from '@apps/shared/containers/stack';
import { ScrollViewMarker } from 'react-native-screens';
import { Rectangle } from '@apps/shared/Rectangle';
import { Colors } from '@apps/shared/styling';
import { scenarioDescription } from './scenario-description';

const ITEM_COUNT = 40;

export function TestStackSvmLiftOnScroll() {
  return <StackContainer routeConfigs={ROUTE_CONFIGS} />;
}

const ROUTE_CONFIGS: StackRouteConfig[] = [
  {
    name: 'LiftOnScroll',
    Component: ContentScreen,
    options: {
      headerConfig: {
        title: 'Lift on scroll',
        android: {
          type: 'small',
          scrollFlagScroll: true,
          scrollFlagEnterAlways: true,
          liftOnScroll: true,
        },
      },
    },
  },
];

function ContentScreen() {
  return (
    <View style={[styles.fillParent, { backgroundColor: Colors.White }]}>
      <ScrollViewMarker style={styles.fillParent}>
        <ScrollView
          nestedScrollEnabled
          testID="lift-on-scroll-scrollview"
          contentInsetAdjustmentBehavior="automatic"
          style={styles.fillParent}>
          {Array.from({ length: ITEM_COUNT }).map((_, index) => (
            <View key={index.toString()} style={styles.item}>
              <Rectangle
                testID={`item-${index + 1}`}
                color={Colors.RedDark100}
                width={'100%'}
                height={96}
              />
            </View>
          ))}
        </ScrollView>
      </ScrollViewMarker>
    </View>
  );
}

const styles = StyleSheet.create({
  fillParent: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  item: {
    width: '100%',
    marginBottom: 12,
  },
});

export default createScenario(TestStackSvmLiftOnScroll, scenarioDescription);
