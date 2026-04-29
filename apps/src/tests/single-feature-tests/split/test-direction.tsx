import React, { useState } from 'react';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import { Split } from 'react-native-screens/experimental';
import { StyleSheet, Text, View, Button } from 'react-native';

const scenarioDescription: ScenarioDescription = {
  name: 'Prop: layoutDirection',
  key: 'test-split-layout-direction',
  details: `
    Test the direction prop in Split component.
  `,
  platforms: ['ios'],
};

type LayoutDirection = 'ltr' | 'rtl' | 'inherit';

export function App() {
  const [direction, setDirection] = useState<LayoutDirection>('inherit');

  return (
    <Split.Host direction={direction}>
      <Split.Column>
        <ColumnContent
          columnTitle="Primary column"
          currentDirection={direction}
          onChangeDirection={setDirection}
        />
      </Split.Column>
      <Split.Column>
        <ColumnContent columnTitle="Supplementary column" />
      </Split.Column>
      <Split.Column>
        <ColumnContent columnTitle="Secondary column" />
      </Split.Column>
    </Split.Host>
  );
}

export function ColumnContent(props: {
  columnTitle: string;
  currentDirection?: LayoutDirection;
  onChangeDirection?: (dir: LayoutDirection) => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.columnTitle}>{props.columnTitle}</Text>

      {props.onChangeDirection && (
        <View style={styles.controlPanel}>
          <Text style={styles.statusText}>
            Current direction:{' '}
            <Text style={styles.bold}>{props.currentDirection}</Text>
          </Text>

          <View style={styles.buttonRow}>
            <Button
              title="LTR"
              onPress={() => props.onChangeDirection?.('ltr')}
            />
            <Button
              title="RTL"
              onPress={() => props.onChangeDirection?.('rtl')}
            />
            <Button
              title="INHERIT"
              onPress={() => props.onChangeDirection?.('inherit')}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  controlPanel: {
    marginTop: 20,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    marginBottom: 12,
  },
  bold: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
});

export default createScenario(App, scenarioDescription);
