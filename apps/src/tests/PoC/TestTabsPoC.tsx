import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  TabsContainer,
  useTabsNavigationContext,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/containers/tabs';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';

const ROUTE_NAMES = [
  'SharedOne',
  'SharedTwo',
  'InlineOne',
  'InlineTwo',
] as const;

function StatefulScreen({
  title,
  backgroundColor,
}: {
  title: string;
  backgroundColor: string;
}) {
  const [count, setCount] = useState(0);
  const navigation = useTabsNavigationContext();

  return (
    <CenteredLayoutView style={{ backgroundColor }}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.meta}>routeKey: {navigation.routeKey}</Text>
      <Text style={styles.meta}>
        isSelected: {String(navigation.isSelected)}
      </Text>
      <Text style={styles.counter}>Local count: {count}</Text>

      <Button title="+ Local state" onPress={() => setCount(c => c + 1)} />

      <View style={styles.row}>
        {ROUTE_NAMES.map(name => (
          <Button
            key={name}
            title={`Select ${name}`}
            onPress={() => navigation.selectTab(name)}
          />
        ))}
      </View>
    </CenteredLayoutView>
  );
}

// Same element object reused by SharedOne + SharedTwo — exercises TabsContainer
// rendering without cloneElement (state/identity sharing across tab items).
const SharedRef = (
  <StatefulScreen title="Shared Ref (same object)" backgroundColor="#E6E6FA" />
);

export default function TestTabsPoC() {
  return (
    <TabsContainer
      defaultRouteName="SharedOne"
      routeConfigs={[
        {
          name: 'SharedOne',
          element: SharedRef,
          options: {
            ...DEFAULT_TAB_ROUTE_OPTIONS,
            title: 'SharedOne',
          },
        },
        {
          name: 'SharedTwo',
          element: SharedRef,
          options: {
            ...DEFAULT_TAB_ROUTE_OPTIONS,
            title: 'SharedTwo',
          },
        },
        {
          name: 'InlineOne',
          element: (
            <StatefulScreen title="Inline One" backgroundColor="#FFE4C4" />
          ),
          options: {
            ...DEFAULT_TAB_ROUTE_OPTIONS,
            title: 'Inline One',
          },
        },
        {
          name: 'InlineTwo',
          element: (
            <StatefulScreen title="Inline Two" backgroundColor="#FFE4C4" />
          ),
          options: {
            ...DEFAULT_TAB_ROUTE_OPTIONS,
            title: 'Inline Two',
          },
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: 'bold' },
  meta: { fontSize: 14, marginVertical: 4 },
  counter: { fontSize: 24, fontWeight: '600', marginVertical: 8 },
  row: { gap: 4, alignItems: 'stretch', width: '100%', paddingHorizontal: 16 },
});
