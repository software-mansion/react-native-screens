import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Split, SplitHostCommands } from 'react-native-screens';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

type ScreenState = { key: string; activityMode: 'attached' | 'detached' };

function TestSplitEmptyStackColumns() {
  const hostRef = React.useRef<SplitHostCommands>(null);
  const nextId = React.useRef(1);
  const [details, setDetails] = React.useState<ScreenState[]>([]);
  const [inspectorAttached, setInspectorAttached] = React.useState(false);
  const [showInspector, setShowInspector] = React.useState(false);
  const [dismissals, setDismissals] = React.useState(0);

  const selectDetail = () => {
    const key = `detail-${nextId.current++}`;
    setDetails(state => [...state, { key, activityMode: 'attached' }]);
  };

  const clearDetails = () => {
    hostRef.current?.show('primary');
    setDetails(state =>
      state.map(screen => ({ ...screen, activityMode: 'detached' })),
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <Text testID="empty-column-state">
          Details: {details.length}; dismissals: {dismissals}
        </Text>
        <View style={styles.row}>
          <Button title="Select detail" onPress={selectDetail} />
          <Button
            title="Show detail"
            onPress={() => hostRef.current?.show('secondary')}
          />
          <Button
            title="Show list"
            onPress={() => hostRef.current?.show('primary')}
          />
        </View>
        <View style={styles.row}>
          <Button title="Clear details" onPress={clearDetails} />
          <Button
            title="Unmount details"
            onPress={() => {
              hostRef.current?.show('primary');
              setDetails([]);
            }}
          />
        </View>
        <View style={styles.row}>
          <Button
            title={inspectorAttached ? 'Clear inspector' : 'Populate inspector'}
            onPress={() => setInspectorAttached(value => !value)}
          />
          <Button
            title="Toggle inspector"
            onPress={() => setShowInspector(value => !value)}
          />
        </View>
      </View>
      <Split.Host
        ref={hostRef}
        preferredDisplayMode="oneBesideSecondary"
        preferredSplitBehavior="tile"
        topColumnForCollapsing="primary"
        showInspector={showInspector}
        onInspectorHide={() => setShowInspector(false)}>
        <Split.Column>
          <Split.Stack>
            <Split.Screen screenKey="list" activityMode="attached">
              <Split.HeaderConfig title="List" />
              <View style={[styles.content, styles.list]}>
                <Text testID="empty-column-list">List</Text>
                <Text>Select a detail, then show its column.</Text>
              </View>
            </Split.Screen>
          </Split.Stack>
        </Split.Column>
        <Split.Column>
          <Split.Stack>
            {details.map(screen => (
              <Split.Screen
                key={screen.key}
                screenKey={screen.key}
                activityMode={screen.activityMode}
                onDismiss={() => {
                  setDetails(state =>
                    state.filter(item => item.key !== screen.key),
                  );
                  setDismissals(value => value + 1);
                }}>
                <Split.HeaderConfig title={screen.key} />
                <View style={[styles.content, styles.detail]}>
                  <Text testID={`empty-column-${screen.key}`}>
                    {screen.key}
                  </Text>
                </View>
              </Split.Screen>
            ))}
          </Split.Stack>
        </Split.Column>
        <Split.Inspector
          screenKey="inspector"
          activityMode={inspectorAttached ? 'attached' : 'detached'}>
          <Split.HeaderConfig title="Inspector" />
          <View style={[styles.content, styles.inspector]}>
            <Text testID="empty-column-inspector">Inspector</Text>
          </View>
        </Split.Inspector>
      </Split.Host>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  controls: { paddingTop: 60, paddingBottom: 8, backgroundColor: 'white' },
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { backgroundColor: '#dbeafe' },
  detail: { backgroundColor: '#dcfce7' },
  inspector: { backgroundColor: '#fef3c7' },
});

export default createScenario(TestSplitEmptyStackColumns, scenarioDescription);
