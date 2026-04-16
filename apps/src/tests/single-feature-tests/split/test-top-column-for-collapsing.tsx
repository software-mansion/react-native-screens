import React from 'react';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { Split } from 'react-native-screens/experimental';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <Split.Host topColumnForCollapsing="supplementary">
      <Split.Column>
        <ColumnContent columnTitle="Primary column" />
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

function ColumnContent(props: { columnTitle: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.columnTitle}>{props.columnTitle}</Text>
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
});

App.scenarioDescription = {
  name: 'Prop: topColumnForCollapsing',
  key: 'test-split-top-column-for-collapsing',
  details: `
    Test the topColumnForCollapsing prop in Split component.
    Modification of this prop requires app restart.
  `,
  platforms: ['ios'],
} as ScenarioDescription;
