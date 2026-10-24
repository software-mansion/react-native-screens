import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-screens/experimental';
import { Colors } from '@apps/shared/styling';

const BAR_HEIGHT = 64;
const BAR_MARGIN = 8;

export const FLOATING_BAR_INSET = BAR_HEIGHT + 2 * BAR_MARGIN;

export const CONTENT_MODES = ['List', 'SafeAreaView'] as const;
export type ContentMode = (typeof CONTENT_MODES)[number];

function ListRows() {
  return (
    <>
      {Array.from({ length: 30 }, (_, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.rowText}>Row {index + 1}</Text>
        </View>
      ))}
      <View style={[styles.row, styles.lastRow]}>
        <Text style={styles.rowText}>Last row</Text>
      </View>
    </>
  );
}

type ContentProps = {
  topEdge?: boolean;
};

export function InsetsListContent({ topEdge = true }: ContentProps) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      testID="additional-insets-scroll-view">
      {Platform.OS === 'android' ? (
        <SafeAreaView edges={{ top: topEdge, bottom: true }}>
          <ListRows />
        </SafeAreaView>
      ) : (
        <ListRows />
      )}
    </ScrollView>
  );
}

function SafeAreaContextInsets() {
  const insets = useSafeAreaInsets();
  return (
    <Text style={styles.rowText} testID="additional-insets-context-insets">
      useSafeAreaInsets: top {Math.round(insets.top)}, bottom{' '}
      {Math.round(insets.bottom)}
    </Text>
  );
}

export function InsetsSafeAreaViewContent({ topEdge = true }: ContentProps) {
  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView
        edges={{ top: topEdge, bottom: true, left: true, right: true }}
        style={styles.container}>
        <View style={styles.safeAreaContent}>
          <Text style={styles.rowText}>
            The red border fills the SafeAreaView. Its bottom edge stays above
            the floating bar when the insets are on.
          </Text>
          <View style={styles.contextInsets}>
            <SafeAreaContextInsets />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

type FloatingBarProps = {
  selectedMode: ContentMode;
  onSelectMode: (mode: ContentMode) => void;
  insetsEnabled: boolean;
  onToggleInsets: () => void;
};

export function FloatingBar({
  selectedMode,
  onSelectMode,
  insetsEnabled,
  onToggleInsets,
}: FloatingBarProps) {
  return (
    <SafeAreaView
      edges={{ bottom: true, left: true, right: true }}
      style={styles.barContainer}
      pointerEvents="box-none">
      <View style={styles.bar}>
        {CONTENT_MODES.map(mode => (
          <Pressable
            key={mode}
            testID={`additional-insets-tab-${mode}`}
            onPress={() => onSelectMode(mode)}
            style={[
              styles.barItem,
              mode === selectedMode && styles.barItemSelected,
            ]}>
            <Text style={styles.barText}>{mode}</Text>
          </Pressable>
        ))}
        <Pressable
          testID="additional-insets-toggle"
          onPress={onToggleInsets}
          style={styles.barItem}>
          <Text style={styles.barText}>
            Insets: {insetsEnabled ? 'on' : 'off'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.cardBorder,
  },
  lastRow: {
    backgroundColor: Colors.GreenLight40,
  },
  rowText: {
    fontSize: 16,
  },
  safeAreaContent: {
    flex: 1,
    padding: 16,
    borderWidth: 6,
    borderColor: Colors.RedLight100,
  },
  contextInsets: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  bar: {
    height: BAR_HEIGHT,
    margin: BAR_MARGIN,
    borderRadius: BAR_HEIGHT / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    backgroundColor: Colors.PurpleLight80,
    opacity: 0.9,
  },
  barItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  barItemSelected: {
    backgroundColor: Colors.PurpleLight40,
  },
  barText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
