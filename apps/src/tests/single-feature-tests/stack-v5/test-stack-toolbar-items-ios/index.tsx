import React, { useLayoutEffect, useState } from 'react';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import type { StackHeaderConfigProps } from 'react-native-screens/components/stack/header';
import { scenarioDescription } from './scenario-description';

function ToolbarScreen({ name }: { name: string }) {
  const { routeKey, setRouteOptions, push, pop, preload } =
    useStackNavigationContext();
  const [filter, setFilter] = useState(false);
  const [items, setItems] = useState<'shown' | 'empty' | 'omitted'>('shown');
  const [headerMounted, setHeaderMounted] = useState(true);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [custom, setCustom] = useState(false);
  const [width, setWidth] = useState(12);
  const [lastAction, setLastAction] = useState('None');

  useLayoutEffect(() => {
    const headerConfig: StackHeaderConfigProps | undefined = headerMounted
      ? {
          title: name,
          hidden: headerHidden,
          ios: {
            toolbarItems:
              items === 'omitted'
                ? undefined
                : items === 'empty'
                ? []
                : [
                    {
                      type: 'item',
                      id: 'filter',
                      title: filter ? 'All' : 'Unread',
                      onPress: () => setFilter(value => !value),
                    },
                    { type: 'spacer', id: 'fixed', sizing: 'fixed', width },
                    custom
                      ? {
                          type: 'item',
                          id: 'custom',
                          render: () => (
                            <Pressable
                              accessibilityRole="button"
                              accessibilityLabel="Custom action"
                              style={styles.custom}
                              onPress={() => setLastAction('Custom')}>
                              <Text>Custom</Text>
                            </Pressable>
                          ),
                        }
                      : { type: 'item', id: 'status', title: name },
                    { type: 'spacer', id: 'flexible', sizing: 'flexible' },
                    {
                      type: 'item',
                      id: 'actions',
                      title: 'Actions',
                      menu: {
                        type: 'menu',
                        id: 'actions-menu',
                        children: [
                          {
                            type: 'menuItem',
                            id: 'archive',
                            title: 'Archive',
                            onPress: () => setLastAction('Archive'),
                          },
                        ],
                      },
                    },
                  ],
          },
        }
      : undefined;
    setRouteOptions(routeKey, { headerConfig });
  }, [
    routeKey,
    setRouteOptions,
    name,
    filter,
    items,
    headerMounted,
    headerHidden,
    custom,
    width,
  ]);

  return (
    <View style={styles.screen} testID="toolbar-screen-root">
      <Text testID="toolbar-screen-name">{name}</Text>
      <Text testID="toolbar-filter">Filter: {filter ? 'All' : 'Unread'}</Text>
      <Text testID="toolbar-last-action">Action: {lastAction}</Text>
      <Button title="Empty items" onPress={() => setItems('empty')} />
      <Button title="Omit items" onPress={() => setItems('omitted')} />
      <Button title="Restore items" onPress={() => setItems('shown')} />
      <Button
        title="Toggle header config"
        onPress={() => setHeaderMounted(value => !value)}
      />
      <Button
        title="Toggle header visibility"
        onPress={() => setHeaderHidden(value => !value)}
      />
      <Button title="Toggle custom item" onPress={() => setCustom(v => !v)} />
      <Button
        title="Toggle fixed width"
        onPress={() => setWidth(v => (v === 12 ? 48 : 12))}
      />
      {name === 'First' && (
        <>
          <Button
            title="Preload other toolbar"
            onPress={() => preload('Second')}
          />
          <Button title="Push other toolbar" onPress={() => push('Second')} />
          <Button title="Push plain screen" onPress={() => push('Plain')} />
        </>
      )}
      {name === 'Second' && (
        <Button title="Go back" onPress={() => pop(routeKey)} />
      )}
    </View>
  );
}

function PlainScreen() {
  const { routeKey, pop } = useStackNavigationContext();
  return (
    <View style={styles.screen}>
      <Text testID="toolbar-screen-name">Plain</Text>
      <Button title="Go back" onPress={() => pop(routeKey)} />
    </View>
  );
}

function TestStackToolbarItemsIOS() {
  return (
    <StackContainer
      routeConfigs={[
        { name: 'First', element: <ToolbarScreen name="First" /> },
        { name: 'Second', element: <ToolbarScreen name="Second" /> },
        {
          name: 'Plain',
          element: <PlainScreen />,
          options: { headerConfig: { title: 'Plain' } },
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  custom: { padding: 8, backgroundColor: '#e0eaff' },
});

export default createScenario(TestStackToolbarItemsIOS, scenarioDescription);
