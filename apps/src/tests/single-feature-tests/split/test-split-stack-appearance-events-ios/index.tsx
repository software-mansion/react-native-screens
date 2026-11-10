import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Split } from 'react-native-screens';
import type { SplitHostCommands } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { StackContainer } from '@apps/shared/containers/stack';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';
import { Colors } from '@apps/shared/styling';
import { SafeAreaView } from 'react-native-screens/experimental';

type Log = (message: string) => void;

const appearanceEvents = (name: string, log: Log) => ({
  onWillAppear: () => log(`${name} willAppear`),
  onDidAppear: () => log(`${name} didAppear`),
  onWillDisappear: () => log(`${name} willDisappear`),
  onDidDisappear: () => log(`${name} didDisappear`),
});

function TestSplitStackAppearanceEvents() {
  const hostRef = React.useRef<SplitHostCommands>(null);
  const [events, setEvents] = React.useState<string[]>([]);
  const log = React.useCallback<Log>(message => {
    setEvents(current => [...current, message]);
  }, []);

  return (
    <Split.Host ref={hostRef} preferredDisplayMode="oneBesideSecondary">
      <Split.Column {...appearanceEvents('Primary SplitColumn', log)}>
        <StackContainer
          routeConfigs={[
            {
              name: 'Primary StackHost root',
              element: (
                <Screen
                  title="Primary StackHost root"
                  next="Primary StackHost pushed"
                />
              ),
              options: {
                ...appearanceEvents('Primary StackHost root', log),
                headerConfig: { title: 'Primary StackHost root' },
              },
            },
            {
              name: 'Primary StackHost pushed',
              element: <Screen title="Primary StackHost pushed" />,
              options: {
                ...appearanceEvents('Primary StackHost pushed', log),
                headerConfig: { title: 'Primary StackHost pushed' },
              },
            },
          ]}
        />
      </Split.Column>
      <Split.Column {...appearanceEvents('Secondary SplitColumn', log)}>
        <SafeAreaView edges={{ left: true }} style={styles.secondary}>
          <Button
            title="Hide primary"
            onPress={() => hostRef.current?.hide('primary')}
          />
          <Button
            title="Show primary"
            onPress={() => hostRef.current?.show('primary')}
          />
          <Button title="Clear log" onPress={() => setEvents([])} />
          <ScrollView
            style={styles.log}
            contentContainerStyle={styles.logContent}>
            {events.map((event, index) => (
              <Text key={index} style={styles.logLine}>
                {event}
              </Text>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Split.Column>
    </Split.Host>
  );
}

function Screen({ title, next }: { title: string; next?: string }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{title}</Text>
      <StackNavigationButtons
        routeNames={next != null ? [next] : []}
        isPopEnabled={next == null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.YellowLight100,
  },
  secondary: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 12,
    gap: 12,
    backgroundColor: Colors.GreenLight100,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  log: {
    flex: 1,
    alignSelf: 'stretch',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: Colors.White,
  },
  logContent: {
    padding: 12,
  },
  logLine: {
    fontSize: 13,
  },
});

export default createScenario(
  TestSplitStackAppearanceEvents,
  scenarioDescription,
);
