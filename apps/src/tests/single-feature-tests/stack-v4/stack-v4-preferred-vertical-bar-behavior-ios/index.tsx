import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  ScreenStack,
  ScreenStackItem,
  type HeaderBarButtonItem,
} from 'react-native-screens';
import { SettingsPicker } from '@apps/shared/SettingsPicker';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

type Behavior = 'automatic' | 'disabled';
type Height = 'fitToContents' | 'large';

// A header item makes the bar placement visible: with `automatic` on the outer
// display it moves to the vertical bar, with `disabled` it stays in the header.
function closeButton(onPress: () => void): HeaderBarButtonItem[] {
  return [
    {
      type: 'button',
      title: 'Close',
      icon: { type: 'sfSymbol', name: 'xmark' },
      onPress,
    },
  ];
}

function TestStackV4PreferredVerticalBarBehavior() {
  const [behavior, setBehavior] = useState<Behavior>('automatic');
  const [height, setHeight] = useState<Height>('fitToContents');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <ScreenStack style={styles.container}>
      <ScreenStackItem
        screenId="home"
        style={StyleSheet.absoluteFill}
        headerConfig={{ title: 'Vertical Bar Behavior' }}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.screen}>
          <Text>
            Pick the sheet configuration, then open it. The configuration is
            read when the sheet is presented.
          </Text>
          <SettingsPicker<Behavior>
            label="preferredVerticalBarBehavior"
            items={['automatic', 'disabled']}
            value={behavior}
            onValueChange={setBehavior}
          />
          <SettingsPicker<Height>
            label="sheet height"
            items={['fitToContents', 'large']}
            value={height}
            onValueChange={setHeight}
          />
          <Button
            title="Open form sheet"
            onPress={() => setIsSheetOpen(true)}
          />
        </ScrollView>
      </ScreenStackItem>
      {isSheetOpen && (
        <ScreenStackItem
          screenId="sheet"
          style={StyleSheet.absoluteFill}
          stackPresentation="formSheet"
          preferredVerticalBarBehavior={behavior}
          sheetAllowedDetents={height === 'large' ? [1.0] : 'fitToContents'}
          sheetGrabberVisible
          headerConfig={{
            title: 'Sheet',
            headerRightBarButtonItems: closeButton(() => setIsSheetOpen(false)),
          }}
          onDismissed={() => setIsSheetOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.title}>
              preferredVerticalBarBehavior: {behavior}
            </Text>
            <View style={styles.fullWidthBar} />
            <Text>
              The orange bar spans the sheet's width. With `disabled` on the
              outer display, the close button stays in the horizontal header
              instead of moving to the vertical bar.
            </Text>
            <Button title="Close" onPress={() => setIsSheetOpen(false)} />
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
  screen: {
    gap: 12,
    padding: 16,
  },
  sheet: {
    gap: 12,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  fullWidthBar: {
    height: 24,
    marginHorizontal: -16,
    backgroundColor: 'orange',
  },
});

export default createScenario(
  TestStackV4PreferredVerticalBarBehavior,
  scenarioDescription,
);
