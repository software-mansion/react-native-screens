import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  ContainedModalOverContent,
  ContainedModalReplacingContent,
} from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { StackContainer } from '@apps/shared/containers/stack';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';
import { Colors } from '@apps/shared/styling';

const STACK_ID = 'stack';

// The stack is the provider of the modals rendered in its screen. It takes
// only a part of the scenario, so that it is visible what a modal covers.
function TestContainedModalStackProvider() {
  return (
    <View style={styles.root}>
      <View style={styles.outside}>
        <CountingPressable title="Outside" style={styles.smallPressable} />
      </View>
      <View style={styles.stack}>
        <StackContainer
          modalProviderContainerId={STACK_ID}
          routeConfigs={[
            {
              name: 'Root',
              element: <RootScreen />,
              options: {
                headerConfig: {
                  title: 'Root',
                  ios: {
                    trailingItems: [
                      {
                        id: 'header-item',
                        type: 'item',
                        render: () => (
                          <CountingPressable
                            title="Header"
                            style={styles.headerPressable}
                          />
                        ),
                      },
                    ],
                  },
                },
              },
            },
          ]}
        />
      </View>
    </View>
  );
}

function RootScreen() {
  const [isOverOpen, setIsOverOpen] = React.useState(false);
  const [isReplacingOpen, setIsReplacingOpen] = React.useState(false);

  return (
    <View style={styles.screen}>
      <CountingPressable title="Root" style={styles.smallPressable} />
      <Button
        title="Open modal over content"
        onPress={() => setIsOverOpen(true)}
      />
      <Button
        title="Open modal replacing content"
        onPress={() => setIsReplacingOpen(true)}
      />
      <ContainedModalOverContent
        isOpen={isOverOpen}
        targetContainerId={STACK_ID}>
        <View style={styles.modal}>
          {/* Lies over the header item of the stack. */}
          <View style={styles.headerItemMarker} pointerEvents="none">
            <Text style={styles.label}>Press here</Text>
          </View>
          <CountingPressable
            title="Modal over content"
            style={styles.smallPressable}
          />
          <Button title="Close" onPress={() => setIsOverOpen(false)} />
        </View>
      </ContainedModalOverContent>
      <ContainedModalReplacingContent
        isOpen={isReplacingOpen}
        targetContainerId={STACK_ID}>
        <View style={styles.modal}>
          <CountingPressable
            title="Modal replacing content"
            style={styles.smallPressable}
          />
          <Button title="Close" onPress={() => setIsReplacingOpen(false)} />
        </View>
      </ContainedModalReplacingContent>
    </View>
  );
}

// A pressable that counts its presses.
function CountingPressable({
  title,
  style,
}: {
  title: string;
  style: React.ComponentProps<typeof PressableWithFeedback>['style'];
}) {
  const [presses, setPresses] = React.useState(0);

  return (
    <PressableWithFeedback
      style={style}
      onPress={() => setPresses(value => value + 1)}>
      <Text style={styles.label}>
        {title}: {presses}
      </Text>
    </PressableWithFeedback>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.BlueLight100,
  },
  outside: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stack: {
    flex: 1,
    margin: 16,
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
  headerItemMarker: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 160,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  smallPressable: {
    height: 64,
    width: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerPressable: {
    height: 36,
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontVariant: ['tabular-nums'],
  },
});

export default createScenario(
  TestContainedModalStackProvider,
  scenarioDescription,
);
