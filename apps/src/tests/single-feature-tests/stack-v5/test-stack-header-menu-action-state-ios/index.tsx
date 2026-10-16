import React, { useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';
import { Stack } from 'react-native-screens';
import type {
  StackHeaderConfigRef,
  StackHeaderMenuIOS,
} from 'react-native-screens/components/stack/header';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

function TestStackHeaderMenuActionStateIOS() {
  const headerRef = useRef<StackHeaderConfigRef>(null);
  const [state, setState] = useState<'off' | 'on' | 'mixed'>('on');
  const [statesPresent, setStatesPresent] = useState(true);
  const [menuPresent, setMenuPresent] = useState(true);
  const [pressCount, setPressCount] = useState(0);
  const [selectionCount, setSelectionCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [revision, setRevision] = useState(0);
  const onSelectionChange = (ids: string[]) => {
    setSelectedIds(ids);
    setSelectionCount(count => count + 1);
  };
  const onPress = () => setPressCount(count => count + 1);

  const menu: StackHeaderMenuIOS = {
    id: 'formatting-menu',
    type: 'menu',
    title: `Formatting ${revision}`,
    onSelectionChange,
    children: [
      {
        id: 'bold',
        type: 'menuItem',
        title: 'Bold',
        ...(statesPresent ? { state } : {}),
        onPress,
      },
      {
        id: 'italic',
        type: 'menuItem',
        itemType: 'action',
        title: 'Italic',
        ...(statesPresent ? { state: 'mixed' as const } : {}),
        onPress,
      },
      {
        id: 'notifications',
        type: 'menuItem',
        itemType: 'toggle',
        title: 'Notifications',
        state: 'on',
        initialToggleState: false,
        onPress,
      },
      {
        id: 'alignment',
        type: 'menu',
        title: 'Alignment',
        singleSelection: true,
        onSelectionChange,
        children: [
          {
            id: 'leading',
            type: 'menuItem',
            title: 'Leading',
            state: 'on',
            onPress,
          },
          {
            id: 'trailing',
            type: 'menuItem',
            title: 'Trailing',
            state: 'mixed',
            initialToggleState: true,
            onPress,
          },
        ],
      },
    ],
  };

  return (
    <Stack.Host>
      <Stack.Screen screenKey="menu-action-state" activityMode="attached">
        <Stack.HeaderConfig
          ref={headerRef}
          title="Action state"
          ios={{
            trailingItems: [
              {
                id: 'formatting-button',
                type: 'item',
                title: 'Format',
                menu: menuPresent ? menu : undefined,
              },
            ],
          }}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.content}>
          <Text testID="action-state-status">
            {`Bold: ${statesPresent ? state : 'omitted'}; rebuild: ${revision}`}
          </Text>
          <Text testID="press-count">{`Presses: ${pressCount}`}</Text>
          <Text testID="selection-status">
            {`Selections: ${selectionCount}; IDs: ${
              selectedIds.join(', ') || 'none'
            }`}
          </Text>
          <Button
            testID="cycle-state"
            title="Cycle Bold state"
            onPress={() =>
              setState(value =>
                value === 'on' ? 'mixed' : value === 'mixed' ? 'off' : 'on',
              )
            }
          />
          <Button
            testID="toggle-states"
            title="Omit / restore action states"
            onPress={() => setStatesPresent(value => !value)}
          />
          <Button
            testID="rebuild-menu"
            title="Rebuild with the same IDs"
            onPress={() => setRevision(value => value + 1)}
          />
          <Button
            testID="command-mixed"
            title="Command Bold mixed"
            onPress={() =>
              headerRef.current?.ios?.setMenuItemOptions('bold', {
                state: 'mixed',
              })
            }
          />
          <Button
            testID="command-reset"
            title="Reset Bold using command"
            onPress={() =>
              headerRef.current?.ios?.setMenuItemOptions('bold', {
                state: undefined,
              })
            }
          />
          <Button
            testID="command-title"
            title="Rename Bold using command"
            onPress={() =>
              headerRef.current?.ios?.setMenuItemOptions('bold', {
                title: 'Bold text',
              })
            }
          />
          <Button
            testID="command-toggle"
            title="Command Notifications on, state off"
            onPress={() =>
              headerRef.current?.ios?.setMenuItemOptions('notifications', {
                toggleState: true,
                state: 'off',
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

const styles = StyleSheet.create({ content: { padding: 20, gap: 8 } });

export default createScenario(
  TestStackHeaderMenuActionStateIOS,
  scenarioDescription,
);
