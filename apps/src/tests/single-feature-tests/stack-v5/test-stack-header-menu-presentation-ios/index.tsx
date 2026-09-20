import React, { useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';
import { Stack } from 'react-native-screens';
import type {
  StackHeaderConfigRef,
  StackHeaderMenuIOS,
} from 'react-native-screens/components/stack/header';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

function TestStackHeaderMenuPresentationIOS() {
  const headerRef = useRef<StackHeaderConfigRef>(null);
  const [decorated, setDecorated] = useState(true);
  const [menuPresent, setMenuPresent] = useState(true);
  const [pressCount, setPressCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionCount, setSelectionCount] = useState(0);
  const [revision, setRevision] = useState(0);

  const menu: StackHeaderMenuIOS = {
    id: 'presentation-menu',
    type: 'menu',
    title: `Document actions ${revision}`,
    onSelectionChange: ids => {
      setSelectedIds(ids);
      setSelectionCount(count => count + 1);
    },
    children: [
      {
        id: 'open-document',
        type: 'menuItem',
        title: 'Open document',
        onPress: () => setPressCount(count => count + 1),
        ...(decorated
          ? { disabled: true, subtitle: 'Select a document first' }
          : {}),
      },
      {
        id: 'delete-document',
        type: 'menuItem',
        itemType: 'action',
        title: 'Delete document',
        keepsMenuPresented: true,
        onPress: () => setPressCount(count => count + 1),
        ...(decorated
          ? { destructive: true, subtitle: 'Cannot be undone' }
          : {}),
      },
      {
        id: 'notifications',
        type: 'menuItem',
        itemType: 'toggle',
        title: 'Notifications',
        initialToggleState: true,
        onPress: () => setPressCount(count => count + 1),
        ...(decorated ? { disabled: true, subtitle: 'Managed by policy' } : {}),
      },
    ],
  };

  return (
    <Stack.Host>
      <Stack.Screen screenKey="menu-presentation" activityMode="attached">
        <Stack.HeaderConfig
          ref={headerRef}
          title="Menu presentation"
          ios={{
            trailingItems: [
              {
                id: 'presentation-button',
                type: 'item',
                title: 'Actions',
                menu: menuPresent ? menu : undefined,
              },
            ],
          }}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.content}>
          <Text testID="presentation-status">
            {`Properties: ${
              decorated ? 'set' : 'omitted'
            }; rebuild: ${revision}`}
          </Text>
          <Text testID="press-count">{`Presses: ${pressCount}`}</Text>
          <Text testID="selection-status">
            {`Selections: ${selectionCount}; IDs: ${
              selectedIds.join(', ') || 'none'
            }`}
          </Text>
          <Button
            testID="toggle-presentation"
            title="Set / omit properties"
            onPress={() => setDecorated(value => !value)}
          />
          <Button
            testID="rebuild-menu"
            title="Rebuild with the same IDs"
            onPress={() => setRevision(value => value + 1)}
          />
          <Button
            testID="rename-menu-item"
            title="Rename delete using command"
            onPress={() =>
              headerRef.current?.ios?.setMenuItemOptions('delete-document', {
                title: 'Remove document',
              })
            }
          />
          <Button
            testID="set-toggle-state"
            title="Turn notifications off using command"
            onPress={() =>
              headerRef.current?.ios?.setMenuItemOptions('notifications', {
                toggleState: false,
              })
            }
          />
          <Button
            testID="toggle-menu"
            title="Remove / restore menu"
            onPress={() => setMenuPresent(value => !value)}
          />
        </ScrollView>
      </Stack.Screen>
    </Stack.Host>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16 },
});

export default createScenario(
  TestStackHeaderMenuPresentationIOS,
  scenarioDescription,
);
