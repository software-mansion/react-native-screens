import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Split } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { StackContainer } from '@apps/shared/containers/stack';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';
import { ToastProvider, useToast } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';

function TestSplitStackHeaderNavigation() {
  return (
    <ToastProvider>
      <Split.Host preferredDisplayMode="oneBesideSecondary">
        <Split.Column>
          <ColumnStack name="Primary" color={Colors.YellowLight100} />
        </Split.Column>
        <Split.Column>
          <ColumnStack name="Secondary" color={Colors.BlueLight100} />
        </Split.Column>
      </Split.Host>
    </ToastProvider>
  );
}

function ColumnStack({ name, color }: { name: string; color: string }) {
  const toast = useToast();
  const showToast = (message: string) =>
    toast.push({ backgroundColor: Colors.GreenDark120, message });
  const root = `${name} root`;
  const pushed = `${name} pushed`;

  return (
    <StackContainer
      routeConfigs={[
        {
          name: root,
          element: <Screen title={root} color={color} next={pushed} />,
          options: {
            headerConfig: {
              title: root,
              ios: {
                trailingItems: [
                  {
                    type: 'item',
                    id: 'item',
                    title: 'Item',
                    onPress: () => showToast(`${name} item`),
                  },
                  {
                    type: 'item',
                    id: 'custom',
                    render: () => (
                      <PressableWithFeedback
                        hitSlop={24}
                        style={styles.customItem}
                        onPress={() => showToast(`${name} custom item`)}
                      />
                    ),
                  },
                ],
              },
            },
          },
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
      <StackNavigationButtons
        routeNames={next != null ? [next] : []}
        isPopEnabled={next == null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  customItem: {
    width: 16,
    height: 16,
  },
});

export default createScenario(
  TestSplitStackHeaderNavigation,
  scenarioDescription,
);
