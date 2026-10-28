import React, { useRef, useState } from 'react';
import { Button, Platform, StyleSheet, Switch, Text, View } from 'react-native';
import { FormSheet, type FormSheetCommands } from 'react-native-screens';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';
import { scenarioDescription } from './scenario-description';

const THREE_DETENTS = [0.3, 0.6, 1.0];
const TWO_DETENTS = [0.4, 1.0];

function TestFormSheetSelectDetent() {
  const sheetRef = useRef<FormSheetCommands>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [useThreeDetents, setUseThreeDetents] = useState(true);
  const [selectLastOnWillAppear, setSelectLastOnWillAppear] = useState(false);
  const [detentIndex, setDetentIndex] = useState(0);
  const [detentChangedCount, setDetentChangedCount] = useState(0);

  const detents = useThreeDetents ? THREE_DETENTS : TWO_DETENTS;

  const handleOpen = () => {
    setDetentIndex(0);
    setDetentChangedCount(0);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>selectDetent Test</Text>

      <View style={styles.controls}>
        <Text style={styles.statusText}>
          Detents: {JSON.stringify(detents)}
        </Text>
        <Switch value={useThreeDetents} onValueChange={setUseThreeDetents} />
      </View>

      <View style={styles.controls}>
        <Text style={styles.statusText}>
          Select 'last' in onWillAppear: {selectLastOnWillAppear ? 'ON' : 'OFF'}
        </Text>
        <Switch
          value={selectLastOnWillAppear}
          onValueChange={setSelectLastOnWillAppear}
        />
      </View>

      <View style={styles.spacing} />

      <Button
        title="Open FormSheet"
        color={Colors.primary}
        onPress={handleOpen}
      />
      <Button
        title="Select 'last' while closed"
        onPress={() => sheetRef.current?.selectDetent('last')}
      />

      <FormSheet
        ref={sheetRef}
        isOpen={isOpen}
        onNativeDismiss={handleClose}
        detents={detents}
        onWillAppear={() => {
          if (selectLastOnWillAppear) {
            sheetRef.current?.selectDetent('last');
          }
        }}
        onDetentChanged={e => {
          setDetentIndex(e.nativeEvent.index);
          setDetentChangedCount(count => count + 1);
        }}>
        <View style={styles.sheetContainer}>
          <View style={styles.stateCard}>
            <Text style={styles.instruction}>Active Index</Text>
            <Text style={styles.hugeText}>{detentIndex}</Text>
            <Text style={styles.instruction}>
              onDetentChanged calls: {detentChangedCount}
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <Button
              title="Select 0"
              onPress={() => sheetRef.current?.selectDetent(0)}
            />
            <Button
              title="Select 1"
              onPress={() => sheetRef.current?.selectDetent(1)}
            />
            <Button
              title="Select 'last'"
              onPress={() => sheetRef.current?.selectDetent('last')}
            />
          </View>

          <Button
            title="Dismiss from JS"
            color={Colors.primary}
            onPress={handleClose}
          />
        </View>
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.text,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  statusText: {
    fontSize: 16,
    marginRight: 12,
    color: Colors.text,
  },
  sheetContainer: {
    flex: 1,
    justifyContent: Platform.OS === 'ios' ? 'center' : 'flex-start',
    backgroundColor: Colors.background,
    padding: 16,
    alignItems: 'center',
  },
  stateCard: {
    backgroundColor: Colors.NavyLight10,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    width: '80%',
  },
  hugeText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.NavyDark140,
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.NavyLight60,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  spacing: {
    height: 20,
  },
});

export default createScenario(TestFormSheetSelectDetent, scenarioDescription);
