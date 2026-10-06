import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import type { StackHeaderNavigationItemStyleIOS } from 'react-native-screens';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

function TestStackNavigationItemStyleIOS() {
  return (
    <View
      testID="navigation-item-style-stack"
      collapsable={false}
      style={styles.container}>
      <StackContainer
        routeConfigs={[
          {
            name: 'Catalog',
            element: <CatalogScreen />,
            options: { headerConfig: { title: 'Catalog' } },
          },
          {
            name: 'Document',
            element: <DocumentScreen />,
            options: {
              headerConfig: {
                title: 'Document',
                ios: {
                  backButtonTitle: 'Catalog',
                  navigationItemStyle: 'editor',
                },
              },
            },
          },
          {
            name: 'Default',
            element: <DefaultScreen />,
            options: {
              headerConfig: {
                title: 'Default',
                ios: { backButtonTitle: 'Document' },
              },
            },
          },
        ]}
      />
    </View>
  );
}

function CatalogScreen() {
  const { push } = useStackNavigationContext();
  return (
    <View style={styles.content}>
      <Text>Compare UIKit navigation item styles.</Text>
      <Button title="Push Document" onPress={() => push('Document')} />
    </View>
  );
}

function DocumentScreen() {
  const { routeKey, push, pop, setRouteOptions } = useStackNavigationContext();
  const [itemStyle, setItemStyle] = React.useState<
    StackHeaderNavigationItemStyleIOS | undefined
  >('editor');
  const [mounted, setMounted] = React.useState(true);
  const [titleMode, setTitleMode] = React.useState<'text' | 'empty' | 'custom'>(
    'text',
  );

  React.useLayoutEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig: mounted
        ? {
            title: titleMode === 'text' ? 'Document' : undefined,
            ios: {
              backButtonTitle: 'Catalog',
              titleItem:
                titleMode === 'custom'
                  ? { id: 'document-title', render: renderCustomTitle }
                  : undefined,
              ...(itemStyle === undefined
                ? {}
                : { navigationItemStyle: itemStyle }),
            },
          }
        : undefined,
    });
  }, [itemStyle, mounted, titleMode, routeKey, setRouteOptions]);

  return (
    <View style={styles.content}>
      <Text testID="navigation-item-style-state">
        navigationItemStyle: {String(itemStyle)}
      </Text>
      <Text>Header config: {mounted ? 'mounted' : 'removed'}</Text>
      <Button title="Set navigator" onPress={() => setItemStyle('navigator')} />
      <Button title="Set browser" onPress={() => setItemStyle('browser')} />
      <Button title="Set editor" onPress={() => setItemStyle('editor')} />
      <Button title="Remove style" onPress={() => setItemStyle(undefined)} />
      <Button title="Omit title" onPress={() => setTitleMode('empty')} />
      <Button title="Use custom title" onPress={() => setTitleMode('custom')} />
      <Button title="Use text title" onPress={() => setTitleMode('text')} />
      <Button
        title={mounted ? 'Remove header config' : 'Mount header config'}
        onPress={() => setMounted(value => !value)}
      />
      <Button title="Push Default" onPress={() => push('Default')} />
      <Button title="Pop Document" onPress={() => pop(routeKey)} />
    </View>
  );
}

function renderCustomTitle() {
  return (
    <View
      testID="navigation-item-style-custom-title"
      collapsable={false}
      style={styles.customTitle}>
      <Text style={styles.customTitleText}>Custom Document</Text>
    </View>
  );
}

function DefaultScreen() {
  const { routeKey, pop } = useStackNavigationContext();
  return (
    <View style={styles.content}>
      <Text>This screen uses UIKit's default navigator style.</Text>
      <Button title="Pop Default" onPress={() => pop(routeKey)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  customTitle: {
    width: 160,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dde7f6',
  },
  customTitleText: { fontSize: 17 },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f4f8',
    gap: 12,
  },
});

export default createScenario(
  TestStackNavigationItemStyleIOS,
  scenarioDescription,
);
