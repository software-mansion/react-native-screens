import React, { useState } from 'react';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { type ScrollEdgeEffect, ScrollViewMarker } from 'react-native-screens';
import { StackContainer } from '@apps/shared/containers/stack';
import { Rectangle } from '@apps/shared/Rectangle';
import { Colors } from '@apps/shared/styling';
import { generateNextColor } from '@apps/shared/utils/color-generator';

const TOP_EDGE_EFFECTS: ScrollEdgeEffect[] = [
  'automatic',
  'hard',
  'soft',
  'hidden',
];

// Taken once at module scope so the colors stay stable across re-renders
// (generateNextColor advances a global counter on every call).
const RECT_COLORS = Array.from({ length: 12 }, () => generateNextColor());

function TestSvmConfiguresScrollView() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Content',
          element: <ContentScreen />,
        },
      ]}
    />
  );
}

function ContentScreen() {
  const [topEdgeEffect, setTopEdgeEffect] = useState<ScrollEdgeEffect>('hard');

  return (
    <View
      style={[
        styles.container,
        styles.fillParent,
        { backgroundColor: Colors.White },
      ]}>
      <Text>Interrupt "first descendant chain" heuristic</Text>
      <ScrollViewMarker
        style={[styles.fillParent]}
        scrollEdgeEffects={{ top: topEdgeEffect }}>
        <ScrollView
          style={[styles.fillParent]}
          contentContainerStyle={styles.scrollContent}
          contentInsetAdjustmentBehavior="automatic">
          {RECT_COLORS.map((color, index) => {
            return (
              <Rectangle key={index} color={color} width={'100%'} height={96} />
            );
          })}
        </ScrollView>
      </ScrollViewMarker>
      <TopEdgeEffectSelector
        value={topEdgeEffect}
        onValueChange={setTopEdgeEffect}
      />
    </View>
  );
}

function TopEdgeEffectSelector({
  value,
  onValueChange,
}: {
  value: ScrollEdgeEffect;
  onValueChange: (value: ScrollEdgeEffect) => void;
}) {
  return (
    <View style={styles.selectorBar} testID="top-edge-effect-selector">
      {TOP_EDGE_EFFECTS.map(effect => {
        const selected = effect === value;
        return (
          <Pressable
            key={effect}
            testID={`top-edge-effect-${effect}`}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onValueChange(effect)}
            style={[styles.chip, selected && styles.chipSelected]}>
            <Text
              style={[styles.chipText, selected && styles.chipTextSelected]}>
              {effect}
            </Text>
          </Pressable>
        );
      })}
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
  scrollContent: {
    // Keep the last rectangles reachable above the floating selector bar.
    paddingBottom: 96,
  },
  // Floating pill above the bottom edge, so it does not affect the layout
  // of the marker and its ScrollView.
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

export default createScenario(TestSvmConfiguresScrollView, scenarioDescription);
