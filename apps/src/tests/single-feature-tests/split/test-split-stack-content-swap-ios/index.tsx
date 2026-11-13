import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Split } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { StackContainer } from '@apps/shared/containers/stack';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';
import { Colors } from '@apps/shared/styling';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';
import { SafeAreaView } from 'react-native-screens/experimental';

type Content = 'plain' | 'stackA' | 'stackB';

function TestSplitStackContentSwap() {
  const [content, setContent] = React.useState<Content>('plain');
  const [events, setEvents] = React.useState<string[]>([]);
  const log = React.useCallback((message: string) => {
    setEvents(current => [...current, message]);
  }, []);

  return (
    <Split.Host preferredDisplayMode="oneBesideSecondary">
      <Split.Column>
        <SafeAreaView edges={{ top: true }} style={styles.controls}>
          <Text style={styles.title}>Secondary content: {content}</Text>
          <Button title="Plain view" onPress={() => setContent('plain')} />
          <Button title="Stack A" onPress={() => setContent('stackA')} />
          <Button title="Stack B" onPress={() => setContent('stackB')} />
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
      <Split.Column
        onWillAppear={() => log('Secondary willAppear')}
        onDidAppear={() => log('Secondary didAppear')}
        onWillDisappear={() => log('Secondary willDisappear')}
        onDidDisappear={() => log('Secondary didDisappear')}>
        {content === 'plain' ? (
          <View style={[styles.screen, styles.plain]}>
            <Text style={styles.title}>Plain view</Text>
            <PressableWithFeedback style={styles.pressable} />
          </View>
        ) : (
          <ColumnStack
            key={content}
            name={content === 'stackA' ? 'Stack A' : 'Stack B'}
            color={
              content === 'stackA' ? Colors.YellowLight100 : Colors.BlueLight100
            }
          />
        )}
      </Split.Column>
    </Split.Host>
  );
}

function ColumnStack({ name, color }: { name: string; color: string }) {
  const root = `${name} root`;
  const pushed = `${name} pushed`;

  return (
    <StackContainer
      routeConfigs={[
        {
          name: root,
          element: <Screen title={root} color={color} next={pushed} />,
          options: { headerConfig: { title: root } },
        },
        {
          name: pushed,
          element: <Screen title={pushed} color={color} />,
          options: { headerConfig: { title: pushed } },
        },
      ]}
    />
  );
}

function Screen({
  title,
  color,
  next,
}: {
  title: string;
  color: string;
  next?: string;
}) {
  return (
    <View style={[styles.screen, { backgroundColor: color }]}>
      <Text style={styles.title}>{title}</Text>
      <PressableWithFeedback style={styles.pressable} />
      <StackNavigationButtons
        routeNames={next != null ? [next] : []}
        isPopEnabled={next == null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.White,
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  plain: {
    backgroundColor: Colors.GreenLight100,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pressable: {
    width: 200,
    height: 100,
  },
  log: {
    flex: 1,
    alignSelf: 'stretch',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: Colors.GreenLight100,
  },
  logContent: {
    padding: 12,
  },
  logLine: {
    fontSize: 13,
  },
});

export default createScenario(TestSplitStackContentSwap, scenarioDescription);
