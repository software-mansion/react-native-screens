import React, { useState } from 'react';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ContainedModal,
  ContainedModalProvider,
} from 'react-native-screens/experimental';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

const CONTAINER_ID = 'contained-modal-base';

export function App() {
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  const [partialProvider, setPartialProvider] = useState(false);
  const [insideCount, setInsideCount] = useState(0);
  const [outsideCount, setOutsideCount] = useState(0);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Text style={styles.title}>ContainedModal Test</Text>
        <Button
          title={
            partialProvider
              ? 'Provider: partial (tap for full screen)'
              : 'Provider: full screen (tap for partial)'
          }
          color={Colors.primary}
          onPress={() => setPartialProvider(value => !value)}
        />
        <View style={styles.spacing} />
        <Button
          title="Open contained modal"
          color={Colors.primary}
          onPress={() => setIsOpen(true)}
        />
        <View style={styles.spacing} />
        <Pressable
          style={styles.counter}
          onPress={() => setOutsideCount(value => value + 1)}>
          <Text style={styles.counterText}>Outside count: {outsideCount}</Text>
        </Pressable>
      </View>

      <ContainedModalProvider
        containerId={CONTAINER_ID}
        style={partialProvider ? styles.partialProvider : styles.fullProvider}>
        <View style={styles.providerContent}>
          <Pressable
            style={styles.counter}
            onPress={() => setInsideCount(value => value + 1)}>
            <Text style={styles.counterText}>Inside count: {insideCount}</Text>
          </Pressable>
        </View>
        <ContainedModal targetContainerId={CONTAINER_ID} isOpen={isOpen}>
          <View style={styles.modal}>
            <Text style={styles.sheetTitle}>🎉 This is a contained modal</Text>
            <View style={styles.spacing} />
            <Button
              title="Close"
              color={Colors.primary}
              onPress={() => setIsOpen(false)}
            />
          </View>
        </ContainedModal>
      </ContainedModalProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.offBackground,
  },
  content: {
    paddingTop: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.text,
  },
  fullProvider: {
    flex: 1,
    marginTop: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: Colors.NavyLightTransparent,
  },
  partialProvider: {
    height: 320,
    marginTop: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.NavyLightTransparent,
  },
  providerContent: {
    padding: 16,
    alignItems: 'center',
  },
  counter: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  counterText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'transparent',
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.text,
  },
  spacing: {
    height: 32,
  },
});

export default createScenario(App, scenarioDescription);
