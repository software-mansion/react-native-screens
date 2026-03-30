import React from 'react';
import { Scenario } from '../../shared/helpers';
import { SplitView, SplitScreen } from 'react-native-screens/experimental';
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
    <SplitView topColumnForCollapsing="supplementary">
      <SplitView.Primary>
        <SplitScreen screenKey="primary" activityMode="attached">
          <ColumnContent columnTitle="Primary column" />
        </SplitScreen>
      </SplitView.Primary>
      <SplitView.Supplementary>
        <SplitScreen screenKey="supplementary" activityMode="attached">
          <ColumnContent columnTitle="Supplementary column" />
        </SplitScreen>
      </SplitView.Supplementary>
      <SplitView.Secondary>
        <SplitScreen screenKey="secondary" activityMode="attached">
          <ColumnContent columnTitle="Secondary column" />
        </SplitScreen>
      </SplitView.Secondary>
    </SplitView>
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
