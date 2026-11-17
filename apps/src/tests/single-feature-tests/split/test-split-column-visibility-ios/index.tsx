import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Split } from 'react-native-screens';
import type { SplitDisplayMode, SplitHostCommands } from 'react-native-screens';
import { SafeAreaView } from 'react-native-screens/experimental';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

export function TestSplitColumnVisibility() {
  const hostRef = React.useRef<SplitHostCommands>(null);
  const [preferredDisplayMode, setPreferredDisplayMode] = React.useState<
    SplitDisplayMode | undefined
  >('oneBesideSecondary');
  const [lastDisplayMode, setLastDisplayMode] = React.useState('not reported');
  const [eventCount, setEventCount] = React.useState(0);
  const [dark, setDark] = React.useState(false);
  const [generation, setGeneration] = React.useState(0);
  const pendingShow = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (pendingShow.current !== null) {
        clearTimeout(pendingShow.current);
      }
    };
  }, [generation]);

  const rapidHideShow = () => {
    if (pendingShow.current !== null) {
      clearTimeout(pendingShow.current);
    }
    hostRef.current?.hide('primary');
    pendingShow.current = setTimeout(() => {
      hostRef.current?.show('primary');
      pendingShow.current = null;
    }, 100);
  };

  return (
    <Split.Host
      key={generation}
      ref={hostRef}
      preferredDisplayMode={preferredDisplayMode}
      colorScheme={dark ? 'dark' : 'light'}
      displayModeButtonVisibility="always"
      onDisplayModeWillChange={event => {
        setLastDisplayMode(event.nativeEvent.nextDisplayMode);
        setEventCount(count => count + 1);
      }}>
      <Split.Column>
        <View style={[styles.column, styles.primary]}>
          <Text style={styles.title} testID="primary-column">
            Primary column
          </Text>
          <Button
            title="Hide primary"
            testID="hide-primary-from-primary"
            onPress={() => hostRef.current?.hide('primary')}
          />
          <Button
            title="Show secondary"
            testID="show-secondary"
            onPress={() => hostRef.current?.show('secondary')}
          />
        </View>
      </Split.Column>
      <Split.Column>
        <SafeAreaView
          style={styles.secondary}
          edges={{ left: true, right: true }}>
          <ScrollView contentContainerStyle={styles.controls}>
            <Text style={styles.title}>Secondary column</Text>
            <Text testID="display-mode">
              Last display mode: {lastDisplayMode}
            </Text>
            <Text testID="display-mode-events">
              Display mode events: {eventCount}
            </Text>
            <Text>Preference: {preferredDisplayMode ?? 'unset'}</Text>
            <Button
              title="Hide primary"
              testID="hide-primary"
              onPress={() => hostRef.current?.hide('primary')}
            />
            <Button
              title="Show primary"
              testID="show-primary"
              onPress={() => hostRef.current?.show('primary')}
            />
            <Button
              title="Rapid hide/show"
              testID="rapid-hide-show"
              onPress={rapidHideShow}
            />
            <Button
              title="Prefer automatic"
              onPress={() => setPreferredDisplayMode('automatic')}
            />
            <Button
              title="Remove preference"
              onPress={() => setPreferredDisplayMode(undefined)}
            />
            <Button
              title="Prefer secondary only"
              onPress={() => setPreferredDisplayMode('secondaryOnly')}
            />
            <Button
              title="Prefer both columns"
              onPress={() => setPreferredDisplayMode('oneBesideSecondary')}
            />
            <Button
              title="Toggle color scheme"
              onPress={() => setDark(value => !value)}
            />
            <Button
              title="Remount split"
              onPress={() => setGeneration(value => value + 1)}
            />
          </ScrollView>
        </SafeAreaView>
      </Split.Column>
    </Split.Host>
  );
}

const styles = StyleSheet.create({
  column: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  primary: { backgroundColor: '#d6eaff' },
  secondary: { backgroundColor: '#ffffff' },
  controls: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
});

export default createScenario(TestSplitColumnVisibility, scenarioDescription);
