import React, { useState, type PropsWithChildren } from 'react';
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
const RECT_COLORS = Array.from({ length: 14 }, () => generateNextColor());

/**
 * Stands in for a list or keyboard-aware component that renders its ScrollView
 * below its own container views instead of returning it directly.
 */
function WrappedScrollView({ children }: PropsWithChildren) {
  return (
    // collapsable={false} keeps these views in the native hierarchy. Without it
    // React Native flattens them away and the ScrollView ends up as the
    // marker's direct child again, which is the case that already worked.
    // Real wrappers are native components (for example
    // ClippingScrollViewDecoratorView) and are never flattened.
    <View collapsable={false} style={styles.fillParent}>
      <View collapsable={false} style={styles.fillParent}>
        <ScrollView
          style={styles.fillParent}
          contentInsetAdjustmentBehavior="automatic">
          {children}
        </ScrollView>
      </View>
    </View>
  );
}

function TestSvmNestedScrollView() {
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
      <Text>ScrollView nested below the marker's child</Text>
      <ScrollViewMarker
        style={[styles.fillParent]}
        scrollEdgeEffects={{ top: topEdgeEffect }}>
        <WrappedScrollView>
          {RECT_COLORS.map((color, index) => {
            return (
              <Rectangle key={index} color={color} width={'100%'} height={96} />
            );
          })}
        </WrappedScrollView>
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
    <View style={styles.selectorBar}>
      {TOP_EDGE_EFFECTS.map(effect => {
        const selected = effect === value;
        return (
          <Pressable
            key={effect}
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

export default createScenario(TestSvmNestedScrollView, scenarioDescription);
