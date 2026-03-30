import React from 'react';
import { Scenario } from '../../shared/helpers';
import { SplitView, SplitScreen, SplitHostCommands } from 'react-native-screens/experimental';
import { Button, StyleSheet, Text, View } from 'react-native';

const SCENARIO: Scenario = {
  name: 'Command: showColumn',
  key: 'test-command-show-column',
  platforms: ['ios'],
  AppComponent: App,
};

export default SCENARIO;

export function App() {
  const hostRef = React.useRef<SplitHostCommands>(null);

  return (
    <SplitView ref={hostRef}>
      <SplitView.Primary>
        <SplitScreen screenKey="primary" activityMode="attached">
          <ColumnContent columnTitle="Primary column" hostRef={hostRef} />
        </SplitScreen>
      </SplitView.Primary>
      <SplitView.Supplementary>
        <SplitScreen screenKey="supplementary" activityMode="attached">
          <ColumnContent columnTitle="Supplementary column" hostRef={hostRef} />
        </SplitScreen>
      </SplitView.Supplementary>
      <SplitView.Secondary>
        <SplitScreen screenKey="secondary" activityMode="attached">
          <ColumnContent columnTitle="Secondary column" hostRef={hostRef} />
        </SplitScreen>
      </SplitView.Secondary>
    </SplitView>
  );
}

function ColumnContent(props: {
  columnTitle: string;
  hostRef: React.RefObject<SplitHostCommands | null>;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.columnTitle}>{props.columnTitle}</Text>
      <Button
        title="Show primary"
        onPress={() => props.hostRef.current?.show('primary')}
      />
      <Button
        title="Show secondary"
        onPress={() => props.hostRef.current?.show('secondary')}
      />
      <Button
        title="Show supplementary"
        onPress={() => props.hostRef.current?.show('supplementary')}
      />
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
