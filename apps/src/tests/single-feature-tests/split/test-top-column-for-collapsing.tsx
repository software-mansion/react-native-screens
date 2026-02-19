import React from 'react';
import { Scenario } from '../../shared/helpers';
import { Split } from 'react-native-screens/experimental';
import { StyleSheet, Text, View } from 'react-native';

const SCENARIO: Scenario = {
  name: 'Prop: topColumnForCollapsing',
  key: 'test-split-top-column-for-collapsing',
  details: `
    Test the topColumnForCollapsing prop in Split component.
    Modification of this prop requires app restart.
  `,
  platforms: ['ios'],
  AppComponent: App,
};

export default SCENARIO;

export function App() {
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
