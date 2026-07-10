import React from 'react';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Split, SplitHostCommands } from 'react-native-screens/experimental';
import { StyleSheet, Text, View } from 'react-native';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';

function TestSplitPressables() {
  const hostRef = React.useRef<SplitHostCommands>(null);

  return (
    <Split.Host preferredDisplayMode="oneBesideSecondary" ref={hostRef}>
      <Split.Column>
        <ColumnContent column="primary" columnTitle="Primary column" hostRef={hostRef} />
      </Split.Column>
      <Split.Column>
        <ColumnContent
          column="supplementary"
          columnTitle="Supplementary column"
          hostRef={hostRef}
        />
      </Split.Column>
      <Split.Column>
        <ColumnContent column="secondary" columnTitle="Secondary column" hostRef={hostRef} />
      </Split.Column>
    </Split.Host>
  );
}

function ColumnContent(props: {
  column: 'primary' | 'supplementary' | 'secondary';
  columnTitle: string;
  hostRef: React.RefObject<SplitHostCommands | null>;
}) {
  const onPress =
    props.column === 'primary'
      ? undefined
      : () => props.hostRef.current?.show('primary');

  return (
    <View style={styles.container}>
      <PressableWithFeedback style={styles.pressable} onPress={onPress}>
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
