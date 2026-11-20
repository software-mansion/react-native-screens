import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Split } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { StackContainer } from '@apps/shared/containers/stack';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';
import { Colors } from '@apps/shared/styling';

function TestSplitStackColumnLayoutAfterCollapse() {
  return (
    <Split.Host preferredDisplayMode="twoBesideSecondary">
      <Split.Column>
        <SizeProbe name="Primary" color={Colors.NavyLight20} />
      </Split.Column>
      <Split.Column>
        <ColumnStack
          name="Supplementary"
          colors={[Colors.RedLight40, Colors.RedLight60]}
        />
      </Split.Column>
      <Split.Column>
        <ColumnStack
          name="Secondary"
          colors={[Colors.YellowLight40, Colors.YellowLight60]}
        />
      </Split.Column>
    </Split.Host>
  );
}

// A stack that navigates the column, with two screens.
function ColumnStack({
  name,
  colors,
}: {
  name: string;
  colors: [string, string];
}) {
  const root = `${name} root`;
  const pushed = `${name} pushed`;

  return (
    <StackContainer
      routeConfigs={[
        {
          name: root,
          element: (
            <SizeProbe name={root} color={colors[0]}>
              <StackNavigationButtons
                routeNames={[pushed]}
                isPopEnabled={false}
              />
            </SizeProbe>
          ),
          options: { headerConfig: { title: root } },
        },
        {
          name: pushed,
          element: (
            <SizeProbe name={pushed} color={colors[1]}>
              <StackNavigationButtons routeNames={[]} isPopEnabled={true} />
            </SizeProbe>
          ),
          options: { headerConfig: { title: pushed } },
        },
      ]}
    />
  );
}

type Size = { width: number; height: number };

function formatSize({ width, height }: Size) {
  return `${Math.round(width)} × ${Math.round(height)}`;
}

// Fills its parent and prints its size next to the size of the window.
function SizeProbe({
  name,
  color,
  children,
}: {
  name: string;
  color: string;
  children?: React.ReactNode;
}) {
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
      {children}
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
  TestSplitStackColumnLayoutAfterCollapse,
  scenarioDescription,
);
