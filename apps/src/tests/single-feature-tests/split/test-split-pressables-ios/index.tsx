import React from 'react';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Split } from 'react-native-screens';
import { StyleSheet, Text, View } from 'react-native';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';

function TestSplitPressables() {
  return (
    <Split.Host preferredDisplayMode="oneBesideSecondary">
      <Split.Column>
        <ColumnContent column="primary" columnTitle="Primary column" />
      </Split.Column>
      <Split.Column>
        <ColumnContent
          column="supplementary"
          columnTitle="Supplementary column"
        />
      </Split.Column>
      <Split.Column>
        <ColumnContent column="secondary" columnTitle="Secondary column" />
      </Split.Column>
    </Split.Host>
  );
}

function ColumnContent(props: {
  column: 'primary' | 'supplementary' | 'secondary';
  columnTitle: string;
}) {
  return (
    <View style={styles.container}>
      <PressableWithFeedback style={styles.pressable}>
        <Text style={styles.columnTitle}>{props.columnTitle}</Text>
      </PressableWithFeedback>
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
  pressable: {
    height: 150,
    width: 200,
  },
  columnTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default createScenario(TestSplitPressables, scenarioDescription);
