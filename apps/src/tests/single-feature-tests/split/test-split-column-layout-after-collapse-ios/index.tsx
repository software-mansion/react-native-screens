import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Split } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

function TestSplitColumnLayoutAfterCollapse() {
  return (
    <Split.Host preferredDisplayMode="twoBesideSecondary">
      <Split.Column>
        <SizeProbe name="Primary" color={Colors.NavyLight20} />
      </Split.Column>
      <Split.Column>
        <SizeProbe name="Supplementary" color={Colors.RedLight40} />
      </Split.Column>
      <Split.Column>
        <SizeProbe name="Secondary" color={Colors.YellowLight40} />
      </Split.Column>
    </Split.Host>
  );
}

type Size = { width: number; height: number };

function formatSize({ width, height }: Size) {
  return `${Math.round(width)} × ${Math.round(height)}`;
}

// Fills its parent and prints its size next to the size of the window.
function SizeProbe({ name, color }: { name: string; color: string }) {
  const windowSize = useWindowDimensions();
  const [size, setSize] = React.useState<Size | null>(null);

  return (
    <View
      style={[styles.probe, { backgroundColor: color }]}
      onLayout={event => {
        const { width, height } = event.nativeEvent.layout;
        setSize({ width, height });
      }}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.size}>{size != null ? formatSize(size) : '…'}</Text>
      <Text style={styles.caption}>window {formatSize(windowSize)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  probe: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.NavyDark140,
  },
  size: {
    fontSize: 34,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
    color: Colors.NavyDark140,
  },
  caption: {
    fontSize: 16,
    fontVariant: ['tabular-nums'],
    color: Colors.NavyDark100,
  },
});

export default createScenario(
  TestSplitColumnLayoutAfterCollapse,
  scenarioDescription,
);
