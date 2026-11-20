import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  FullScreenModalOverContent,
  FullScreenModalReplacingContent,
  type FullScreenModalOrientation,
} from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { SettingsPicker } from '@apps/shared/SettingsPicker';
import { Colors } from '@apps/shared/styling';

const ORIENTATIONS: FullScreenModalOrientation[] = [
  'inherit',
  'portrait',
  'landscape',
];

function TestFullScreenModalOrientation() {
  const [isReplacingOpen, setIsReplacingOpen] = useState(false);
  const [isOverOpen, setIsOverOpen] = useState(false);
  const [orientation, setOrientation] =
    useState<FullScreenModalOrientation>('inherit');

  const picker = (
    <SettingsPicker
      closeOnSelect
      label="Modal orientation"
      items={ORIENTATIONS}
      value={orientation}
      onValueChange={setOrientation}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Presenter screen</Text>
      {picker}
      <View style={styles.row}>
        <Button
          title="Open replacing"
          color={Colors.primary}
          onPress={() => setIsReplacingOpen(true)}
          testID="open-replacing-button"
        />
        <Button
          title="Open over"
          color={Colors.primary}
          onPress={() => setIsOverOpen(true)}
          testID="open-over-button"
        />
      </View>

      <FullScreenModalReplacingContent
        isOpen={isReplacingOpen}
        orientation={orientation}
        onNativeDismiss={() => setIsReplacingOpen(false)}>
        <ModalContent
          title="Replacing modal"
          picker={picker}
          onClose={() => setIsReplacingOpen(false)}
        />
      </FullScreenModalReplacingContent>

      <FullScreenModalOverContent
        isOpen={isOverOpen}
        orientation={orientation}
        onNativeDismiss={() => setIsOverOpen(false)}>
        <ModalContent
          title="Over modal"
          picker={picker}
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
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.offBackground,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
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
  TestFullScreenModalOrientation,
  scenarioDescription,
);
