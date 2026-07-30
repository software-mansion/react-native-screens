import React, { useState, createContext, useContext } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

// 1. CREATE ROUTER CONTEXT (like in a real app)
const RouteContext = createContext<{
  paramsId: number;
  setParamsId: (val: number) => void;
} | null>(null);

// 2. SCREEN THAT READS DATA FROM CONTEXT (hooks instead of props)
function StatefulScreen({
  title,
  backgroundColor,
}: {
  title: string;
  backgroundColor: string;
}) {
  const [count, setCount] = useState(0);

  // Instead of props, the screen reads dynamic data from the router via a hook
  const routeContext = useContext(RouteContext);
  if (!routeContext) return null;

  return (
    <View style={[styles.screen, { backgroundColor }]}>
      <Text style={styles.title}>{title}</Text>
      <Text>Dynamic ID from router (Context): {routeContext.paramsId}</Text>
      <Text style={styles.counter}>Local count: {count}</Text>

      <Button title="+ Local state" onPress={() => setCount(c => c + 1)} />
      <Button
        title="Change ID in this slot"
        onPress={() => routeContext.setParamsId(routeContext.paramsId + 1)}
      />
    </View>
  );
}

// 3. CONFIG (static blueprints)
const SharedRef = (
  <StatefulScreen title="Shared Ref (same object)" backgroundColor="#E6E6FA" />
);

const CompRef = () => (
  <StatefulScreen title="Component" backgroundColor="#FFE4C4" />
);

const SLOTS = [
  { slotKey: 'c1', kind: 'component', Component: CompRef },
  { slotKey: 's1', kind: 'element', element: SharedRef },
  { slotKey: 's2', kind: 'element', element: SharedRef },
  {
    slotKey: 'i1',
    kind: 'element',
    element: <View style={{ backgroundColor: '#FFAA00', flex: 1 }} />,
  },
];

const ROUTES = [
  { name: 'Component1', short: 'C1', slotKey: 'c1' },
  { name: 'SharedOne', short: 'S1', slotKey: 's1' },
  { name: 'SharedTwo', short: 'S2', slotKey: 's2' },
  { name: 'InlineOne', short: 'I1', slotKey: 'i1' },
] as const;

export default function TestPoC() {
  const [routeName, setRouteName] =
    useState<(typeof ROUTES)[number]['name']>('SharedOne');

  const [paramsBySlot, setParamsBySlot] = useState<Record<string, number>>({
    c1: 100,
    s1: 100,
    s2: 100,
  });

  const activeSlotKey = ROUTES.find(r => r.name === routeName)!.slotKey;

  return (
    <View style={styles.root}>
      <Text style={styles.header}>Active screen: {routeName}</Text>
      <View style={styles.row}>
        {ROUTES.map(r => (
          <Button
            key={r.name}
            title={r.short}
            onPress={() => setRouteName(r.name)}
          />
        ))}
      </View>

      <View style={styles.content}>
        {SLOTS.map(slot => {
          const visible = slot.slotKey === activeSlotKey;

          // Update params only for this specific slot
          const updateSlotParams = (newId: number) => {
            setParamsBySlot(prev => ({ ...prev, [slot.slotKey]: newId }));
          };

          return (
            <View
              key={slot.slotKey}
              style={{ flex: 1, display: visible ? 'flex' : 'none' }}>
              {/* Wrap slot in Provider — same pattern as StackContainer */}
              <RouteContext.Provider
                value={{
                  paramsId: paramsBySlot[slot.slotKey],
                  setParamsId: updateSlotParams,
                }}>
                {slot.kind === 'component' ? <slot.Component /> : slot.element}
              </RouteContext.Provider>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 48, paddingHorizontal: 12, gap: 8 },
  header: { fontWeight: 'bold', fontSize: 16 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  content: { flex: 1 },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  counter: { fontSize: 24, fontWeight: '600', marginVertical: 8 },
});
