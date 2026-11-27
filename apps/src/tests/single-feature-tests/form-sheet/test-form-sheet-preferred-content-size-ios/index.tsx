import React, { useState } from 'react';
import {
  Button,
  type LayoutChangeEvent,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { FormSheet } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';

const CUSTOM_SIZE = { width: 400, height: 300 };

function LabeledSwitch({
  label,
  value,
  onValueChange,
  testID,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  testID: string;
}) {
  return (
    <View style={styles.controls}>
      <Text style={styles.statusText}>
        {label}: {value ? 'ON' : 'OFF'}
      </Text>
      <Switch value={value} onValueChange={onValueChange} testID={testID} />
    </View>
  );
}

function SheetContent({
  customSize,
  onCustomSizeChange,
  widthFollows,
  onWidthFollowsChange,
  onDismiss,
}: {
  customSize: boolean;
  onCustomSizeChange: (value: boolean) => void;
  widthFollows: boolean;
  onWidthFollowsChange: (value: boolean) => void;
  onDismiss: () => void;
}) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  );

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width: Math.round(width), height: Math.round(height) });
  };

  return (
    <View style={styles.sheetContent} onLayout={onLayout}>
      <Text style={styles.sheetTitle} testID="sheet-size">
        Sheet size: {size ? `${size.width} x ${size.height}` : '-'}
      </Text>
      <LabeledSwitch
        label="Custom size"
        value={customSize}
        onValueChange={onCustomSizeChange}
        testID="sheet-custom-size-switch"
      />
      <LabeledSwitch
        label="Width follows"
        value={widthFollows}
        onValueChange={onWidthFollowsChange}
        testID="sheet-width-follows-switch"
      />
      <Button title="Dismiss" color={Colors.primary} onPress={onDismiss} />
    </View>
  );
}

function TestFormSheetPreferredContentSize() {
  const [isOpen, setIsOpen] = useState(false);
  const [customSize, setCustomSize] = useState(false);
  const [widthFollows, setWidthFollows] = useState(false);

  return (
    <View style={styles.container}>
      <LabeledSwitch
        label="Custom size"
        value={customSize}
        onValueChange={setCustomSize}
        testID="custom-size-switch"
      />
      <LabeledSwitch
        label="Width follows"
        value={widthFollows}
        onValueChange={setWidthFollows}
        testID="width-follows-switch"
      />
      <View style={styles.spacing} />
      <Button
        title="Open FormSheet"
        color={Colors.primary}
        onPress={() => setIsOpen(true)}
        testID="open-formsheet-button"
      />
      <FormSheet
        isOpen={isOpen}
        onNativeDismiss={() => setIsOpen(false)}
        prefersEdgeAttachedInCompactHeight
        preferredContentSize={customSize ? CUSTOM_SIZE : undefined}
        widthFollowsPreferredContentSizeWhenEdgeAttached={widthFollows}>
        <SheetContent
          customSize={customSize}
          onCustomSizeChange={setCustomSize}
          widthFollows={widthFollows}
          onWidthFollowsChange={setWidthFollows}
          onDismiss={() => setIsOpen(false)}
        />
      </FormSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.offBackground,
    padding: 24,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    color: Colors.text,
  },
  sheetContent: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.text,
  },
  spacing: {
    height: 16,
  },
});

export default createScenario(
  TestFormSheetPreferredContentSize,
  scenarioDescription,
);
