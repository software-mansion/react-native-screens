import React, { useRef, useState } from 'react';
import { Button, StyleSheet, Switch, Text, View } from 'react-native';
import {
  ScreenStack,
  ScreenStackItem,
  type SheetCommands,
} from 'react-native-screens';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';
import { scenarioDescription } from './scenario-description';

const THREE_DETENTS = [0.3, 0.6, 1.0];
const TWO_DETENTS = [0.4, 1.0];

function TestStackV4SheetSelectDetent() {
  const sheetRef = useRef<SheetCommands>(null);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [useThreeDetents, setUseThreeDetents] = useState(true);
  const [detentIndex, setDetentIndex] = useState(0);
  const [stableEventCount, setStableEventCount] = useState(0);

  const detents = useThreeDetents ? THREE_DETENTS : TWO_DETENTS;

  const openSheet = () => {
    setDetentIndex(0);
    setStableEventCount(0);
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  return (
    <ScreenStack style={styles.container}>
      <ScreenStackItem
        screenId="home"
        style={StyleSheet.absoluteFill}
        headerConfig={{ title: 'Sheet selectDetent' }}>
        <View style={styles.home}>
          <View style={styles.controls}>
            <Text style={styles.statusText}>
              Detents: {JSON.stringify(detents)}
            </Text>
            <Switch
              value={useThreeDetents}
              onValueChange={setUseThreeDetents}
            />
          </View>
          <Button
            title="Open form sheet"
            color={Colors.primary}
            onPress={openSheet}
          />
        </View>
      </ScreenStackItem>
      {isSheetOpen && (
        <ScreenStackItem
          screenId="sheet"
          style={StyleSheet.absoluteFill}
          stackPresentation="formSheet"
          sheetAllowedDetents={detents}
          sheetGrabberVisible
          sheetRef={sheetRef}
          headerConfig={{ hidden: true }}
          onSheetDetentChanged={e => {
            setDetentIndex(e.nativeEvent.index);
            if (e.nativeEvent.isStable) {
              setStableEventCount(count => count + 1);
            }
          }}
          onDismissed={closeSheet}>
          <View style={styles.sheet}>
            <View style={styles.stateCard}>
              <Text style={styles.instruction}>Detent index</Text>
              <Text style={styles.hugeText}>{detentIndex}</Text>
              <Text style={styles.instruction}>
                Stable onSheetDetentChanged calls: {stableEventCount}
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
              onPress={closeSheet}
            />
          </View>
        </ScreenStackItem>
      )}
    </ScreenStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  home: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.offBackground,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: 16,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  statusText: {
    fontSize: 16,
    marginRight: 12,
    color: Colors.text,
  },
  sheet: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingTop: 24,
    paddingHorizontal: 16,
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
});

export default createScenario(
  TestStackV4SheetSelectDetent,
  scenarioDescription,
);
