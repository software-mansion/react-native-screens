import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  ContainedModalProvider,
  ContainedModalOverContent,
} from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { Colors } from '@apps/shared/styling';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';

// Modal visibility lives above the stack so the pushed screen can dismiss a
// modal that is suspended underneath it (the dismiss-while-suspended path:
// isOpen flips to false while the provider is off-window).
interface ModalStateContextValue {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  isFullScreenOpen: boolean;
  setIsFullScreenOpen: (value: boolean) => void;
}

const ModalStateContext = createContext<ModalStateContextValue | null>(null);

function useModalStateContext(): ModalStateContextValue {
  const context = useContext(ModalStateContext);
  if (context === null) {
    throw new Error('ModalStateContext used outside of its provider');
  }
  return context;
}

function TestContainedModalComprehensive() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);

  const modalState = useMemo(
    () => ({ isOpen, setIsOpen, isFullScreenOpen, setIsFullScreenOpen }),
    [isOpen, isFullScreenOpen],
  );

  return (
    <ModalStateContext.Provider value={modalState}>
      <StackContainer
        routeConfigs={[
          {
            name: 'ContainedModal',
            element: <ContainedModalScreen />,
            options: { headerConfig: { title: 'ContainedModal' } },
          },
          {
            name: 'Over',
            element: <OverScreen />,
            options: { headerConfig: { title: 'Over' } },
          },
        ]}
      />
    </ModalStateContext.Provider>
  );
}

function ContainedModalScreen() {
  const navigation = useStackNavigationContext();
  const { isOpen, setIsOpen, isFullScreenOpen, setIsFullScreenOpen } =
    useModalStateContext();
  const [isLarge, setIsLarge] = useState(false);
  const [outsideTapCount, setOutsideTapCount] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(value => value + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    // Outer provider spans the whole screen content; the full-screen modal
    // targets it by id. The inner modal targets the inner provider, so the
    // explicit pairing keeps them apart.
    <ContainedModalProvider
      containerId="full-screen"
      style={styles.fullScreenProvider}>
      <View style={styles.container}>
        {/* Controls outside the inner provider — must stay interactive while
            the inner modal is open. Resize and push double as geometry /
            suspend tests. */}
        <Text testID="contained-modal-outside-count">
          Outside taps: {outsideTapCount}
        </Text>
        <Button
          title="Outside tap"
          color={Colors.primary}
          onPress={() => setOutsideTapCount(count => count + 1)}
          testID="contained-modal-outside-button"
        />
        <Button
          title={isLarge ? 'Shrink provider' : 'Grow provider'}
          color={Colors.primary}
          onPress={() => setIsLarge(value => !value)}
          testID="contained-modal-resize-button"
        />
        <Button
          title="Push screen over"
          color={Colors.primary}
          onPress={() => navigation.push('Over')}
          testID="contained-modal-push-button"
        />
        <Button
          title="Open full-screen modal"
          color={Colors.primary}
          onPress={() => setIsFullScreenOpen(true)}
          testID="open-fullscreen-contained-modal-button"
        />
        <ScrollView style={styles.scroll} testID="contained-modal-scroll-view">
          <View style={styles.spacerTop} />
          <ContainedModalProvider
            containerId="pane"
            style={[styles.provider, isLarge && styles.providerLarge]}>
            <View style={styles.providerContent}>
              <Text
                style={styles.counter}
                testID="contained-modal-provider-counter">
                Provider counter: {seconds}
              </Text>
              <Button
                title="Open modal"
                color={Colors.primary}
                onPress={() => setIsOpen(true)}
                testID="open-contained-modal-button"
              />
            </View>
            <ContainedModalOverContent isOpen={isOpen} targetContainerId="pane">
              <View style={styles.modalContent}>
                <Text
                  style={styles.modalCounter}
                  testID="contained-modal-modal-counter">
                  Modal counter: {seconds}
                </Text>
                {/* Press-and-move probe: feedback colors + console logs verify the
                    responder sequence (pressIn -> moves -> press) survives inside
                    the teleported content. */}
                <PressableWithFeedback
                  onPress={() => {}}
                  onPressIn={e =>
                    console.log(
                      'probe pressIn',
                      JSON.stringify({
                        pageX: e.nativeEvent.pageX,
                        pageY: e.nativeEvent.pageY,
                        locationX: e.nativeEvent.locationX,
                        locationY: e.nativeEvent.locationY,
                      }),
                    )
                  }
                  style={styles.pressable}
                  testID="contained-modal-pressable">
                  <Text style={styles.pressableLabel}>Press & move</Text>
                </PressableWithFeedback>
                <Button
                  title="Dismiss from JS"
                  color={Colors.primary}
                  onPress={() => setIsOpen(false)}
                  testID="dismiss-contained-modal-button"
                />
              </View>
            </ContainedModalOverContent>
          </ContainedModalProvider>
          <View style={styles.spacer} />
        </ScrollView>
      </View>
      <ContainedModalOverContent
        isOpen={isFullScreenOpen}
        targetContainerId="full-screen">
        <View style={styles.fullScreenModalContent}>
          <Text style={styles.modalCounter} testID="fullscreen-modal-counter">
            Full-screen modal counter: {seconds}
          </Text>
          <Button
            title="Dismiss full-screen modal"
            color={Colors.primary}
            onPress={() => setIsFullScreenOpen(false)}
            testID="dismiss-fullscreen-contained-modal-button"
          />
        </View>
      </ContainedModalOverContent>
    </ContainedModalProvider>
  );
}

