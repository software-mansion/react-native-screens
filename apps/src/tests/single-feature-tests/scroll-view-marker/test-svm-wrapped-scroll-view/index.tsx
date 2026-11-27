import React, { useState } from 'react';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  Pressable,
  ScrollView as RNScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  GestureHandlerRootView,
  ScrollView as GHScrollView,
} from 'react-native-gesture-handler';
import { ScrollViewMarker } from 'react-native-screens';
import { StackContainer } from '@apps/shared/containers/stack';
import { Rectangle } from '@apps/shared/Rectangle';
import { Colors } from '@apps/shared/styling';
import { generateNextColor } from '@apps/shared/utils/color-generator';

type Variant = 'gesture-handler' | 'view-wrapper';

const VARIANTS: Variant[] = ['gesture-handler', 'view-wrapper'];

// Taken once at module scope so the colors stay stable across re-renders
// (generateNextColor advances a global counter on every call).
const RECT_COLORS = Array.from({ length: 14 }, () => generateNextColor());

function TestSvmWrappedScrollView() {
  return (
    <GestureHandlerRootView style={styles.fillParent}>
      <StackContainer
        routeConfigs={[
          {
            name: 'Content',
            element: <ContentScreen />,
          },
        ]}
      />
    </GestureHandlerRootView>
  );
}

function ContentScreen() {
  const [variant, setVariant] = useState<Variant>('gesture-handler');

  const content = RECT_COLORS.map((color, index) => (
    <Rectangle key={index} color={color} width={'100%'} height={96} />
  ));

  return (
    <View
      style={[
        styles.container,
        styles.fillParent,
        { backgroundColor: Colors.White },
      ]}>
      <Text>Interrupt "first descendant chain" heuristic</Text>
      <ScrollViewMarker
        key={variant}
        style={styles.fillParent}
        scrollEdgeEffects={{ top: 'hard' }}>
        {variant === 'gesture-handler' ? (
          <GHScrollView
            style={styles.fillParent}
            contentInsetAdjustmentBehavior="automatic">
            {content}
          </GHScrollView>
        ) : (
          <View collapsable={false} style={styles.fillParent}>
            <RNScrollView
              style={styles.fillParent}
              contentInsetAdjustmentBehavior="automatic">
              {content}
            </RNScrollView>
          </View>
        )}
      </ScrollViewMarker>
      <View style={styles.selectorBar}>
        {VARIANTS.map(item => {
          const selected = item === variant;
          return (
            <Pressable
              key={item}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setVariant(item)}
              style={[styles.chip, selected && styles.chipSelected]}>
              <Text
                style={[styles.chipText, selected && styles.chipTextSelected]}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>
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
  selectorBar: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
    padding: 6,
    borderRadius: 24,
    backgroundColor: Colors.NavyLight20,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
  },
  chipSelected: {
    backgroundColor: Colors.NavyLight100,
  },
  chipText: {
    color: Colors.NavyLight100,
  },
  chipTextSelected: {
    color: Colors.White,
    fontWeight: 'bold',
  },
});

export default createScenario(TestSvmWrappedScrollView, scenarioDescription);
