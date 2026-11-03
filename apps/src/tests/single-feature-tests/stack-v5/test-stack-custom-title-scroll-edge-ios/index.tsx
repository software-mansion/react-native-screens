import React, { type ComponentRef, useRef, useState } from 'react';
import {
  Button,
  PlatformColor,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScrollViewMarker, Stack } from 'react-native-screens';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

const TITLE = 'Scroll edge title';

function TestStackCustomTitleScrollEdgeIOS() {
  const [custom, setCustom] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);

  return (
    <Stack.Host>
      <Stack.Screen screenKey="title-scroll-edge" activityMode="attached">
        <View style={styles.container}>
          <ScrollViewMarker style={styles.container}>
            <ScrollView
              ref={scrollRef}
              contentInsetAdjustmentBehavior="automatic"
              style={styles.container}>
              {Array.from({ length: 40 }, (_, index) => (
                <View
                  key={index}
                  style={[
                    styles.row,
                    index % 2 === 0 ? styles.evenRow : styles.oddRow,
                  ]}>
                  <Text style={styles.rowText}>Scrolling content {index}</Text>
                </View>
              ))}
            </ScrollView>
          </ScrollViewMarker>
          <View style={styles.controls}>
            <View style={styles.buttons}>
              <Button title="Native title" onPress={() => setCustom(false)} />
              <Button title="Custom title" onPress={() => setCustom(true)} />
              <Button
                title="Resize title"
                onPress={() => setExpanded(value => !value)}
              />
            </View>
            <View style={styles.buttons}>
              <Button
                title="Scroll down"
                onPress={() => scrollRef.current?.scrollTo({ y: 240 })}
              />
            </View>
          </View>
        </View>
        <Stack.HeaderConfig
          title={TITLE}
          ios={{
            titleItem: custom
              ? {
                  id: 'custom-title',
                  render: () => (
                    <View style={styles.title}>
                      <Text
                        accessibilityRole="header"
                        style={[
                          styles.titleText,
                          expanded && styles.expandedTitle,
                        ]}>
                        {TITLE}
                      </Text>
                      {expanded && <Text>Additional React child</Text>}
                    </View>
                  ),
                }
              : undefined,
          }}
        />
      </Stack.Screen>
    </Stack.Host>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PlatformColor('systemBackgroundColor'),
  },
  row: { height: 48, justifyContent: 'center', paddingHorizontal: 12 },
  evenRow: { backgroundColor: '#ffcc80' },
  oddRow: { backgroundColor: '#80cbc4' },
  rowText: { fontSize: 20, color: 'black' },
  title: { alignItems: 'center' },
  titleText: {
    fontSize: 17,
    fontWeight: '600',
    color: PlatformColor('labelColor'),
  },
  expandedTitle: { fontSize: 24 },
  controls: { paddingBottom: 32 },
  buttons: { flexDirection: 'row', justifyContent: 'space-around' },
});

export default createScenario(
  TestStackCustomTitleScrollEdgeIOS,
  scenarioDescription,
);