function OverScreen() {
  const navigation = useStackNavigationContext();
  const { isOpen, setIsOpen } = useModalStateContext();
  return (
    <View style={styles.overScreen}>
      <Text style={styles.counter}>
        The modal on the previous screen is suspended, not dismissed.
      </Text>
      <Text testID="contained-modal-suspended-is-open">
        Suspended modal isOpen: {String(isOpen)}
      </Text>
      <Button
        title="Dismiss suspended modal"
        color={Colors.primary}
        onPress={() => setIsOpen(false)}
        testID="contained-modal-dismiss-suspended-button"
      />
      <Button
        title="Pop"
        color={Colors.primary}
        onPress={() => navigation.pop(navigation.routeKey)}
        testID="contained-modal-pop-button"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // The outer provider must span the entire screen so the full-screen modal
  // covers all of it.
  fullScreenProvider: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    // Clears the native header + status bar (same pattern as other stack SFTs).
    paddingTop: 120,
    backgroundColor: Colors.offBackground,
  },
  scroll: {
    alignSelf: 'stretch',
    marginTop: 8,
  },
  // Short, so the provider box is visible on first load; the tall bottom
  // spacer keeps the content scrollable for the scroll-offset and
  // scroll-tracking steps (scroll slightly before opening to present at a
  // non-zero offset).
  spacerTop: {
    height: 200,
  },
  spacer: {
    height: 400,
  },
  // Visible background + partial size, so "the modal covers exactly the
  // provider region" is visually verifiable.
  provider: {
    alignSelf: 'center',
    width: '85%',
    height: 280,
    backgroundColor: '#cde3ff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  providerLarge: {
    height: 440,
  },
  providerContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 24,
  },
  counter: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.text,
    textAlign: 'center',
  },
  // Semi-transparent and bottom-anchored, so the provider counter at the top
  // of the box stays visible both through and above the modal content.
  modalContent: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 32,
    backgroundColor: 'rgba(40, 40, 60, 0.6)',
  },
  fullScreenModalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(60, 30, 30, 0.75)',
  },
  modalCounter: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: 'white',
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
  overScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.offBackground,
  },
});

export default createScenario(
  TestContainedModalComprehensive,
  scenarioDescription,
);
