import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  ScreenStack,
  ScreenStackHeaderSearchBarView,
  ScreenStackItem,
  SearchBar,
} from 'react-native-screens';
import { SettingsSwitch } from '@apps/shared/SettingsSwitch';
import { Colors } from '@apps/shared/styling';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

function TestStackV4LargeTitleLetterSpacingIOS() {
  const [spacing, setSpacing] = useState<0 | -0.9 | 2 | undefined>(undefined);
  const [customTypography, setCustomTypography] = useState(false);
  const [searchBar, setSearchBar] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <ScreenStack style={styles.container}>
      <ScreenStackItem
        screenId="letter-spacing-home"
        style={StyleSheet.absoluteFill}
        unstable_safeAreaEdges={{ top: false }}
        headerConfig={{
          title: 'Large Title',
          largeTitle: true,
          translucent: true,
          // On iOS 26+, an opaque bar covers the large title hosted in the scroll view.
          backgroundColor: 'transparent',
          largeTitleLetterSpacing: spacing,
          largeTitleFontSize: customTypography ? 30 : undefined,
          largeTitleFontWeight: customTypography ? '700' : undefined,
          children: searchBar ? (
            <ScreenStackHeaderSearchBarView>
              <SearchBar hideWhenScrolling />
            </ScreenStackHeaderSearchBarView>
          ) : undefined,
        }}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          contentInsetAdjustmentBehavior="automatic">
          <Text>largeTitleLetterSpacing: {spacing ?? 'omitted'}</Text>
          <Button
            title="Cycle spacing: omitted / 0 / -0.9 / 2"
            onPress={() =>
              setSpacing(value =>
                value === undefined
                  ? 0
                  : value === 0
                  ? -0.9
                  : value === -0.9
                  ? 2
                  : undefined,
              )
            }
          />
          <SettingsSwitch
            label="Custom typography (30pt / 700)"
            value={customTypography}
            onValueChange={setCustomTypography}
          />
          <SettingsSwitch
            label="Search bar"
            value={searchBar}
            onValueChange={setSearchBar}
          />
          <Button title="Push details" onPress={() => setShowDetails(true)} />
          {Array.from({ length: 40 }, (_, index) => (
            <Text key={index} style={styles.row}>
              Row {index + 1} — scroll to collapse the large title
            </Text>
          ))}
          <Button
            title="Push details with collapsed title"
            onPress={() => setShowDetails(true)}
          />
        </ScrollView>
      </ScreenStackItem>
      {showDetails && (
        <ScreenStackItem
          screenId="letter-spacing-details"
          style={StyleSheet.absoluteFill}
          nativeBackButtonDismissalEnabled
          onDismissed={() => setShowDetails(false)}
          headerConfig={{ title: 'Details', largeTitle: false }}>
          <View style={styles.content}>
            <Text>
              Swipe back slowly, cancel once, then complete. The previous large
              title should retain its spacing. Also try the native back button.
            </Text>
          </View>
        </ScreenStackItem>
      )}
    </ScreenStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  row: {
    paddingVertical: 12,
  },
});

export default createScenario(
  TestStackV4LargeTitleLetterSpacingIOS,
  scenarioDescription,
);
