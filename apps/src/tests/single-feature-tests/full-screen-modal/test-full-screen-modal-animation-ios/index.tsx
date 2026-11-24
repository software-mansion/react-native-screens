import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  FullScreenModalOverContent,
  FullScreenModalReplacingContent,
  type FullScreenModalOverContentAnimation,
  type FullScreenModalReplacingContentAnimation,
} from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { SettingsPicker } from '@apps/shared/SettingsPicker';
import { Colors } from '@apps/shared/styling';

const REPLACING_ANIMATIONS: FullScreenModalReplacingContentAnimation[] = [
  'default',
  'none',
  'coverVertical',
  'crossDissolve',
  'flipHorizontal',
];
const OVER_ANIMATIONS: FullScreenModalOverContentAnimation[] = [
  'default',
  'none',
  'coverVertical',
  'crossDissolve',
];

function TestFullScreenModalReplacingContentAnimation() {
  const [isReplacingOpen, setIsReplacingOpen] = useState(false);
  const [isOverOpen, setIsOverOpen] = useState(false);
  const [replacingAnimation, setReplacingAnimation] =
    useState<FullScreenModalReplacingContentAnimation>('default');
  const [overAnimation, setOverAnimation] =
    useState<FullScreenModalOverContentAnimation>('default');

  const replacingPicker = (
    <SettingsPicker
      closeOnSelect
      label="Replacing animation"
      items={REPLACING_ANIMATIONS}
      value={replacingAnimation}
      onValueChange={setReplacingAnimation}
    />
  );
  const overPicker = (
    <SettingsPicker
      closeOnSelect
      label="Over animation"
      items={OVER_ANIMATIONS}
      value={overAnimation}
      onValueChange={setOverAnimation}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Presenter screen</Text>
      {replacingPicker}
      <Button
        title="Open replacing"
        color={Colors.primary}
        onPress={() => setIsReplacingOpen(true)}
        testID="open-replacing-button"
      />
      {overPicker}
      <Button
        title="Open over"
        color={Colors.primary}
        onPress={() => setIsOverOpen(true)}
        testID="open-over-button"
      />

      <FullScreenModalReplacingContent
        isOpen={isReplacingOpen}
        animation={replacingAnimation}
        onNativeDismiss={() => setIsReplacingOpen(false)}>
        <ModalContent
          title="Replacing modal"
          picker={replacingPicker}
          onClose={() => setIsReplacingOpen(false)}
        />
      </FullScreenModalReplacingContent>

      <FullScreenModalOverContent
        isOpen={isOverOpen}
        animation={overAnimation}
        onNativeDismiss={() => setIsOverOpen(false)}>
        <ModalContent
          title="Over modal"
          picker={overPicker}
          onClose={() => setIsOverOpen(false)}
        />
      </FullScreenModalOverContent>
    </View>
  );
}

interface ModalContentProps {
  title: string;
  picker: React.ReactNode;
  onClose: () => void;
}

function ModalContent({ title, picker, onClose }: ModalContentProps) {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        {picker}
        <Button
          title="Close"
          color={Colors.primary}
          onPress={onClose}
          testID="close-button"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 120,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.offBackground,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
  },
  card: {
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
});

export default createScenario(
  TestFullScreenModalReplacingContentAnimation,
  scenarioDescription,
);
