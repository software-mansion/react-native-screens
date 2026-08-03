import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';

const ROUTE_NAMES = [
  'SharedOne',
  'SharedTwo',
  'InlineOne',
  'InlineTwo',
] as const;

type MutableBag = { value: number };

// Shared by SharedOne + SharedTwo via the same element props object.
// Mutating this from one screen is visible on the other after re-render —
// there is no props isolation for mutable object props on a shared element.
const sharedMutableProp: MutableBag = { value: 0 };

function StatefulScreen({
  title,
  backgroundColor,
  mutable,
}: {
  title: string;
  backgroundColor: string;
  mutable: MutableBag;
}) {
  const [count, setCount] = useState(0);
  // Force a local re-render so this instance re-reads mutable.value after
  // an in-place mutation (React does not detect prop object mutations).
  const [, forceRender] = useState(0);
  const navigation = useStackNavigationContext();

  return (
    <CenteredLayoutView style={{ backgroundColor }}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.meta}>routeKey: {navigation.routeKey}</Text>
      <Text style={styles.counter}>Local count: {count}</Text>
      <Text style={styles.counter}>Mutable prop value: {mutable.value}</Text>

      <Button title="+ Local state" onPress={() => setCount(c => c + 1)} />
      <Button
        title="+ Mutate props object"
        onPress={() => {
          mutable.value += 1;
          forceRender(n => n + 1);
        }}
      />
      <Button
        title="Re-read mutable prop"
        onPress={() => {forceRender(n => n + 1)}
      />

      <View style={styles.row}>
        {ROUTE_NAMES.map(name => (
          <Button
            key={name}
            title={`Push ${name}`}
            onPress={() => navigation.push(name)}
          />
        ))}
      </View>

      <Button title="Pop" onPress={() => navigation.pop(navigation.routeKey)} />
    </CenteredLayoutView>
  );
}

// Same element object reused by SharedOne + SharedTwo — both receive the
// exact same `mutable` prop reference baked into this blueprint.
const SharedRef = (
  <StatefulScreen
    title="Shared Ref (same object)"
    backgroundColor="#E6E6FA"
    mutable={sharedMutableProp}
  />
);

export default function TestStackMutablePropsPoC() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'SharedOne',
          element: SharedRef,
          options: {},
        },
        {
          name: 'SharedTwo',
          element: SharedRef,
          options: {},
        },
        {
          name: 'InlineOne',
          element: (
            <StatefulScreen
              title="Inline One"
              backgroundColor="#FFE4C4"
              mutable={sharedMutableProp}
            />
          ),
          options: {},
        },
        {
          name: 'InlineTwo',
          element: (
            <StatefulScreen
              title="Inline Two"
              backgroundColor="#FFE4C4"
              mutable={sharedMutableProp}
            />
          ),
          options: {},
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
