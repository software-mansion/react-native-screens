import React, { useEffect, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  ContainedModalProvider,
  ContainedModalReplacingContent,
} from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';

const CYCLE_COUNT = 3;
const CYCLE_HALF_PERIOD_MS = 900;

function TestContainedModalReplacingContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLarge, setIsLarge] = useState(false);
  const [outsideTapCount, setOutsideTapCount] = useState(0);
  const [providerPressCount, setProviderPressCount] = useState(0);
  const [modalPressCount, setModalPressCount] = useState(0);
  const [cyclesLeft, setCyclesLeft] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const cycleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(value => value + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Automated open/close cycles: the restore after each dismissal must leave
  // the provider's content at its place and size every time (UIKit re-adds
  // the removed context view itself; the wrapper mechanism makes its restore
  // frame correct by construction, and this guards that).
  useEffect(() => {
    if (cyclesLeft === 0) {
      return;
    }
    cycleTimer.current = setTimeout(() => {
      if (isOpen) {
        setIsOpen(false);
        setCyclesLeft(count => count - 1);
      } else {
        setIsOpen(true);
      }
    }, CYCLE_HALF_PERIOD_MS);
    return () => {
      if (cycleTimer.current !== null) {
        clearTimeout(cycleTimer.current);
      }
    };
  }, [cyclesLeft, isOpen]);

  return (
    <View style={styles.container}>
      {/* Controls outside the provider: must stay interactive while the modal
          is open, and drive the geometry changes performed while open. */}
      <Text testID="replacing-modal-outside-count">
        Outside taps: {outsideTapCount}
      </Text>
      <Button
        title="Outside tap"
        color={Colors.primary}
        onPress={() => setOutsideTapCount(count => count + 1)}
        testID="replacing-modal-outside-button"
      />
      <Button
        title={isLarge ? 'Shrink provider' : 'Grow provider'}
        color={Colors.primary}
        onPress={() => setIsLarge(value => !value)}
        testID="replacing-modal-resize-button"
      />
      <Button
        title={
          cyclesLeft > 0
            ? `Cycling... (${cyclesLeft} left)`
            : `Run ${CYCLE_COUNT} open/close cycles`
        }
        color={Colors.primary}
        disabled={cyclesLeft > 0}
        onPress={() => setCyclesLeft(CYCLE_COUNT)}
        testID="replacing-modal-cycle-button"
      />
      <ScrollView style={styles.scroll} testID="replacing-modal-scroll-view">
        <View style={styles.spacerTop} />
        <ContainedModalProvider
          containerId="pane"
          style={[styles.provider, isLarge && styles.providerLarge]}>
          {/* Provider content: removed from the screen while the modal is
              open, so everything here must come back intact afterwards.
              The press counter proves the subtree kept its state. */}
          <View style={styles.providerContent}>
            <Text
              style={styles.counter}
              testID="replacing-modal-provider-counter">
              Provider counter: {seconds}
            </Text>
            <PressableWithFeedback
              onPress={() => setProviderPressCount(count => count + 1)}
              style={styles.pressable}
              testID="replacing-modal-provider-pressable">
              <Text style={styles.pressableLabel}>
                Provider presses: {providerPressCount}
              </Text>
            </PressableWithFeedback>
            <Button
              title="Open modal"
              color={Colors.primary}
              onPress={() => setIsOpen(true)}
              testID="open-replacing-modal-button"
            />
          </View>
          <ContainedModalReplacingContent
            isOpen={isOpen}
            targetContainerId="pane">
            <View style={styles.modalContent}>
              <Text
                style={styles.modalCounter}
                testID="replacing-modal-counter">
                Modal counter: {seconds}
              </Text>
              <Text style={styles.modalHint}>
                Only the provider background should show through.
              </Text>
              <PressableWithFeedback
                onPress={() => setModalPressCount(count => count + 1)}
                style={styles.pressable}
                testID="replacing-modal-pressable">
                <Text style={styles.pressableLabel}>
                  Press & move: {modalPressCount}
                </Text>
              </PressableWithFeedback>
              <Button
                title="Dismiss"
                color={Colors.primary}
                onPress={() => setIsOpen(false)}
                testID="dismiss-replacing-modal-button"
              />
            </View>
          </ContainedModalReplacingContent>
        </ContainedModalProvider>
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    backgroundColor: Colors.offBackground,
  },
  scroll: {
    alignSelf: 'stretch',
    marginTop: 8,
  },
  spacerTop: {
    height: 120,
  },
  spacer: {
    height: 500,
  },
  // Visible background: with the replacing variant it is the only thing of
  // the provider that stays on screen under a translucent modal.
  provider: {
    alignSelf: 'center',
    width: '85%',
    height: 300,
    backgroundColor: '#cde3ff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  providerLarge: {
    height: 460,
  },
  providerContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 24,
    gap: 8,
  },
  counter: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  // Translucent on purpose: the provider's light-blue background must show
  // through, its children must not.
  modalContent: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 32,
    gap: 8,
    backgroundColor: 'rgba(40, 40, 60, 0.6)',
  },
  modalCounter: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  modalHint: {
    fontSize: 13,
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  pressable: {
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  pressableLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
});

export default createScenario(
  TestContainedModalReplacingContent,
  scenarioDescription,
);
