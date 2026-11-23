import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  ContainedModalOverContent,
  ContainedModalProvider,
  Split,
} from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { StackContainer } from '@apps/shared/containers/stack';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';
import { Colors } from '@apps/shared/styling';

// The column does not set `disableStackIntegration`. The stack is rendered
// inside a contained modal, so it is not integrated with the column.
function TestSplitStackV5InContainedModal() {
  return (
    <Split.Host preferredDisplayMode="oneBesideSecondary">
      <Split.Column>
        <View style={styles.primaryColumn}>
          <Text style={styles.title}>Primary column</Text>
        </View>
      </Split.Column>
      <Split.Column>
        <ColumnWithModal />
      </Split.Column>
    </Split.Host>
  );
}

function ColumnWithModal() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <ContainedModalProvider containerId="column" style={styles.fill}>
      <View style={styles.plainColumn}>
        <Text style={styles.title}>Plain column</Text>
        <Button title="Open modal" onPress={() => setIsOpen(true)} />
      </View>
      <ContainedModalOverContent isOpen={isOpen} targetContainerId="column">
        <View style={styles.fill}>
          <NestedStack onClose={() => setIsOpen(false)} />
        </View>
      </ContainedModalOverContent>
    </ContainedModalProvider>
  );
}

function NestedStack({ onClose }: { onClose: () => void }) {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Nested root',
          element: (
            <Screen
              title="Nested root"
              next="Nested pushed"
              onClose={onClose}
            />
          ),
          options: { headerConfig: { title: 'Nested root' } },
        },
        {
          name: 'Nested pushed',
          element: <Screen title="Nested pushed" onClose={onClose} />,
          options: { headerConfig: { title: 'Nested pushed' } },
        },
      ]}
    />
  );
}

function Screen({
  title,
  next,
  onClose,
}: {
  title: string;
  next?: string;
  onClose: () => void;
}) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{title}</Text>
      <StackNavigationButtons
        routeNames={next != null ? [next] : []}
        isPopEnabled={next == null}
      />
      <Button title="Close modal" onPress={onClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.YellowLight100,
  },
  primaryColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BlueLight100,
  },
  plainColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.GreenLight100,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default createScenario(
  TestSplitStackV5InContainedModal,
  scenarioDescription,
);
