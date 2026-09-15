import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tabs, type TabsHostNavStateRequest } from 'react-native-screens';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

function createTeamLoader() {
  let promise: Promise<void> | null = null;

  return () => {
    promise ??= new Promise(resolve => {
      setTimeout(resolve, 3000);
    });

    return promise;
  };
}

function TeamScreen({ loadTeam }: { loadTeam: () => Promise<void> }) {
  React.use(loadTeam());

  return (
    <CenteredLayoutView testID="team-screen">
      <Text style={styles.heading}>Team loaded</Text>
    </CenteredLayoutView>
  );
}

function TestTabsSuspenseAndroid() {
  const [loadTeam] = React.useState(createTeamLoader);
  const [navStateRequest, setNavStateRequest] =
    React.useState<TabsHostNavStateRequest>({
      selectedScreenKey: 'Catalog',
      baseProvenance: 0,
    });

  return (
    <React.Suspense
      fallback={
        <CenteredLayoutView testID="tabs-suspense-fallback">
          <Text style={styles.heading}>Loading Team…</Text>
          <Text style={styles.description}>
            The tabs container is detached.
          </Text>
        </CenteredLayoutView>
      }>
      <View style={styles.container}>
        <Tabs.Host
          navStateRequest={navStateRequest}
          onTabSelected={event => {
            setNavStateRequest({
              selectedScreenKey: event.nativeEvent.selectedScreenKey,
              baseProvenance: event.nativeEvent.provenance,
            });
          }}>
          <Tabs.Screen
            screenKey="Catalog"
            title="Catalog"
            tabBarItemTestID="suspense-tab-catalog">
            {navStateRequest.selectedScreenKey === 'Catalog' ? (
              <CenteredLayoutView testID="catalog-screen">
                <Text style={styles.heading}>Catalog</Text>
                <Text style={styles.description}>
                  Tap the Team tab to suspend the entire tabs container.
                </Text>
              </CenteredLayoutView>
            ) : null}
          </Tabs.Screen>
          <Tabs.Screen
            screenKey="Team"
            title="Team"
            tabBarItemTestID="suspense-tab-team">
            {navStateRequest.selectedScreenKey === 'Team' ? (
              <TeamScreen loadTeam={loadTeam} />
            ) : null}
          </Tabs.Screen>
        </Tabs.Host>
      </View>
    </React.Suspense>
  );
}

export default createScenario(TestTabsSuspenseAndroid, scenarioDescription);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    marginTop: 8,
    textAlign: 'center',
  },
});
