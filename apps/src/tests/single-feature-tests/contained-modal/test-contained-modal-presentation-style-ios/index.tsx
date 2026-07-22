import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ContainedModal,
  ContainedModalProvider,
} from 'react-native-screens/experimental';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

const CONTAINER_ID = 'contained-modal-transparent';

export function App() {
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  const [transparent, setTransparent] = useState(true);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Text style={styles.title}>ContainedModal presentation style</Text>
        <Button
          title={
            transparent
              ? 'transparent: true (OverCurrentContext)'
              : 'transparent: false (CurrentContext)'
          }
          color={Colors.primary}
          onPress={() => setTransparent(value => !value)}
        />
        <View style={styles.spacing} />
        <Button
          title="Open contained modal"
          color={Colors.primary}
          onPress={() => setIsOpen(true)}
        />
      </View>

      <ContainedModalProvider
        containerId={CONTAINER_ID}
        style={styles.provider}>
        <View style={styles.providerContent}>
          <Text style={styles.providerText}>
            Provider background content. With `transparent: true` this stays
            visible behind the modal; with `transparent: false` it is replaced
            by the modal.
          </Text>
        </View>
        <ContainedModal
          targetContainerId={CONTAINER_ID}
          isOpen={isOpen}
          transparent={transparent}>
          <View style={styles.modal}>
            <Text style={styles.sheetTitle}>🎉 This is a contained modal</Text>
            <Text style={styles.sheetSubtitle}>
              transparent = {String(transparent)}
            </Text>
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
  provider: {
    flex: 1,
    marginTop: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 12,
    overflow: 'hidden',
  },
  providerContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  providerText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.primary,
  },
  modal: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
    backgroundColor: 'transparent',
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.text,
  },
  sheetSubtitle: {
    fontSize: 16,
    color: Colors.text,
  },
  spacing: {
    height: 32,
  },
});

export default createScenario(App, scenarioDescription);
