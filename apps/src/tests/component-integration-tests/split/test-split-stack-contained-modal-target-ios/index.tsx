import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  ContainedModalOverContent,
  ContainedModalReplacingContent,
  Split,
} from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';
import { Colors } from '@apps/shared/styling';

const STACK_ID = 'secondary';
const ROOT = 'Secondary root';
const PUSHED = 'Secondary pushed';

// The stack of the secondary column is the provider of the modals rendered in
// its root screen. Nothing is rendered between the column and the stack.
function TestSplitStackContainedModalTarget() {
  return (
    <Split.Host preferredDisplayMode="oneBesideSecondary">
      <Split.Column>
        <View style={styles.primaryColumn}>
          <CountingPressable title="Primary column" />
        </View>
      </Split.Column>
      <Split.Column>
        <StackContainer
          modalProviderContainerId={STACK_ID}
          routeConfigs={[
            {
              name: ROOT,
              element: <RootScreen />,
              options: { headerConfig: { title: ROOT } },
            },
            {
              name: PUSHED,
              element: <PushedScreen />,
              options: { headerConfig: { title: PUSHED } },
            },
          ]}
        />
      </Split.Column>
    </Split.Host>
  );
}

function RootScreen() {
  const navigation = useStackNavigationContext();
  const [isOverOpen, setIsOverOpen] = React.useState(false);
  const [isReplacingOpen, setIsReplacingOpen] = React.useState(false);
  const [rejections, setRejections] = React.useState(0);

  return (
    <View style={styles.screen}>
      <CountingPressable title={ROOT} />
      <Button
        title="Open modal over content"
        onPress={() => setIsOverOpen(true)}
      />
      <Button
        title="Open modal replacing content"
        onPress={() => setIsReplacingOpen(true)}
      />
      <StackNavigationButtons routeNames={[PUSHED]} isPopEnabled={false} />
      <ContainedModalOverContent
        isOpen={isOverOpen}
        targetContainerId={STACK_ID}>
        <View style={styles.modal}>
          <CountingPressable title="Modal over content" />
          <Text style={styles.label}>Rejected requests: {rejections}</Text>
          <Button
            title="Open the other modal"
            onPress={() => setIsReplacingOpen(true)}
          />
          <Button
            title={`Push ${PUSHED}`}
            onPress={() => navigation.push(PUSHED)}
          />
          <Button title="Close" onPress={() => setIsOverOpen(false)} />
        </View>
      </ContainedModalOverContent>
      <ContainedModalReplacingContent
        isOpen={isReplacingOpen}
        targetContainerId={STACK_ID}
        onPresentationRejected={() => {
          setRejections(value => value + 1);
          setIsReplacingOpen(false);
        }}>
        <View style={styles.modal}>
          <CountingPressable title="Modal replacing content" />
          <Button title="Close" onPress={() => setIsReplacingOpen(false)} />
        </View>
      </ContainedModalReplacingContent>
    </View>
  );
}

function PushedScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{PUSHED}</Text>
      <StackNavigationButtons routeNames={[]} isPopEnabled />
    </View>
  );
}

// A pressable that counts its presses.
function CountingPressable({ title }: { title: string }) {
  const [presses, setPresses] = React.useState(0);

  return (
    <PressableWithFeedback
      style={styles.pressable}
      onPress={() => setPresses(value => value + 1)}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.label}>Presses: {presses}</Text>
    </PressableWithFeedback>
  );
}

const styles = StyleSheet.create({
  primaryColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BlueLight100,
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.White,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.YellowLight100,
  },
  pressable: {
    height: 150,
    width: 240,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontVariant: ['tabular-nums'],
  },
});

export default createScenario(
  TestSplitStackContainedModalTarget,
  scenarioDescription,
);
